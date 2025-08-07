const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

const {
  addToWishlist,
  getUserWishlist,
  removeFromWishlist,
  removeFromWishlistByProduct,
  clearWishlist,
} = require("../controllers/wishlistController");

router.use(express.json());

// Add product to wishlist ✅
router.post("/", verifyToken, addToWishlist);

// Get user's wishlist ✅
router.get("/user/:userId", verifyToken, getUserWishlist);

// Remove product from wishlist by wishlist item ID ✅
router.delete("/wishlistId/:wishlistId", verifyToken, removeFromWishlist);

// Remove product from wishlist by userId and productId ✅
router.delete("/productId", verifyToken, removeFromWishlistByProduct);

// Clear entire wishlist for user ✅
router.delete("/user/:userId", verifyToken, clearWishlist);

module.exports = router;
