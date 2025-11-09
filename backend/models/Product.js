const mongoose = require('mongoose');

// Define the Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters long'],
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
      validate: {
        validator: function(value) {
          return value > 0;
        },
        message: 'Price must be greater than 0'
      }
    },
    imageUrl: {
      type: String,
      required: [true, 'Product image URL is required'],
      trim: true,
      validate: {
        validator: function(value) {
          // Basic URL validation
          return /^https?:\/\/.+/.test(value);
        },
        message: 'Please provide a valid image URL'
      }
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    category: {
      type: String,
      trim: true,
      default: 'General'
    },
    stock: {
      type: Number,
      default: 100,
      min: [0, 'Stock cannot be negative']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    versionKey: false // Removes __v field
  }
);

// Add index for better query performance
productSchema.index({ name: 1, category: 1 });

// Instance method to format price
productSchema.methods.getFormattedPrice = function() {
  return `$${this.price.toFixed(2)}`;
};

// Static method to get active products
productSchema.statics.getActiveProducts = function() {
  return this.find({ isActive: true });
};

// Create and export the Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
