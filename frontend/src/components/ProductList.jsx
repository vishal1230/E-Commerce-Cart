import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ProductItem from './ProductItem';
import { productAPI } from '../services/api';
import './ProductList.css';

const ProductList = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [productSource, setProductSource] = useState('both'); // Source toggle: 'both', 'db', 'api'

  useEffect(() => {
    fetchProducts();
  }, [productSource]); // Re-fetch when source changes

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.getAllProducts(productSource);
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from products
  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Filter products by selected category
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  // Loading State
  if (loading) {
    return (
      <div className="product-list-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="product-list-container">
        <div className="error-message">
          <h3>⚠️ Oops!</h3>
          <p>{error}</p>
          <button className="btn-retry" onClick={fetchProducts}>
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (products.length === 0) {
    return (
      <div className="product-list-container">
        <div className="empty-state">
          <h3>No Products Available</h3>
          <p>Check back later for amazing products!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      {/* Product Source Toggle */}
      <div className="source-toggle">
        <h3 className="source-title">Product Source:</h3>
        <div className="source-buttons">
          <button
            className={`source-btn ${productSource === 'both' ? 'active' : ''}`}
            onClick={() => setProductSource('both')}
          >
            🔄 Both (DB + API)
          </button>
          <button
            className={`source-btn ${productSource === 'db' ? 'active' : ''}`}
            onClick={() => setProductSource('db')}
          >
            💾 Database Only
          </button>
          <button
            className={`source-btn ${productSource === 'api' ? 'active' : ''}`}
            onClick={() => setProductSource('api')}
          >
            🌐 Fake Store API
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <h3 className="filter-title">Shop by Category:</h3>
        <div className="category-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${
                selectedCategory === category ? 'active' : ''
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
              {category !== 'All' && (
                <span className="category-count">
                  ({products.filter(p => p.category === category).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Product Count */}
      <div className="product-count">
        <p>
          Showing <strong>{filteredProducts.length}</strong> product
          {filteredProducts.length !== 1 ? 's' : ''}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductItem
            key={product._id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {/* No Results for Category */}
      {filteredProducts.length === 0 && selectedCategory !== 'All' && (
        <div className="no-results">
          <p>No products found in <strong>{selectedCategory}</strong></p>
          <button
            className="btn-clear-filter"
            onClick={() => setSelectedCategory('All')}
          >
            View All Products
          </button>
        </div>
      )}
    </div>
  );
};

ProductList.propTypes = {
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductList;
