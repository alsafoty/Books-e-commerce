const { parse } = require("path");
const { PrismaClient } = require("../../generated/prisma/client");
const {
  uploadMultipleFiles,
  deleteFile,
  extractPublicIdFromUrl,
} = require("../middleware/imageUpload");

const prisma = new PrismaClient();

// Create a product with file upload
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId } = req.body;
    const files = req.files || [];

    if (!name || !description || !price || !categoryId) {
      return res.status(400).json({
        error: "Name, description, price, and categoryId are required",
      });
    }

    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (price <= 0) {
      return res.status(400).json({ error: "Price must be greater than 0" });
    }

    if (stock < 0) {
      return res.status(400).json({ error: "Stock cannot be negative" });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        categoryId: parseInt(categoryId),
      },
    });

    // Upload images to Google Drive if files are provided
    let uploadedImageUrls = [];
    if (files.length > 0) {
      try {
        uploadedImageUrls = await uploadMultipleFiles(files);
        console.log(
          `Uploaded ${uploadedImageUrls.length} images for product ${newProduct.id}`
        );
      } catch (uploadError) {
        console.error("Error uploading images:", uploadError);
        return res.status(500).json({
          error: "Failed to upload images. Please try again later.",
        });
      }
    }

    // Create product images records if uploads were successful
    if (uploadedImageUrls.length > 0) {
      const imageData = uploadedImageUrls.map((url) => ({
        productId: newProduct.id,
        url: url,
      }));

      await prisma.productImage.createMany({
        data: imageData,
      });
    }

    // Get product with images and category
    const result = await prisma.product.findUnique({
      where: { id: newProduct.id },
      include: {
        Category: true,
        ProductImages: true,
      },
    });

    res.status(201).json({
      message: "Product created successfully",
      product: result,
      uploadedImages: uploadedImageUrls.length,
    });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create multiple products with file upload
const createGroupOfProducts = async (req, res) => {
  try {
    const files = req.files || [];

    // Parse products data from form data
    const productsData = req.body.products
      ? JSON.parse(req.body.products)
      : req.body;

    if (!Array.isArray(productsData)) {
      return res
        .status(400)
        .json({ error: "Request body must be an array of products" });
    }

    if (productsData.length === 0) {
      return res.status(400).json({ error: "Array cannot be empty" });
    }

    const results = [];
    const errors = [];
    let fileIndex = 0;

    for (let i = 0; i < productsData.length; i++) {
      try {
        const {
          name,
          description,
          price,
          stock,
          categoryId,
          imageCount = 0,
        } = productsData[i];

        if (!name || !description || !price || !categoryId) {
          errors.push(
            `Product ${
              i + 1
            }: Name, description, price, and categoryId are required`
          );
          continue;
        }

        // Validate category exists
        const category = await prisma.category.findUnique({
          where: { id: parseInt(categoryId) },
        });

        if (!category) {
          errors.push(`Product ${i + 1}: Category not found`);
          continue;
        }

        // Create the product
        const newProduct = await prisma.product.create({
          data: {
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock) || 0,
            categoryId: parseInt(categoryId),
          },
        });

        // Handle file uploads for this product
        let uploadedImageUrls = [];
        const productFiles = files.slice(
          fileIndex,
          fileIndex + parseInt(imageCount)
        );
        fileIndex += parseInt(imageCount);

        if (productFiles.length > 0) {
          try {
            uploadedImageUrls = await uploadMultipleFiles(productFiles);
            console.log(
              `Uploaded ${uploadedImageUrls.length} images for product ${newProduct.id}`
            );
          } catch (uploadError) {
            console.error(
              `Error uploading images for product ${i + 1}:`,
              uploadError
            );
            // Continue without images if upload fails
          }
        }

        // Create product images if uploads were successful
        if (uploadedImageUrls.length > 0) {
          const imageData = uploadedImageUrls.map((url) => ({
            productId: newProduct.id,
            url: url,
          }));

          await prisma.productImage.createMany({
            data: imageData,
          });
        }

        results.push({
          ...newProduct,
          uploadedImages: uploadedImageUrls.length,
        });
      } catch (error) {
        errors.push(`Product ${i + 1}: ${error.message}`);
      }
    }

    res.status(201).json({
      message: `${results.length} products created successfully`,
      count: results.length,
      products: results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Group product creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get products with pagination, filtering, and sorting
const getProductsWithOptions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 16,
      searchTerm,
      sortBy = "createdAt",
      order = "desc",
      categoryId,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ error: "Invalid page number" });
    }

    const allowedLimits = [16, 25, 50, 100];
    if (!allowedLimits.includes(limitNum)) {
      return res.status(400).json({
        error: `Invalid limit. Allowed values: ${allowedLimits.join(", ")}`,
      });
    }

    const validSortFields = ["name", "price", "createdAt", "stock"];
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({
        error: `Invalid sortBy field. Valid options: ${validSortFields.join(
          ", "
        )}`,
      });
    }

    const validOrders = ["asc", "desc"];
    if (!validOrders.includes(order)) {
      return res.status(400).json({
        error: `Invalid order. Valid options: ${validOrders.join(", ")}`,
      });
    }

    const whereOptions = {
      AND: [],
    };

    if (searchTerm && searchTerm.trim() !== "") {
      whereOptions.AND.push({
        OR: [
          {
            name: {
              contains: searchTerm.trim(),
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchTerm.trim(),
              mode: "insensitive",
            },
          },
        ],
      });
    }

    if (categoryId) {
      whereOptions.AND.push({
        categoryId: parseInt(categoryId),
      });
    }

    const finalWhere = whereOptions.AND.length > 0 ? whereOptions : {};

    const productsCount = await prisma.product.count({
      where: finalWhere,
    });
    const products = await prisma.product.findMany({
      where: finalWhere,
      include: {
        Category: true,
        ProductImages: true,
      },
      orderBy: {
        [sortBy]: order,
      },
      take: limitNum,
      skip: (pageNum - 1) * limitNum,
    });

    res.status(200).json({
      totalCount: productsCount,
      products,
    });
  } catch (error) {
    console.error("Get products with options error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// // Get filtered products by search input
// const getFilteredProducts = async (req, res) => {
//   try {
//     const searchTerm = req.query.input;

//     if (!searchTerm || searchTerm.trim() === "") {
//       return res.status(400).json({ error: "Search term is required" });
//     }

//     const filteredProducts = await prisma.product.findMany({
//       include: {
//         Category: true,
//         ProductImages: true,
//       },
//       where: {
//         OR: [
//           {
//             name: {
//               contains: searchTerm,
//               mode: "insensitive",
//             },
//           },
//           {
//             description: {
//               contains: searchTerm,
//               mode: "insensitive",
//             },
//           },
//         ],
//       },
//     });

//     res.status(200).json({ filteredProducts });
//   } catch (error) {
//     console.error("Get filtered products error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // Get sorted products
// const getSortedProducts = async (req, res) => {
//   try {
//     const { sortBy = "createdAt", order = "desc" } = req.query;

//     // Validate sortBy parameter
//     const validSortFields = ["name", "price", "createdAt", "stock"];
//     if (!validSortFields.includes(sortBy)) {
//       return res.status(400).json({
//         error: `Invalid sortBy field. Valid options: ${validSortFields.join(
//           ", "
//         )}`,
//       });
//     }

//     // Validate order parameter
//     const validOrders = ["asc", "desc"];
//     if (!validOrders.includes(order)) {
//       return res.status(400).json({
//         error: `Invalid order. Valid options: ${validOrders.join(", ")}`,
//       });
//     }

//     const sortedProducts = await prisma.product.findMany({
//       include: {
//         Category: true,
//         ProductImages: true,
//       },
//       orderBy: {
//         [sortBy]: order,
//       },
//     });

//     res.status(200).json({
//       products: sortedProducts,
//     });
//   } catch (error) {
//     console.error("Get sorted products error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        Category: true,
        ProductImages: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Get all products error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        Category: true,
        ProductImages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Get product by ID error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProductById = async (req, res) => {
  let id = parseInt(req.params.id);

  prisma.product
    .findUnique({
      where: { id: id },
    })
    .then((result) => {
      if (!result) {
        return res
          .status(400)
          .json({ error: "product with given id doesn't exist" });
      }
      id = result.id;
      prisma.product
        .update({
          where: { id: id },
          data: req.body,
        })
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getTotalProducts = async (req, res) => {
  try {
    const totalProducts = await prisma.product.count();
    res.status(200).json({ totalProducts });
  } catch (error) {
    console.error("Get total products error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const existingProduct = await prisma.product.findUnique({
      where: { id: id },
      include: { ProductImages: true },
    });

    if (!existingProduct) {
      return res
        .status(404)
        .json({ error: "Product with given ID doesn't exist" });
    }

    for (const image of existingProduct.ProductImages) {
      try {
        const publicId = extractPublicIdFromUrl(image.url);
        if (publicId) {
          await deleteFile(publicId);
          console.log(`Deleted image from Cloudinary: ${publicId}`);
        }
      } catch (cloudinaryError) {
        console.error(
          `Error deleting image ${image.id} from Cloudinary:`,
          cloudinaryError
        );
      }
    }

    const deletedProduct = await prisma.product.delete({
      where: { id: id },
    });

    res.status(200).json({
      message: "Product and associated images deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Delete product error:", error.meta.constraint);
    if (error.meta.constraint === "OrderItem_productId_fkey") {
      res.status(400).json({ error: "Product has associated orders" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// Add images to existing product
const addProductImages = async (req, res) => {
  try {
    const { productId } = req.params;
    const files = req.files || [];

    if (files.length === 0) {
      return res.status(400).json({ error: "No image files provided" });
    }

    // Limit the number of files for this specific endpoint
    if (files.length > 3) {
      return res.status(400).json({
        error: `Maximum 3 images allowed per request. You sent ${files.length} files.`,
      });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
      include: { ProductImages: true },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if adding these images would exceed reasonable limit (e.g., 10 images total)
    const currentImageCount = product.ProductImages.length;
    const maxImages = 10;

    if (currentImageCount + files.length > maxImages) {
      return res.status(400).json({
        error: `Maximum ${maxImages} images allowed per product. Current: ${currentImageCount}, Attempting to add: ${files.length}`,
      });
    }

    // Upload images to Google Drive
    let uploadedImageUrls = [];
    try {
      uploadedImageUrls = await uploadMultipleFiles(files);
      console.log(
        `Uploaded ${uploadedImageUrls.length} images for product ${productId}`
      );
    } catch (uploadError) {
      console.error("Error uploading images:", uploadError);
      return res.status(500).json({
        error: "Failed to upload images. Please try again later.",
        details: uploadError.message,
      });
    }

    // Create image records
    const imageData = uploadedImageUrls.map((url) => ({
      productId: parseInt(productId),
      url: url,
    }));

    const newImages = await prisma.productImage.createMany({
      data: imageData,
    });

    // Return updated product with all images
    const updatedProduct = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
      include: {
        Category: true,
        ProductImages: true,
      },
    });

    res.status(201).json({
      message: `${newImages.count} images added successfully`,
      product: updatedProduct,
      uploadedImageUrls: uploadedImageUrls,
    });
  } catch (error) {
    console.error("Add product images error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete product image
const deleteProductImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Extract public_id from Cloudinary URL and delete from Cloudinary
    try {
      const publicId = extractPublicIdFromUrl(image.url);
      console.log(`Deleting image from Cloudinary: ${publicId}`);
      if (publicId) {
        await deleteFile(publicId);
        console.log(`Deleted image from Cloudinary: ${publicId}`);
      }
    } catch (cloudinaryError) {
      console.error("Error deleting from Cloudinary:", cloudinaryError);
      // Continue with database deletion even if Cloudinary deletion fails
    }

    // Delete from database
    await prisma.productImage.delete({
      where: { id: imageId },
    });

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete product image error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all images for a product
const getProductImages = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
      select: {
        id: true,
        name: true,
        ProductImages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      productId: product.id,
      productName: product.name,
      images: product.ProductImages,
    });
  } catch (error) {
    console.error("Get product images error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createProduct,
  createGroupOfProducts,
  getProductsWithOptions,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  addProductImages,
  deleteProductImage,
  getProductImages,
  getTotalProducts,
};
