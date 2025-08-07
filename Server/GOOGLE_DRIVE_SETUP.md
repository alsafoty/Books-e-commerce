# Google Drive Setup Guide for Service Account Storage Issue

## Problem
Service accounts have no storage quota by default, which causes the error:
"Service Accounts do not have storage quota. Leverage shared drives or use OAuth delegation instead."

## Solution 1: Create and Use a Shared Drive (Recommended)

### Step 1: Create a Shared Drive
1. Go to [Google Drive](https://drive.google.com)
2. Click on "Shared drives" in the left sidebar
3. Click "+ New" to create a new shared drive
4. Name it something like "E-commerce Product Images"
5. Click "Create"

### Step 2: Add Your Service Account to the Shared Drive
1. Open the shared drive you just created
2. Click the "Manage members" icon (👥)
3. Click "Add members"
4. Add your service account email (found in your `apikey.json` file under `client_email`)
5. Give it "Manager" or "Content manager" permissions
6. Click "Send"

### Step 3: Get the Shared Drive Folder ID
1. Open the shared drive
2. Create a folder called "Product Images" (optional, for organization)
3. Open the folder and copy the folder ID from the URL
   - URL format: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
   - The FOLDER_ID_HERE is what you need

### Step 4: Update Your Code
Replace the folder ID in your `imageUpload.js` file:

```javascript
// Current line in imageUpload.js (around line 67):
parents: ["1TV6LPsLBbAxQIxOSFhHbqP-pIDkgnGkz"],

// Replace with your shared drive folder ID:
parents: ["YOUR_SHARED_DRIVE_FOLDER_ID_HERE"],
```

## Solution 2: Alternative - Use Cloudinary (If Google Drive Issues Persist)

If shared drives don't work, consider using Cloudinary as an alternative:

### Install Cloudinary
```bash
npm install cloudinary
```

### Update imageUpload.js to use Cloudinary
```javascript
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret'
});

const uploadFile = async (fileObject) => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'product-images',
        public_id: `product_${Date.now()}_${fileObject.originalname.split('.')[0]}`
      },
      (error, result) => {
        if (error) throw error;
        return result;
      }
    );
    
    // Convert buffer to base64 and upload
    const base64 = `data:${fileObject.mimetype};base64,${fileObject.buffer.toString('base64')}`;
    const uploadResult = await cloudinary.uploader.upload(base64, {
      folder: 'product-images',
      public_id: `product_${Date.now()}_${fileObject.originalname.split('.')[0]}`
    });
    
    return uploadResult.secure_url;
  } catch (error) {
    throw new Error(`Failed to upload ${fileObject.originalname}: ${error.message}`);
  }
};
```

## Solution 3: Use Local Storage (Development Only)

For development purposes, you can store files locally:

```javascript
const fs = require('fs');
const path = require('path');

const uploadFile = async (fileObject) => {
  try {
    const uploadsDir = path.join(__dirname, '../../public/uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const filename = `product_${Date.now()}_${fileObject.originalname}`;
    const filepath = path.join(uploadsDir, filename);
    
    // Write file to disk
    fs.writeFileSync(filepath, fileObject.buffer);
    
    // Return local URL
    return `/uploads/${filename}`;
  } catch (error) {
    throw new Error(`Failed to upload ${fileObject.originalname}: ${error.message}`);
  }
};
```

## Recommended Steps

1. **Try Solution 1 first** (Shared Drive) - it's free and integrates well
2. **If that doesn't work**, try Solution 2 (Cloudinary) - has free tier
3. **For development only**, use Solution 3 (Local Storage)

## Current Code Updates Applied

I've already updated your `imageUpload.js` to support shared drives by adding:
- `supportsAllDrives: true`
- `supportsTeamDrives: true`
- Enhanced error handling

**Next step**: Create a shared drive and update the folder ID in your code.
