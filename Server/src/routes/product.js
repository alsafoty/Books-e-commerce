const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

const {
  createProduct,
  createGroupOfProducts,
  getProductByPage,
  getFilteredProducts,
  getSortedProducts,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  addProductImages,
  deleteProductImage,
  getProductImages,
} = require("../controllers/productController");

router.use(express.json());

// Create a product
router.post("/", verifyToken, createProduct);

// Create a group of product
router.post("/group", verifyToken, createGroupOfProducts);

// Get all Products
router.get("/", verifyToken, getAllProducts);

// Get a Products by page (for pagination)
router.get("/page/:page", verifyToken, getProductByPage);

//Get all products for some search
router.get("/search", verifyToken, getFilteredProducts);

//Get sorted products
router.get("/sorted", verifyToken, getSortedProducts);

// Get a Product by ID
router.get("/:id", verifyToken, getProductById);

// Get all images for a product
router.get("/:productId/images", verifyToken, getProductImages);

// Add images to existing product
router.post("/:productId/images", verifyToken, addProductImages);

// Delete product image
router.delete("/images/:imageId", verifyToken, deleteProductImage);

// Update a Product by ID
router.put("/:id", verifyToken, updateProductById);

// Delete a Product by ID
router.delete("/:id", verifyToken, deleteProductById);

module.exports = router;
