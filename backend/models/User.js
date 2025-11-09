const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    orders: [
      {
        orderId: {
          type: String,
          required: true,
        },
        items: [
          {
            productId: {
              type: String,  // ✅ Changed from ObjectId to String
              required: true,
            },
            name: String,
            price: Number,
            quantity: Number,
            subtotal: Number,
            imageUrl: String,
          },
        ],
        totalPrice: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: ['pending', 'completed', 'cancelled'],
          default: 'completed',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
userSchema.index({ email: 1 });

// Instance method to add order
userSchema.methods.addOrder = function (orderData) {
  this.orders.push(orderData);
  return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
