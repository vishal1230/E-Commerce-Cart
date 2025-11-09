import { useState } from 'react';
import PropTypes from 'prop-types';
import { useCart } from '../context/CartContext';
import { checkoutAPI } from '../services/api';
import './CheckoutModal.css';

const CheckoutModal = ({ onClose }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    // Clear API error
    if (apiError) {
      setApiError(null);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      // Prepare checkout data
      const checkoutData = {
        cartItems: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        userDetails: {
          name: formData.name.trim(),
          email: formData.email.trim(),
        },
      };

      console.log('Sending checkout data:', checkoutData);

      const response = await checkoutAPI.processCheckout(checkoutData);

      console.log('Checkout response:', response);

      if (response.success) {
        // Set receipt FIRST, clear cart LATER (when modal closes)
        setReceipt(response.receipt);
        // Don't clear cart yet - wait for user to close modal
      } else {
        throw new Error(response.message || 'Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      
      let errorMessage = 'Checkout failed. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
        console.error('Server error:', error.response.data);
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check if backend is running.';
        console.error('No response from server');
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    // If receipt is shown, clear cart and redirect
    if (receipt) {
      clearCart();
      onClose();
      // Redirect to home page
      window.location.href = '/';
    } else {
      // Just close modal if no receipt
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose}>
          ×
        </button>

        {!receipt ? (
          // Checkout Form
          <>
            <h2 className="modal-title">Checkout</h2>
            
            <div className="checkout-summary">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {cartItems.map((item) => (
                  <div key={item._id} className="summary-item">
                    <span>{item.name} (×{item.quantity})</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-total">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* API Error Message */}
            {apiError && (
              <div className="api-error-message">
                <strong>⚠️ Error:</strong> {apiError}
              </div>
            )}

            <form className="checkout-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="John Doe"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="john@example.com"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <button
                type="submit"
                className="btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>
                    <span className="spinner-small"></span> Processing...
                  </span>
                ) : (
                  'Place Order'
                )}
              </button>
            </form>
          </>
        ) : (
          // Receipt Display
          <>
            <div className="receipt-success">
              <div className="success-icon">✓</div>
              <h2>Order Successful!</h2>
              <p>Thank you for your purchase, {receipt.userDetails.name}!</p>
            </div>

            <div className="receipt-details">
              <div className="receipt-header">
                <h3>Receipt</h3>
                <p className="receipt-id">#{receipt.receiptId}</p>
              </div>

              <div className="receipt-info">
                <div className="info-row">
                  <span>Email:</span>
                  <span>{receipt.userDetails.email}</span>
                </div>
                <div className="info-row">
                  <span>Date:</span>
                  <span>{new Date(receipt.timestamp).toLocaleString()}</span>
                </div>
                <div className="info-row">
                  <span>Items:</span>
                  <span>{receipt.totalQuantity}</span>
                </div>
              </div>

              <div className="receipt-items">
                <h4>Order Items:</h4>
                {receipt.items.map((item) => (
                  <div key={item.productId} className="receipt-item">
                    <img src={item.imageUrl} alt={item.name} />
                    <div className="receipt-item-details">
                      <p className="item-name">{item.name}</p>
                      <p className="item-quantity">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="item-subtotal">
                      ${item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="receipt-total">
                <span>Total Paid:</span>
                <span className="total-amount">
                  ${receipt.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button className="btn-done" onClick={handleClose}>
              Continue Shopping
            </button>
          </>
        )}
      </div>
    </div>
  );
};

CheckoutModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CheckoutModal;
