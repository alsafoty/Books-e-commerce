const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
  deleteOrderById,
  getSuccessfulOrdersStats,
} = require("../controllers/orderController");
const { verifyToken } = require("../middleware/auth");
const { roleCheck } = require("../middleware/RBAC");

// Create order from cart ✅
router.post("/", verifyToken, createOrder);

// Get user's own orders  ✅
router.get("/my-orders", verifyToken, getUserOrders);

// Get all orders (Admin only) ✅
router.get("/", verifyToken, roleCheck, getAllOrders);

// Get successful orders statistics (Admin only) ✅
router.get("/stats", verifyToken, roleCheck, getSuccessfulOrdersStats);

// Get orders by user ID (Admin only) ✅
router.get("/user/:userId", verifyToken, roleCheck, getOrdersByUserId);

// Get order by ID ✅
router.get("/:id", verifyToken, roleCheck, getOrderById);

// Update order status (Admin only) ✅
router.put("/:id/status", verifyToken, roleCheck, updateOrderStatus);

// Delete order by ID (Admin only) ✅
router.delete("/:id", verifyToken, roleCheck, deleteOrderById);

module.exports = router;
