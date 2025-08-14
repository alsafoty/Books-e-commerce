const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { roleCheck } = require("../middleware/RBAC");
const { upload } = require("../middleware/imageUpload");

const router = express.Router();
const {
  uploadBanner,
  getBanners,
  getActiveBanners,
  deleteBanner,
  updateBannerStatus,
  updateBanner,
} = require("../controllers/bannerController");

// Public route - Get all active banners
router.get("/active", getActiveBanners);

// Admin only routes
router.post("/", verifyToken, roleCheck, upload.any(), uploadBanner);
router.get("/", verifyToken, roleCheck, getBanners);
router.put("/:id/status", verifyToken, roleCheck, updateBannerStatus);
router.put("/:id", verifyToken, roleCheck, updateBanner);
router.delete("/:id", verifyToken, roleCheck, deleteBanner);

module.exports = router;
