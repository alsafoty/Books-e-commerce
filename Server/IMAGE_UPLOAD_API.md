# Image Upload API Documentation

## Overview
This API supports image uploads to Google Drive for product management. Images are automatically uploaded to Google Drive and made publicly accessible for display in your e-commerce application.

## Configuration
1. Ensure you have a valid Google Drive API service account key in `/src/apikey.json`
2. The Google Drive folder ID is configured in the middleware (currently: "1TV6LPsLBbAxQIxOSFhHbqP-pIDkgnGkz")

## Image Upload Features
- **Supported formats**: JPEG, JPG, PNG, GIF, WEBP
- **File size limit**: 5MB per file
- **Maximum files**: 10 files per request for bulk operations, 5 for single product creation, 3 for adding to existing products
- **Automatic file naming**: Files are renamed with timestamp to avoid conflicts
- **Public access**: Images are automatically made publicly viewable
- **Google Drive integration**: Full CRUD operations (Create, Read, Delete)

## API Endpoints

### 1. Create Product with Images
**POST** `/api/product`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
```
name: "Product Name" (required)
description: "Product Description" (required)
price: "99.99" (required, must be > 0)
stock: "50" (optional, defaults to 0)
categoryId: "1" (required, must exist)
images: [file1.jpg, file2.jpg, ...] (optional, max 5 files)
```

**Response:**
```json
{
  "message": "Product created successfully",
  "product": {
    "id": 1,
    "name": "Product Name",
    "description": "Product Description",
    "price": 99.99,
    "stock": 50,
    "categoryId": 1,
    "Category": {...},
    "ProductImages": [
      {
        "id": "image_id",
        "url": "https://drive.google.com/uc?export=view&id=file_id",
        "productId": 1
      }
    ]
  },
  "uploadedImages": 2
}
```

### 2. Add Images to Existing Product
**POST** `/api/product/:productId/images`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
```
images: [file1.jpg, file2.jpg, file3.jpg] (required, max 3 files)
```

**Response:**
```json
{
  "message": "3 images added successfully",
  "product": {
    "id": 1,
    "ProductImages": [...]
  },
  "uploadedImageUrls": [
    "https://drive.google.com/uc?export=view&id=file_id1",
    "https://drive.google.com/uc?export=view&id=file_id2"
  ]
}
```

### 3. Get Product Images
**GET** `/api/product/:productId/images`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "id": 1,
  "name": "Product Name",
  "ProductImages": [
    {
      "id": "image_id",
      "url": "https://drive.google.com/uc?export=view&id=file_id",
      "createdAt": "2025-08-07T10:00:00.000Z"
    }
  ]
}
```

### 4. Delete Product Image
**DELETE** `/api/product/images/:imageId`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "message": "Image deleted successfully"
}
```

### 5. Update Product (with optional images)
**PUT** `/api/product/:id`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
```
name: "Updated Name" (optional)
description: "Updated Description" (optional)
price: "149.99" (optional)
stock: "75" (optional)
categoryId: "2" (optional)
images: [file1.jpg, file2.jpg] (optional, max 3 files)
```

### 6. Create Multiple Products
**POST** `/api/product/group`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
```
products: JSON.stringify([
  {
    name: "Product 1",
    description: "Description 1",
    price: 99.99,
    stock: 50,
    categoryId: 1,
    imageCount: 2
  },
  {
    name: "Product 2",
    description: "Description 2", 
    price: 149.99,
    stock: 30,
    categoryId: 1,
    imageCount: 1
  }
])
files: [image1.jpg, image2.jpg, image3.jpg] (images for all products in order)
```

## Error Handling

### Common Error Responses:

**400 Bad Request:**
```json
{
  "error": "Name, description, price, and categoryId are required"
}
```

**413 Payload Too Large:**
```json
{
  "error": "File too large"
}
```

**422 Unprocessable Entity:**
```json
{
  "error": "Only image files are allowed (jpeg, jpg, png, gif, webp)"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to upload images. Please try again later.",
  "details": "Specific error message"
}
```

## Frontend Integration Examples

### JavaScript/Fetch Example:
```javascript
async function createProductWithImages(productData, imageFiles) {
  const formData = new FormData();
  
  // Add product data
  Object.keys(productData).forEach(key => {
    formData.append(key, productData[key]);
  });
  
  // Add image files
  imageFiles.forEach(file => {
    formData.append('images', file);
  });
  
  const response = await fetch('/api/product', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: formData
  });
  
  return response.json();
}
```

### React Example:
```jsx
function ProductImageUpload({ productId }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };
  
  const handleUpload = async () => {
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });
    
    try {
      const response = await fetch(`/api/product/${productId}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData
      });
      
      const result = await response.json();
      console.log('Images uploaded:', result);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  
  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />
      <button onClick={handleUpload}>Upload Images</button>
    </div>
  );
}
```

## Security Considerations

1. **Authentication Required**: All endpoints require valid JWT token
2. **File Type Validation**: Only image files are allowed
3. **File Size Limits**: 5MB per file to prevent abuse
4. **Rate Limiting**: Consider implementing rate limiting for upload endpoints
5. **Input Validation**: All product data is validated before processing

## Performance Tips

1. **Image Optimization**: Consider resizing images on the client side before upload
2. **Batch Operations**: Use the group creation endpoint for multiple products
3. **Error Handling**: Always handle upload failures gracefully
4. **Progress Tracking**: Implement upload progress indicators for better UX
5. **Caching**: Google Drive URLs are stable and can be cached

## Troubleshooting

### Common Issues:

1. **"Google Drive authentication failed"**
   - Check if apikey.json exists and has correct credentials
   - Verify Google Drive API is enabled
   - Ensure service account has access to the target folder

2. **"Failed to upload images"**
   - Check internet connectivity
   - Verify file formats are supported
   - Ensure files are under size limit

3. **"Maximum X images allowed per product"**
   - Current limit is 10 images per product
   - Delete existing images before adding new ones if at limit

4. **"Category not found"**
   - Ensure the categoryId exists in the database
   - Create categories before creating products
