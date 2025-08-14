const { PrismaClient } = require("@prisma/client");
const {
  uploadMultipleFiles,
  deleteFile,
  extractPublicIdFromUrl,
} = require("../middleware/imageUpload");

const prisma = new PrismaClient();

// Create a category with optional image upload
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const files = req.files || [];

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    // Create the category first
    const newCategory = await prisma.category.create({
      data: {
        name,
        description: description || null,
      },
    });

    let uploadedImageUrl = null;

    // Handle single image upload if provided
    if (files.length > 0) {
      try {
        // Only take the first file since each category should have just one image
        const singleFile = [files[0]];
        const uploadedUrls = await uploadMultipleFiles(singleFile);
        uploadedImageUrl = uploadedUrls[0];

        // Create category image record
        await prisma.categoryImage.create({
          data: {
            categoryId: newCategory.id,
            url: uploadedImageUrl,
          },
        });

        console.log(
          `Uploaded image for category ${newCategory.id}: ${uploadedImageUrl}`
        );
      } catch (uploadError) {
        console.error("Error uploading category image:", uploadError);
        // Category was created but image upload failed
        return res.status(500).json({
          error:
            "Category created but image upload failed. You can add an image later.",
          category: newCategory,
        });
      }
    }

    // Get the complete category with image
    const result = await prisma.category.findUnique({
      where: { id: newCategory.id },
      include: {
        CategoryImage: true,
        Product: true,
      },
    });

    res.status(201).json({
      message: "Category created successfully",
      category: result,
      hasImage: !!uploadedImageUrl,
    });
  } catch (error) {
    console.error("Category creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        CategoryImage: true,
        Product: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a category by ID
const getCategoryById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const category = await prisma.category.findUnique({
      where: { id: id },
      include: {
        CategoryImage: true,
        Product: {
          include: {
            ProductImages: true,
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Get category by ID error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a category by ID with optional image upload
const updateCategoryById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;
    const files = req.files || [];

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: id },
      include: {
        CategoryImage: true,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Update category basic info
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    const updatedCategory = await prisma.category.update({
      where: { id: id },
      data: updateData,
    });

    let newImageUrl = null;

    // Handle image upload if provided
    if (files.length > 0) {
      try {
        // Delete existing image if it exists
        if (existingCategory.CategoryImage) {
          console.log(existingCategory.CategoryImage.url);
          const publicId = await extractPublicIdFromUrl(
            existingCategory.CategoryImage.url.toString()
          );

          await deleteFile(publicId);

          // Delete from database
          await prisma.categoryImage.delete({
            where: { categoryId: id },
          });
        }

        // Upload new image (only take the first file)
        const singleFile = [files[0]];
        const uploadedUrls = await uploadMultipleFiles(singleFile);
        newImageUrl = uploadedUrls[0];

        // Create new category image record
        await prisma.categoryImage.create({
          data: {
            categoryId: id,
            url: newImageUrl,
          },
        });

        console.log(`Updated image for category ${id}: ${newImageUrl}`);
      } catch (uploadError) {
        console.error("Error updating category image:", uploadError);
        return res.status(500).json({
          error: "Category updated but image upload failed",
          category: updatedCategory,
        });
      }
    }

    // Get the complete updated category
    const result = await prisma.category.findUnique({
      where: { id: id },
      include: {
        CategoryImage: true,
        Product: true,
      },
    });

    res.status(200).json({
      message: "Category updated successfully",
      category: result,
      imageUpdated: !!newImageUrl,
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a category by ID
const deleteCategoryById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    // Find category with image to delete from cloud storage
    const category = await prisma.category.findUnique({
      where: { id: id },
      include: {
        CategoryImage: true,
        Product: true,
      },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Check if category has products
    if (category.Product && category.Product.length > 0) {
      return res.status(400).json({
        error:
          "Cannot delete category with existing products. Please move or delete products first.",
      });
    }

    // Delete image from cloud storage if it exists
    if (category.CategoryImage) {
      try {
        const publicId = await extractPublicIdFromUrl(
          category.CategoryImage.url
        );
        await deleteFile(publicId);
        console.log(`Deleted image for category ${id} from cloud storage`);
      } catch (deleteError) {
        console.error("Error deleting category image from cloud:", deleteError);
        // Continue with category deletion even if image deletion fails
      }
    }

    // Delete category (CategoryImage will be deleted automatically due to foreign key constraint)
    await prisma.category.delete({
      where: { id: id },
    });

    res.status(200).json({
      message: "Category deleted successfully",
      deletedCategory: {
        id: category.id,
        name: category.name,
        hadImage: !!category.CategoryImage,
      },
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update category image only
const updateCategoryImage = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const files = req.files || [];

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    if (files.length === 0) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: id },
      include: {
        CategoryImage: true,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Delete existing image if it exists
    if (existingCategory.CategoryImage) {
      try {
        const publicId = await extractPublicIdFromUrl(
          existingCategory.CategoryImage.url
        );
        await deleteFile(publicId);

        // Delete from database
        await prisma.categoryImage.delete({
          where: { categoryId: id },
        });
      } catch (deleteError) {
        console.error("Error deleting existing category image:", deleteError);
      }
    }

    // Upload new image (only take the first file)
    const singleFile = [files[0]];
    const uploadedUrls = await uploadMultipleFiles(singleFile);
    const newImageUrl = uploadedUrls[0];

    // Create new category image record
    const categoryImage = await prisma.categoryImage.create({
      data: {
        categoryId: id,
        url: newImageUrl,
      },
    });

    // Get the complete updated category
    const result = await prisma.category.findUnique({
      where: { id: id },
      include: {
        CategoryImage: true,
      },
    });

    res.status(200).json({
      message: "Category image updated successfully",
      category: result,
      imageUrl: newImageUrl,
    });
  } catch (error) {
    console.error("Update category image error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete category image only
const deleteCategoryImage = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    // Find category with image
    const category = await prisma.category.findUnique({
      where: { id: id },
      include: {
        CategoryImage: true,
      },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (!category.CategoryImage) {
      return res.status(404).json({ error: "Category has no image to delete" });
    }

    // Delete image from cloud storage
    try {
      const publicId = await extractPublicIdFromUrl(category.CategoryImage.url);
      await deleteFile(publicId);
    } catch (deleteError) {
      console.error("Error deleting image from cloud:", deleteError);
    }

    // Delete from database
    await prisma.categoryImage.delete({
      where: { categoryId: id },
    });

    // Get updated category
    const result = await prisma.category.findUnique({
      where: { id: id },
      include: {
        CategoryImage: true,
      },
    });

    res.status(200).json({
      message: "Category image deleted successfully",
      category: result,
    });
  } catch (error) {
    console.error("Delete category image error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  updateCategoryImage,
  deleteCategoryImage,
};
