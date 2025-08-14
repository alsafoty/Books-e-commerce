const express = require("express");
const router = express.Router();
const { verifyOTP } = require("../middleware/otp");
const { verifyToken } = require("../middleware/auth");
const { verifyPass } = require("../middleware/passreset");
const { roleCheck } = require("../middleware/RBAC");
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  passwordReset,
  otpVerify,
  passwordResetConfirm,
} = require("../controllers/userController");

router.use(express.json());

// Register a new user
router.post("/Register", registerUser);

// Route to authenticate and log in a user
router.post("/login", loginUser);

// Get all users
router.get("/", verifyToken, roleCheck, getAllUsers);

// Get a user by ID
router.get("/:id", verifyToken, getUserById);

// Update a user by ID
router.put("/:id", verifyToken, updateUserById);

// Delete a user by ID
router.delete("/:id", verifyToken, deleteUserById);

// Resetting user passowrd
router.post("/password-reset", passwordReset);

// Uploading banner images (Admins Only)
router.post("/banner", verifyToken, roleCheck);

//OTP Validation
router.post("/otp/verify", verifyOTP, otpVerify);

router.post("/password-resetting", verifyPass, passwordResetConfirm);

module.exports = router;
