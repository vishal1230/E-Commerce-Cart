const express = require('express');
const router = express.Router();
const { 
  getAllProducts, 
  getProductById,
  getProductsByCategory 
} = require('../controllers/productController');

/**
 * Product Routes
 * Base path: /api/products
 */

// Get all products
router.get('/', getAllProducts);

// Get products by category
router.get('/category/:category', getProductsByCategory);

// Get single product by ID (must be after other routes to avoid conflicts)
router.get('/:id', getProductById);

module.exports = router;
