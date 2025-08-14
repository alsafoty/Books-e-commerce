const stream = require("stream");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer with file validation
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 10, // Maximum 10 files per request
  },

  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
    }
  },
});

// Reusable function to upload a single file to Cloudinary
const uploadFile = async (fileObject) => {
  try {
    if (!fileObject || !fileObject.buffer) {
      throw new Error("Invalid file object");
    }

    // Generate unique public_id
    const timestamp = Date.now();
    const filename = `Image_${timestamp}_${fileObject.originalname.trim()[0]}`;

    // Convert buffer to base64
    const base64 = `data:${
      fileObject.mimetype
    };base64,${fileObject.buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: "ecommerce/products",
      public_id: filename,
      resource_type: "auto",
      transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
    });

    console.log(
      `Uploaded file ${fileObject.originalname} with ID: ${result.public_id}`
    );

    // Return Cloudinary URL
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading file ${fileObject.originalname}:`, error);
    throw new Error(
      `Failed to upload ${fileObject.originalname}: ${error.message}`
    );
  }
};

// Function to upload multiple files and return their URLs
const uploadMultipleFiles = async (files) => {
  if (!files || files.length === 0) {
    return [];
  }

  const uploadedUrls = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const url = await uploadFile(files[i]);
      uploadedUrls.push(url);
    } catch (error) {
      console.error(`Error uploading file ${files[i].originalname}:`, error);
      errors.push({
        filename: files[i].originalname,
        error: error.message,
      });
    }
  }

  // If some uploads failed, throw error with details
  if (errors.length > 0) {
    const errorMessage = errors
      .map((e) => `${e.filename}: ${e.error}`)
      .join("; ");
    throw new Error(
      `Failed to upload ${errors.length} file(s): ${errorMessage}`
    );
  }

  return uploadedUrls;
};

// Function to delete a file from Cloudinary
const deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      console.log(`Deleted file with public_id: ${publicId}`);
      return true;
    } else {
      throw new Error(`Failed to delete file: ${result.result}`);
    }
  } catch (error) {
    console.error(`Error deleting file ${publicId}:`, error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

// Helper function to extract public_id from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  try {
    // Cloudinary URL format: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/public_id.jpg
    const match = url.match(/\/v\d+\/(.+)\.[\w]+$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error("Error extracting public_id from URL:", error);
    return null;
  }
};

module.exports = {
  upload,
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  extractPublicIdFromUrl,
};
