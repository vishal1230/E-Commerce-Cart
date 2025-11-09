const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

// Load environment variables
dotenv.config();

// Sample product data with variety
const mockProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality.',
    category: 'Electronics',
    stock: 50
  },
  {
    name: 'Organic Cotton T-Shirt',
    price: 24.99,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    description: 'Comfortable 100% organic cotton t-shirt available in multiple colors. Eco-friendly and sustainable.',
    category: 'Clothing',
    stock: 200
  },
  {
    name: 'Stainless Steel Water Bottle',
    price: 19.99,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    description: 'Insulated stainless steel water bottle keeps drinks cold for 24 hours and hot for 12 hours.',
    category: 'Accessories',
    stock: 150
  },
  {
    name: 'Smart Fitness Watch',
    price: 149.99,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    description: 'Track your fitness goals with heart rate monitoring, GPS, and 7-day battery life.',
    category: 'Electronics',
    stock: 75
  },
  {
    name: 'Leather Messenger Bag',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    description: 'Genuine leather messenger bag with multiple compartments. Perfect for work or travel.',
    category: 'Accessories',
    stock: 40
  },
  {
    name: 'Yoga Mat Premium',
    price: 34.99,
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
    description: 'Non-slip yoga mat with extra cushioning and carrying strap. Eco-friendly TPE material.',
    category: 'Sports',
    stock: 120
  },
  {
    name: 'Portable Phone Charger',
    price: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
    description: '20,000mAh portable power bank with fast charging. Charges multiple devices simultaneously.',
    category: 'Electronics',
    stock: 90
  },
  {
    name: 'Ceramic Coffee Mug Set',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500',
    description: 'Set of 4 handcrafted ceramic mugs. Microwave and dishwasher safe.',
    category: 'Home & Kitchen',
    stock: 60
  },
  {
    name: 'Running Shoes Pro',
    price: 119.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    description: 'Professional running shoes with advanced cushioning technology and breathable mesh.',
    category: 'Sports',
    stock: 85
  },
  {
    name: 'Desk Lamp LED',
    price: 44.99,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    description: 'Adjustable LED desk lamp with touch controls and USB charging port. Energy efficient.',
    category: 'Home & Kitchen',
    stock: 110
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Clear existing products
    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Existing products cleared');

    // Insert mock products
    console.log('📦 Inserting mock products...');
    const insertedProducts = await Product.insertMany(mockProducts);
    console.log(`✅ Successfully inserted ${insertedProducts.length} products`);

    // Display inserted products
    console.log('\n📋 Inserted Products:');
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (${product.category})`);
    });

    console.log('\n✨ Database seeding completed successfully!');
    console.log('💡 You can now start your server with: npm run dev');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Execute the seed function
seedDatabase();
