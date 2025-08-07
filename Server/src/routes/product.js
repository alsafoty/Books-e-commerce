const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { upload } = require("../middleware/imageUpload");
const { roleCheck } = require("../middleware/RBAC");

const {
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
} = require("../controllers/productController");

router.use(express.json());

// Create a product
router.post("/", verifyToken, roleCheck, upload.any(), createProduct);

// Create a group of products
router.post(
  "/group",
  verifyToken,
  roleCheck,
  upload.any(),
  createGroupOfProducts
);

// Get all Products
router.get("/", verifyToken, getAllProducts);

// Get products with pagination, filtering, and sorting
router.get("/browse", verifyToken, getProductsWithOptions);

// Get a Product by ID
router.get("/:id", verifyToken, getProductById);

// Get all images for a product
router.get("/:productId/images", verifyToken, getProductImages);

// Add images to existing product
router.post(
  "/:productId/images",
  verifyToken,
  roleCheck,
  upload.any(),
  addProductImages
);

// Delete product image
router.delete("/images/:imageId", verifyToken, roleCheck, deleteProductImage);

// Update a Product by ID (with optional image upload)
router.put("/:id", verifyToken, roleCheck, upload.any(), updateProductById);

// Delete a Product by ID
router.delete("/:id", verifyToken, roleCheck, deleteProductById);

module.exports = router;
