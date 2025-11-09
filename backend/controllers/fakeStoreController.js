const fakeStoreAPI = require('../services/fakeStoreAPI');
const Product = require('../models/Product');

/**
 * @desc    Get products from Fake Store API
 * @route   GET /api/fakestore/products
 * @access  Public
 */
const getFakeStoreProducts = async (req, res) => {
  try {
    const products = await fakeStoreAPI.getAllProducts();
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
      source: 'Fake Store API',
    });
  } catch (error) {
    console.error('Error fetching Fake Store products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products from Fake Store API',
      error: process.env.NODE_ENV === 'development' ? error.message : 'External API error',
    });
  }
};

/**
 * @desc    Import products from Fake Store API to database
 * @route   POST /api/fakestore/import
 * @access  Public
 */
const importFakeStoreProducts = async (req, res) => {
  try {
    const externalProducts = await fakeStoreAPI.getAllProducts();
    
    const transformedProducts = externalProducts.map(product => 
      fakeStoreAPI.transformProduct(product)
    );

    // Clear existing products (optional)
    if (req.query.clear === 'true') {
      await Product.deleteMany({});
      console.log('Cleared existing products');
    }

    // Insert new products
    const insertedProducts = await Product.insertMany(transformedProducts);

    res.status(200).json({
      success: true,
      message: 'Products imported successfully from Fake Store API',
      count: insertedProducts.length,
      data: insertedProducts,
    });

  } catch (error) {
    console.error('Error importing products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Import error',
    });
  }
};

/**
 * @desc    Get categories from Fake Store API
 * @route   GET /api/fakestore/categories
 * @access  Public
 */
const getFakeStoreCategories = async (req, res) => {
  try {
    const categories = await fakeStoreAPI.getAllCategories();
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
      source: 'Fake Store API',
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: process.env.NODE_ENV === 'development' ? error.message : 'External API error',
    });
  }
};

module.exports = {
  getFakeStoreProducts,
  importFakeStoreProducts,
  getFakeStoreCategories,
};
