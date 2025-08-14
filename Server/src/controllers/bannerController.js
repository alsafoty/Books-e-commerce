const {
  uploadMultipleFiles,
  deleteFile,
  extractPublicIdFromUrl,
} = require("../middleware/imageUpload");
const { PrismaClient } = require("../../generated/prisma/client");

const prisma = new PrismaClient();

// Upload Banner - handles single or multiple banner images
const uploadBanner = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const { href } = req.body;

    // Upload files to Cloudinary
    const urls = await uploadMultipleFiles(req.files);

    // Create banner records in database
    const banners = [];
    for (const url of urls) {
      const banner = await prisma.bannerImage.create({
        data: {
          url: url,
          href: href || null,
          isActive: true,
        },
      });
      banners.push(banner);
    }

    res.status(201).json({
      message: "Banners uploaded successfully",
      banners: banners,
    });
  } catch (error) {
    console.error("Upload banner error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get All Banners
const getBanners = async (req, res) => {
  try {
    const banners = await prisma.bannerImage.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      banners: banners,
    });
  } catch (error) {
    console.error("Get banners error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Active Banners Only
const getActiveBanners = async (req, res) => {
  try {
    const banners = await prisma.bannerImage.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      banners: banners,
    });
  } catch (error) {
    console.error("Get active banners error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete Banner
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    // Find banner to get image URL
    const banner = await prisma.bannerImage.findUnique({
      where: { id: id },
    });

    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    // Delete image from Cloudinary
    const publicId = await extractPublicIdFromUrl(banner.url);

    await deleteFile(publicId);

    // Delete banner from database
    await prisma.bannerImage.delete({
      where: { id: id },
    });

    res.status(200).json({
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("Delete banner error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update Banner Status (activate/deactivate)
const updateBannerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const banner = await prisma.bannerImage.update({
      where: { id: id },
      data: { isActive: isActive },
    });

    res.status(200).json({
      message: "Banner status updated successfully",
      banner: banner,
    });
  } catch (error) {
    console.error("Update banner status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update Banner Details (href and/or status)
const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { href, isActive } = req.body;

    const updateData = {};
    if (href !== undefined) updateData.href = href;
    if (isActive !== undefined) updateData.isActive = isActive;

    const banner = await prisma.bannerImage.update({
      where: { id: id },
      data: updateData,
    });

    res.status(200).json({
      message: "Banner updated successfully",
      banner: banner,
    });
  } catch (error) {
    console.error("Update banner error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  uploadBanner,
  getBanners,
  getActiveBanners,
  deleteBanner,
  updateBannerStatus,
  updateBanner,
};
