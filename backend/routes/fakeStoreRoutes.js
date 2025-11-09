const express = require('express');
const router = express.Router();
const {
  getFakeStoreProducts,
  importFakeStoreProducts,
  getFakeStoreCategories,
} = require('../controllers/fakeStoreController');

/**
 * Fake Store API Routes
 * Base path: /api/fakestore
 */

// Get products from Fake Store API
router.get('/products', getFakeStoreProducts);

// Import products from Fake Store API to database
router.post('/import', importFakeStoreProducts);

// Get categories from Fake Store API
router.get('/categories', getFakeStoreCategories);

module.exports = router;
