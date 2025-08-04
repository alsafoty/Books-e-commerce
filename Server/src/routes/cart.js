const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

const {
  createCart,
  getCartById,
  getCartByUserId,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
  updateCartById,
  deleteCartById,
} = require("../controllers/CartController");

router.use(express.json());

// Create a Cart ✅
router.post("/", verifyToken, createCart);

// Get a Cart by ID ✅
router.get("/:id", verifyToken, getCartById);

// Get Cart by User ID ✅
router.get("/user/:userId", verifyToken, getCartByUserId);

// Add item to cart ✅
router.post("/item", verifyToken, addItemToCart);

// Update cart item quantity
router.put("/item/:cartItemId", verifyToken, updateCartItem);

// Remove item from cart
router.delete("/item/:cartItemId", verifyToken, removeItemFromCart);

// Clear all items from cart
router.delete("/:cartId/clear", verifyToken, clearCart);

// Update a Cart by ID
router.put("/:id", verifyToken, updateCartById);

// Delete a Cart by ID
router.delete("/:id", verifyToken, deleteCartById);

module.exports = router;
