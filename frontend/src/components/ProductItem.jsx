import PropTypes from 'prop-types';

const ProductItem = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <div className="product-card">
      {/* Product Image */}
      <div className="product-image-container">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {product.stock < 20 && product.stock > 0 && (
          <span className="stock-badge low-stock">
            Only {product.stock} left!
          </span>
        )}
        {product.stock === 0 && (
          <span className="stock-badge out-of-stock">
            Out of Stock
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="product-details">
        {/* Category Badge */}
        <span className="product-category">{product.category}</span>

        {/* Product Name */}
        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>

        {/* Product Description */}
        {product.description && (
          <p className="product-description">
            {product.description.length > 80
              ? `${product.description.substring(0, 80)}...`
              : product.description}
          </p>
        )}

        {/* Price and Action */}
        <div className="product-footer">
          <div className="product-price">
            <span className="price-label">Price:</span>
            <span className="price-amount">${product.price.toFixed(2)}</span>
          </div>

          <button
            className="btn-add-to-cart"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

// PropTypes for type checking
ProductItem.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string,
    stock: PropTypes.number,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductItem;
