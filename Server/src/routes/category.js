const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { roleCheck } = require("../middleware/RBAC");
const { upload } = require("../middleware/imageUpload");

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  updateCategoryImage,
  deleteCategoryImage,
} = require("../controllers/categoryController");

router.use(express.json());

// Create a category (with optional image upload)
router.post("/", verifyToken, roleCheck, upload.any(), createCategory);

// Get all categories
router.get("/", getAllCategories);

// Get a category by ID
router.get("/:id", getCategoryById);

// Update a category by ID (with optional image upload)
router.put("/:id", verifyToken, roleCheck, upload.any(), updateCategoryById);

// Delete a category by ID
router.delete("/:id", verifyToken, roleCheck, deleteCategoryById);

// Update category image only
router.put(
  "/:id/image",
  verifyToken,
  roleCheck,
  upload.any(),
  updateCategoryImage
);

// Delete category image only
router.delete("/:id/image", verifyToken, roleCheck, deleteCategoryImage);

module.exports = router;
