const express = require('express');
const router = express.Router();
const { processCheckout, validateCart, getUserOrders } = require('../controllers/checkoutController');

/**
 * Checkout Routes
 * Base path: /api/checkout
 */

// Process checkout and generate receipt
router.post('/', processCheckout);

// Validate cart items (optional utility endpoint)
router.post('/validate', validateCart);

// Get user order history by email
router.get('/orders/:email', getUserOrders);

module.exports = router;
