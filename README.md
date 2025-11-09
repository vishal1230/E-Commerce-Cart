🛒 E Commerce Cart
A full-stack MERN e-commerce application with hybrid product sourcing from MongoDB and Fake Store API. Features cart management, checkout, and persistent user orders.

![MERN Stack](https://img.shields.io/badge/Stack://img.shields.io/badge/Node.js-Express Features

🔄 Dual Product Sources: Toggle between Database, Fake Store API, or both (~30 products total)

🛒 Smart Cart: Real-time updates, localStorage persistence, quantity management

👤 User Persistence: Order history saved to MongoDB with unique receipt IDs

📱 Responsive Design: Mobile-first UI with React Context API state management

✅ Full Checkout Flow: Form validation, receipt generation, and email-based order retrieval

🚀 Quick Start
bash
# Backend Setup
cd backend
npm install
echo "PORT=5000\nMONGODB_URI=mongodb://127.0.0.1:27017/e-commerce-cart\nNODE_ENV=development" > .env
npm run seed  # Optional: seed database
npm run dev   # Runs on http://localhost:5000

# Frontend Setup (new terminal)
cd frontend
npm install
npm run dev   # Runs on http://localhost:3000
🎯 Usage
Select Product Source: Choose DB, API, or Both using toggle buttons

Browse & Filter: View products by category

Add to Cart: Cart persists across sessions

Checkout: Enter details, get receipt, view order history

📡 Key API Endpoints
text
GET  /api/products?source=db|api|both    # Get products
POST /api/checkout                        # Process order
GET  /api/checkout/orders/:email          # Order history
GET  /api/fakestore/products              # External API
🏗️ Tech Stack
Frontend: React 18 - Vite - React Router - Axios - Context API
Backend: Node.js - Express - Mongoose - Axios
Database: MongoDB
External: Fake Store API

`📁 Project Structure
text
├── backend/
│   ├── models/          # Product, User schemas
│   ├── controllers/     # Business logic (hybrid sourcing)
│   ├── routes/          # API endpoints
│   └── services/        # Fake Store API integration
└── frontend/
    ├── components/      # ProductList, Cart, Checkout
    ├── context/         # CartContext (global state)
    └── services/        # API service layer`


🔍 Hybrid Product System
Database Products: MongoDB ObjectIds (10 seeded products)

API Products: Prefixed with api- (20 from Fake Store API)

Checkout: Works seamlessly with both product types

User Model: String-based productId supports both formats

📝 Environment Variables
text
# backend/.env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/e-commerce-cart
NODE_ENV=development
🎓 Learning Outcomes
This project demonstrates:

External API integration with fallback strategies

Hybrid data architecture (DB + API)

MERN stack with modern React patterns

User persistence and order management

Error handling and validation

Built with MERN Stack | ~30 Products | 12 API Endpoints | Real-time Cart Management