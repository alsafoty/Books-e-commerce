// Example test for addProductImages endpoint
// You can use this with tools like Postman, Insomnia, or curl

// ==== USING CURL ====
/*
curl -X POST \
  http://localhost:3000/api/product/1/images \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -F "image1=@/path/to/your/image1.jpg" \
  -F "image2=@/path/to/your/image2.jpg" \
  -F "file=@/path/to/your/image3.png"

Note: You can use ANY field name (image1, image2, file, photos, etc.)
*/

// ==== USING POSTMAN ====
/*
1. Set method to POST
2. URL: http://localhost:3000/api/product/{productId}/images
3. Headers:
   - Authorization: Bearer YOUR_JWT_TOKEN
4. Body:
   - Select "form-data"
   - Add files with ANY key name (e.g., "images", "file", "photo1", etc.)
   - Make sure to select "File" type for each entry
*/

// ==== USING JAVASCRIPT/FETCH ====
async function testAddProductImages(productId, imageFiles, authToken) {
  const formData = new FormData();
  
  // You can use any field names - they don't have to be "images"
  imageFiles.forEach((file, index) => {
    formData.append(`image${index}`, file);
    // or formData.append('file', file);
    // or formData.append('photo', file);
    // Any field name works now!
  });

  try {
    const response = await fetch(`http://localhost:3000/api/product/${productId}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
        // Don't set Content-Type, let browser set it automatically for FormData
      },
      body: formData
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('Success:', result);
      return result;
    } else {
      console.error('Error:', result);
      return null;
    }
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}

// ==== USING AXIOS ====
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testWithAxios(productId, imagePaths, authToken) {
  const formData = new FormData();
  
  // Add files with any field names
  imagePaths.forEach((imagePath, index) => {
    formData.append(`image_${index}`, fs.createReadStream(imagePath));
  });

  try {
    const response = await axios.post(
      `http://localhost:3000/api/product/${productId}/images`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${authToken}`
        }
      }
    );

    console.log('Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return null;
  }
}

// Example usage:
// testWithAxios(1, ['./image1.jpg', './image2.png'], 'your-jwt-token-here');

module.exports = {
  testAddProductImages,
  testWithAxios
};
