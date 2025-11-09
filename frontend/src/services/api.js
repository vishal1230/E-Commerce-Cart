import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api', // Proxy will redirect to http://localhost:5000/api
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor (optional - for adding auth tokens later)
api.interceptors.request.use(
  (config) => {
    // You can add authentication tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (optional - for global error handling)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Global error handling
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ============================================
// API METHODS
// ============================================

/**
 * Product API Methods
 */
export const productAPI = {
  // Get all products with optional source parameter
  getAllProducts: async (source = 'both') => {
    const response = await api.get(`/products?source=${source}`);
    return response.data;
  },

  // Get single product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category, source = 'both') => {
    const response = await api.get(`/products/category/${category}?source=${source}`);
    return response.data;
  },
};

/**
 * Checkout API Methods
 */
export const checkoutAPI = {
  // Process checkout
  processCheckout: async (checkoutData) => {
    const response = await api.post('/checkout', checkoutData);
    return response.data;
  },

  // Validate cart items
  validateCart: async (cartItems) => {
    const response = await api.post('/checkout/validate', { cartItems });
    return response.data;
  },

  // Get user order history
  getUserOrders: async (email) => {
    const response = await api.get(`/checkout/orders/${email}`);
    return response.data;
  },
};

/**
 * Fake Store API Methods (Direct integration)
 */
export const fakeStoreAPI = {
  // Get products from Fake Store API
  getProducts: async () => {
    const response = await api.get('/fakestore/products');
    return response.data;
  },

  // Import products from Fake Store API to database
  importProducts: async (clearExisting = false) => {
    const response = await api.post(`/fakestore/import?clear=${clearExisting}`);
    return response.data;
  },

  // Get categories from Fake Store API
  getCategories: async () => {
    const response = await api.get('/fakestore/categories');
    return response.data;
  },
};

// Export the axios instance for custom requests if needed
export default api;
