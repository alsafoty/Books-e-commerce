// Test script for image upload functionality
// This script demonstrates how to test the image upload API endpoints

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000/api';

// Replace with your actual JWT token
const AUTH_TOKEN = 'your-jwt-token-here';

// Example: Create a product with images
async function createProductWithImages() {
  try {
    const formData = new FormData();
    
    // Add product data
    formData.append('name', 'Test Perfume');
    formData.append('description', 'A wonderful test perfume');
    formData.append('price', '99.99');
    formData.append('stock', '50');
    formData.append('categoryId', '1'); // Make sure this category exists
    
    // Add image files (replace with actual image paths)
    // formData.append('images', fs.createReadStream('path/to/image1.jpg'));
    // formData.append('images', fs.createReadStream('path/to/image2.jpg'));
    
    const response = await axios.post(`${BASE_URL}/product`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });
    
    console.log('Product created successfully:', response.data);
    return response.data.product.id;
  } catch (error) {
    console.error('Error creating product:', error.response?.data || error.message);
  }
}

// Example: Add images to existing product
async function addImagesToProduct(productId) {
  try {
    const formData = new FormData();
    
    // Add image files
    // formData.append('images', fs.createReadStream('path/to/image3.jpg'));
    // formData.append('images', fs.createReadStream('path/to/image4.jpg'));
    
    const response = await axios.post(`${BASE_URL}/product/${productId}/images`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });
    
    console.log('Images added successfully:', response.data);
  } catch (error) {
    console.error('Error adding images:', error.response?.data || error.message);
  }
}

// Example: Get product with images
async function getProductWithImages(productId) {
  try {
    const response = await axios.get(`${BASE_URL}/product/${productId}`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });
    
    console.log('Product details:', response.data);
    console.log('Product images:', response.data.ProductImages);
  } catch (error) {
    console.error('Error getting product:', error.response?.data || error.message);
  }
}

// Example: Delete product image
async function deleteProductImage(imageId) {
  try {
    const response = await axios.delete(`${BASE_URL}/product/images/${imageId}`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });
    
    console.log('Image deleted successfully:', response.data);
  } catch (error) {
    console.error('Error deleting image:', error.response?.data || error.message);
  }
}

// Test workflow
async function runTests() {
  console.log('Starting image upload tests...');
  
  // Uncomment and modify these tests as needed
  // const productId = await createProductWithImages();
  // if (productId) {
  //   await addImagesToProduct(productId);
  //   await getProductWithImages(productId);
  // }
}

// Uncomment to run tests
// runTests();

module.exports = {
  createProductWithImages,
  addImagesToProduct,
  getProductWithImages,
  deleteProductImage
};
