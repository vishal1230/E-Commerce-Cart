/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Create the Cart Context
const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage or empty array
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('eCommerceCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('eCommerceCart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  // ============================================
  // CART FUNCTIONS
  // ============================================

  /**
   * Add item to cart or increase quantity if already exists
   * @param {Object} product - Product object to add
   * @param {Number} quantity - Quantity to add (default: 1)
   */
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      // Check if product already exists in cart
      const existingItem = prevItems.find((item) => item._id === product._id);

      if (existingItem) {
        // Increase quantity if item exists
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        return [
          ...prevItems,
          {
            _id: product._id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            category: product.category,
            stock: product.stock,
            quantity: quantity,
          },
        ];
      }
    });
  };

  /**
   * Remove item from cart completely
   * @param {String} productId - Product ID to remove
   */
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId)
    );
  };

  /**
   * Update quantity of specific item
   * @param {String} productId - Product ID to update
   * @param {Number} newQuantity - New quantity value
   */
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  /**
   * Increase item quantity by 1
   * @param {String} productId - Product ID to increase
   */
  const increaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  /**
   * Decrease item quantity by 1
   * @param {String} productId - Product ID to decrease
   */
  const decreaseQuantity = (productId) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((item) => item._id === productId);
      
      if (item && item.quantity === 1) {
        // Remove item if quantity would become 0
        return prevItems.filter((item) => item._id !== productId);
      }

      return prevItems.map((item) =>
        item._id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  /**
   * Clear all items from cart
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /**
   * Check if product is in cart
   * @param {String} productId - Product ID to check
   * @returns {Boolean}
   */
  const isInCart = (productId) => {
    return cartItems.some((item) => item._id === productId);
  };

  /**
   * Get quantity of specific product in cart
   * @param {String} productId - Product ID to check
   * @returns {Number}
   */
  const getItemQuantity = (productId) => {
    const item = cartItems.find((item) => item._id === productId);
    return item ? item.quantity : 0;
  };

  // ============================================
  // CART CALCULATIONS
  // ============================================

  /**
   * Get total number of items in cart
   * @returns {Number}
   */
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  /**
   * Get total price of all items in cart
   * @returns {Number}
   */
  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  /**
   * Get subtotal for specific item
   * @param {String} productId - Product ID
   * @returns {Number}
   */
  const getItemSubtotal = (productId) => {
    const item = cartItems.find((item) => item._id === productId);
    return item ? item.price * item.quantity : 0;
  };

  /**
   * Get formatted cart data for checkout
   * @returns {Array}
   */
  const getCheckoutData = () => {
    return cartItems.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
    }));
  };

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value = {
    // State
    cartItems,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    
    // Queries
    isInCart,
    getItemQuantity,
    getCartCount,
    getCartTotal,
    getItemSubtotal,
    getCheckoutData,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
