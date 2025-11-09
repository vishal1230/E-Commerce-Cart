const axios = require('axios');

const FAKE_STORE_API_BASE = 'https://fakestoreapi.com';

/**
 * Fake Store API Service
 * Integrates with external product API
 */

const fakeStoreAPI = {
  /**
   * Get all products from Fake Store API
   */
  getAllProducts: async () => {
    try {
      const response = await axios.get(`${FAKE_STORE_API_BASE}/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products from Fake Store API:', error.message);
      throw error;
    }
  },

  /**
   * Get single product by ID
   */
  getProductById: async (id) => {
    try {
      const response = await axios.get(`${FAKE_STORE_API_BASE}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error.message);
      throw error;
    }
  },

  /**
   * Get products by category
   */
  getProductsByCategory: async (category) => {
    try {
      const response = await axios.get(`${FAKE_STORE_API_BASE}/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${category}:`, error.message);
      throw error;
    }
  },

  /**
   * Get all categories
   */
  getAllCategories: async () => {
    try {
      const response = await axios.get(`${FAKE_STORE_API_BASE}/products/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      throw error;
    }
  },

  /**
   * Transform Fake Store product to our schema
   */
  transformProduct: (fakeStoreProduct) => {
    return {
      name: fakeStoreProduct.title,
      price: fakeStoreProduct.price,
      imageUrl: fakeStoreProduct.image,
      description: fakeStoreProduct.description,
      category: fakeStoreProduct.category.charAt(0).toUpperCase() + fakeStoreProduct.category.slice(1),
      stock: Math.floor(Math.random() * 100) + 10, // Random stock 10-110
      isActive: true,
      externalId: fakeStoreProduct.id,
    };
  },
};

module.exports = fakeStoreAPI;
