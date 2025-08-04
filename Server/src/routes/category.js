const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} = require("../controllers/categoryController");

router.use(express.json());

// Create a category
router.post("/", verifyToken, createCategory);

// Get all categories
router.get("/", getAllCategories);

// Get a category by ID
router.get("/:id", getCategoryById);

// Update a category by ID
router.put("/:id", verifyToken, updateCategoryById);

// Delete a category by ID
router.delete("/:id", verifyToken, deleteCategoryById);

module.exports = router;
