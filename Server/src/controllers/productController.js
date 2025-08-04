const { PrismaClient } = require("../../generated/prisma/client");

const prisma = new PrismaClient();

// Create a product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, images } = req.body;

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

    // Create product images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      const imageData = images.map((imageUrl) => ({
        productId: newProduct.id,
        url: imageUrl,
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
    });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create multiple products
const createGroupOfProducts = async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res
        .status(400)
        .json({ error: "Request body must be an array of products" });
    }

    if (req.body.length === 0) {
      return res.status(400).json({ error: "Array cannot be empty" });
    }

    const results = [];
    const errors = [];

    for (let i = 0; i < req.body.length; i++) {
      try {
        const { name, description, price, stock, categoryId, images } =
          req.body[i];

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

        // Create product images if provided
        if (images && Array.isArray(images) && images.length > 0) {
          const imageData = images.map((imageUrl) => ({
            productId: newProduct.id,
            url: imageUrl,
          }));

          await prisma.productImage.createMany({
            data: imageData,
          });
        }

        results.push(newProduct);
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

const getProductByPage = async (req, res) => {
  try {
    const page = parseInt(req.params.page);

    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: "Invalid page number" });
    }

    const pageProducts = await prisma.product.findMany({
      take: 16,
      skip: 16 * (page - 1),
      include: {
        Category: true,
        ProductImages: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(pageProducts);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        Category: true,
        ProductImages: true,
      },
      orderBy: {
        createdAt: "desc",
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

// Update a product by ID
const updateProductById = (req, res) => {
  let id = req.params.id;
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
      id = result.id.toString();
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

// Delete a product by ID
const deleteProductById = (req, res) => {
  const id = req.params.id;
  prisma.product
    .delete({
      where: { id: id },
    })
    .then((result) => {
      if (!result) {
        return res
          .status(400)
          .json({ error: "product with given id doesn't exist" });
      }
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Add images to existing product
const addProductImages = async (req, res) => {
  try {
    const { productId } = req.params;
    const { images } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: "Images array is required" });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Create image records
    const imageData = images.map((imageUrl) => ({
      productId: parseInt(productId),
      url: imageUrl,
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
  getProductByPage,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  addProductImages,
  deleteProductImage,
  getProductImages,
};
