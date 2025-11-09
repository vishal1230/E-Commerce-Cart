const Product = require('../models/Product');
const fakeStoreAPI = require('../services/fakeStoreAPI');

/**
 * @desc    Get all products (from database, API, or both)
 * @route   GET /api/products?source=db|api|both
 * @access  Public
 */
const getAllProducts = async (req, res) => {
  try {
    const source = req.query.source || 'both'; // Default to both
    let products = [];

    // Fetch from database
    if (source === 'db' || source === 'both') {
      const dbProducts = await Product.find({ isActive: true })
        .select('-__v')
        .sort({ category: 1, name: 1 });
      
      products = [...dbProducts];
      console.log(`✅ Fetched ${dbProducts.length} products from database`);
    }

    // Fetch from Fake Store API
    if (source === 'api' || source === 'both') {
      try {
        const externalProducts = await fakeStoreAPI.getAllProducts();
        
        const transformedProducts = externalProducts.map(product => ({
          _id: `api-${product.id}`, // Prefix with 'api-' to distinguish from DB products
          name: product.title,
          price: product.price,
          imageUrl: product.image,
          description: product.description,
          category: product.category.charAt(0).toUpperCase() + product.category.slice(1),
          stock: Math.floor(Math.random() * 50) + 20,
          isActive: true,
          source: 'Fake Store API',
          rating: product.rating,
        }));
        
        products = [...products, ...transformedProducts];
        console.log(`✅ Fetched ${transformedProducts.length} products from Fake Store API`);
      } catch (apiError) {
        console.warn('⚠️ Fake Store API unavailable, using only database products');
      }
    }

    res.status(200).json({
      success: true,
      count: products.length,
      source: source,
      breakdown: {
        database: products.filter(p => !p._id.toString().startsWith('api-')).length,
        api: products.filter(p => p._id.toString().startsWith('api-')).length,
      },
      data: products,
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? error.message : {},
    });
  }
};

/**
 * @desc    Get single product by ID (from database or API)
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    // Check if it's an API product (starts with 'api-')
    if (id.startsWith('api-')) {
      const apiId = id.replace('api-', '');
      try {
        const externalProduct = await fakeStoreAPI.getProductById(apiId);
        product = {
          _id: `api-${externalProduct.id}`,
          name: externalProduct.title,
          price: externalProduct.price,
          imageUrl: externalProduct.image,
          description: externalProduct.description,
          category: externalProduct.category.charAt(0).toUpperCase() + externalProduct.category.slice(1),
          stock: Math.floor(Math.random() * 50) + 20,
          isActive: true,
          source: 'Fake Store API',
          rating: externalProduct.rating,
        };
      } catch (apiError) {
        console.error('API product not found');
      }
    } else {
      // Fetch from database
      product = await Product.findById(id);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: process.env.NODE_ENV === 'development' ? error.message : {},
    });
  }
};

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:category?source=db|api|both
 * @access  Public
 */
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const source = req.query.source || 'both';
    let products = [];

    // Fetch from database
    if (source === 'db' || source === 'both') {
      const dbProducts = await Product.find({
        category: new RegExp(category, 'i'),
        isActive: true,
      }).sort({ name: 1 });
      
      products = [...dbProducts];
    }

    // Fetch from Fake Store API
    if (source === 'api' || source === 'both') {
      try {
        const externalProducts = await fakeStoreAPI.getProductsByCategory(category.toLowerCase());
        
        const transformedProducts = externalProducts.map(product => ({
          _id: `api-${product.id}`,
          name: product.title,
          price: product.price,
          imageUrl: product.image,
          description: product.description,
          category: product.category.charAt(0).toUpperCase() + product.category.slice(1),
          stock: Math.floor(Math.random() * 50) + 20,
          isActive: true,
          source: 'Fake Store API',
          rating: product.rating,
        }));
        
        products = [...products, ...transformedProducts];
      } catch (apiError) {
        console.warn('⚠️ Category not found in Fake Store API');
      }
    }

    res.status(200).json({
      success: true,
      count: products.length,
      category: category,
      source: source,
      data: products,
    });

  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by category',
      error: process.env.NODE_ENV === 'development' ? error.message : {},
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
};
