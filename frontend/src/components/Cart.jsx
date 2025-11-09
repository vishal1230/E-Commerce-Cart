import { useState } from 'react';
import PropTypes from 'prop-types';
import { useCart } from '../context/CartContext';
import CheckoutModal from './CheckoutModal';
import './Cart.css';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getCartTotal,
    getCartCount,
  } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleRemoveItem = (productId, productName) => {
    if (window.confirm(`Remove "${productName}" from cart?`)) {
      removeFromCart(productId);
    }
  };

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any products yet.</p>
          <a href="/" className="btn-continue-shopping">
            🛍️ Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      {/* Cart Header */}
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p className="cart-item-count">
          {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Cart Items */}
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>

        {/* Cart Summary */}
        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping:</span>
            <span className="free-shipping">FREE</span>
          </div>
          
          <div className="summary-row">
            <span>Tax:</span>
            <span>Calculated at checkout</span>
          </div>
          
          <div className="summary-divider"></div>
          
          <div className="summary-row summary-total">
            <span>Total:</span>
            <span className="total-amount">${getCartTotal().toFixed(2)}</span>
          </div>

          <button className="btn-checkout" onClick={handleCheckout}>
            Proceed to Checkout
          </button>

          <a href="/" className="link-continue-shopping">
            ← Continue Shopping
          </a>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal onClose={handleCloseCheckout} />
      )}
    </div>
  );
};

// Cart Item Component
const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const itemSubtotal = (item.price * item.quantity).toFixed(2);

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.imageUrl} alt={item.name} />
      </div>

      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-category">{item.category}</p>
        <p className="cart-item-price">${item.price.toFixed(2)} each</p>
      </div>

      <div className="cart-item-actions">
        <div className="quantity-controls">
          <button
            className="quantity-btn"
            onClick={() => onDecrease(item._id)}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="quantity-display">{item.quantity}</span>
          <button
            className="quantity-btn"
            onClick={() => onIncrease(item._id)}
            disabled={item.quantity >= item.stock}
            aria-label="Increase quantity"
            title={item.quantity >= item.stock ? 'Max stock reached' : ''}
          >
            +
          </button>
        </div>

        <div className="cart-item-subtotal">
          <span className="subtotal-label">Subtotal:</span>
          <span className="subtotal-amount">${itemSubtotal}</span>
        </div>

        <button
          className="btn-remove"
          onClick={() => onRemove(item._id, item.name)}
          aria-label="Remove item"
        >
          🗑️ Remove
        </button>
      </div>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    category: PropTypes.string,
    quantity: PropTypes.number.isRequired,
    stock: PropTypes.number,
  }).isRequired,
  onIncrease: PropTypes.func.isRequired,
  onDecrease: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default Cart;
