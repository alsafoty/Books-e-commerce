const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { roleCheck } = require("../middleware/RBAC");

const {
  createAddress,
  getAddressByUserId,
  getAddressById,
  updateAddressById,
  deleteAddressById,
} = require("../controllers/addressController");

router.use(express.json());

// Create a Address
router.post("/", verifyToken, createAddress);

// Get a Address by ID
router.get("/:id", verifyToken, getAddressById);

// Get a Address by userID
router.get("/user/:id", verifyToken, getAddressByUserId);

// Update a Address by ID
router.put("/:id", verifyToken, updateAddressById);

// Delete a Address by ID
router.delete("/:id", verifyToken, deleteAddressById);

module.exports = router;
