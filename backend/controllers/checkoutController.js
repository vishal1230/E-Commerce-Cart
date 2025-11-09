const Product = require('../models/Product');
const User = require('../models/User');
const fakeStoreAPI = require('../services/fakeStoreAPI');

/**
 * @desc    Process checkout
 * @route   POST /api/checkout
 * @access  Public
 */
const processCheckout = async (req, res) => {
  try {
    const { cartItems, userDetails } = req.body;

    // Validation
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty or invalid',
      });
    }

    if (!userDetails || !userDetails.name || !userDetails.email) {
      return res.status(400).json({
        success: false,
        message: 'User details (name and email) are required',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userDetails.email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Verify products and calculate total
    let totalPrice = 0;
    const processedItems = [];

    for (const item of cartItems) {
      if (!item.productId || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Invalid cart item format',
        });
      }

      let product = null;

      // Check if it's an API product (starts with 'api-')
      if (item.productId.toString().startsWith('api-')) {
        // Extract the numeric ID from 'api-1', 'api-2', etc.
        const apiId = item.productId.replace('api-', '');
        
        console.log(`Fetching API product with ID: ${apiId}`);
        
        try {
          const externalProduct = await fakeStoreAPI.getProductById(apiId);
          
          product = {
            _id: item.productId, // Keep the 'api-1' format
            name: externalProduct.title,
            price: externalProduct.price,
            imageUrl: externalProduct.image,
            stock: 100, // Default stock for API products
          };
          
          console.log(`✅ Found API product: ${product.name}`);
        } catch (apiError) {
          console.error(`❌ API Product fetch error for ID ${apiId}:`, apiError.message);
          return res.status(404).json({
            success: false,
            message: `Product with ID ${item.productId} not found in Fake Store API`,
          });
        }
      } else {
        // Fetch from database
        console.log(`Fetching DB product with ID: ${item.productId}`);
        
        try {
          product = await Product.findById(item.productId);
          
          if (!product) {
            return res.status(404).json({
              success: false,
              message: `Product with ID ${item.productId} not found in database`,
            });
          }
          
          console.log(`✅ Found DB product: ${product.name}`);
        } catch (dbError) {
          console.error(`❌ DB Product fetch error:`, dbError.message);
          return res.status(404).json({
            success: false,
            message: `Invalid product ID: ${item.productId}`,
          });
        }
      }

      if (item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be greater than 0',
        });
      }

      // Stock check (for DB products, API products have default stock of 100)
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      const itemSubtotal = product.price * item.quantity;
      totalPrice += itemSubtotal;

      processedItems.push({
        productId: product._id.toString(),
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal: parseFloat(itemSubtotal.toFixed(2)),
        imageUrl: product.imageUrl,
      });
    }

    // Generate receipt ID
    const receiptId = `RCP-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Find or create user
    let user = await User.findOne({ email: userDetails.email.toLowerCase() });

    if (!user) {
      user = new User({
        name: userDetails.name,
        email: userDetails.email.toLowerCase(),
        orders: [],
      });
      console.log(`Creating new user: ${userDetails.email}`);
    } else {
      user.name = userDetails.name;
      console.log(`Updating existing user: ${userDetails.email}`);
    }

    // Add order
    const orderData = {
      orderId: receiptId,
      items: processedItems,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      status: 'completed',
      createdAt: new Date(),
    };

    await user.addOrder(orderData);

    // Create receipt
    const receipt = {
      receiptId: receiptId,
      userDetails: {
        name: userDetails.name,
        email: userDetails.email,
      },
      items: processedItems,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      itemCount: processedItems.length,
      totalQuantity: processedItems.reduce((sum, item) => sum + item.quantity, 0),
      timestamp: new Date().toISOString(),
      status: 'completed',
    };

    console.log('✅ Checkout processed successfully:', {
      receiptId: receipt.receiptId,
      user: userDetails.email,
      total: receipt.totalPrice,
      items: processedItems.length,
    });

    res.status(200).json({
      success: true,
      message: 'Checkout processed successfully',
      receipt: receipt,
    });

  } catch (error) {
    console.error('❌ Checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Checkout processing failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
};

/**
 * @desc    Get user order history
 * @route   GET /api/checkout/orders/:email
 * @access  Public
 */
const getUserOrders = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No orders found for this email',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        totalOrders: user.orders.length,
        orders: user.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      },
    });

  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
};

/**
 * @desc    Validate cart items
 * @route   POST /api/checkout/validate
 * @access  Public
 */
const validateCart = async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid cart data',
      });
    }

    const validationResults = [];

    for (const item of cartItems) {
      let isValid = false;
      let hasStock = false;
      let availableStock = 0;

      if (item.productId.toString().startsWith('api-')) {
        const apiId = item.productId.replace('api-', '');
        try {
          await fakeStoreAPI.getProductById(apiId);
          isValid = true;
          hasStock = true;
          availableStock = 100;
        } catch (error) {
          isValid = false;
        }
      } else {
        const product = await Product.findById(item.productId);
        if (product) {
          isValid = true;
          hasStock = product.stock >= item.quantity;
          availableStock = product.stock;
        }
      }

      validationResults.push({
        productId: item.productId,
        isValid,
        hasStock,
        availableStock,
      });
    }

    res.status(200).json({
      success: true,
      validationResults: validationResults,
    });

  } catch (error) {
    console.error('Cart validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Cart validation failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
};

module.exports = {
  processCheckout,
  getUserOrders,
  validateCart,
};
