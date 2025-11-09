
# 🛒 E Commerce Cart

A full-stack MERN e-commerce application with dual product sourcing (Database + Fake Store API), cart management, user persistence, and order history.

<p align="center">
  <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white" />
</p>

---

## ✨ Key Features

* **🔄 Dual Product Sources:** Toggle between Database (10 products), Fake Store API (20 products), or Both (~30 total).
* **🛒 Smart Cart:** Real-time updates, `localStorage` persistence, and quantity management.
* **👤 User Persistence:** Order history saved to MongoDB with unique receipt IDs.
* **📱 Responsive Design:** Mobile-first UI with React Context API.
* **✅ Full Checkout:** Form validation, secure backend price calculation, and receipt generation.
* **🌐 External API:** Seamless Fake Store API integration with a fallback to database-only products.

---

## 🏗️ Tech Stack

* **Frontend:** React 18, Vite, React Router, Axios, Context API
* **Backend:** Node.js, Express, Mongoose, Axios
* **Database:** MongoDB
* **External API:** Fake Store API

---

## 🚀 Quick Start

### Backend Setup

```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Create .env file with essential variables
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/e-commerce-cart
NODE_ENV=development

# Optional: seed database with 10 products
npm run seed

# Start the server
npm run dev
# Runs on http://localhost:5000
````

### Frontend Setup (in a new terminal)

```bash
# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install

# Start the client
npm run dev
# Runs on http://localhost:3000 (or next available port)
```

-----

## 📁 Project Structure

```text
e-commerce-cart/
├── backend/
│   ├── models/          # Product, User schemas
│   ├── controllers/     # Business logic (hybrid sourcing)
│   ├── routes/          # API endpoints
│   ├── services/        # Fake Store API integration
│   └── utils/           # Error handling
└── frontend/
    ├── components/      # ProductList, Cart, Checkout
    ├── context/         # CartContext (global state)
    └── services/        # API service layer
```

-----

## 📡 API Endpoints

### Products (Hybrid System)

```http
GET  /api/products?source=db|api|both
GET  /api/products/:id
GET  /api/products/category/:category
```

### Checkout & Orders

```http
POST /api/checkout
GET  /api/checkout/orders/:email
POST /api/checkout/validate
```

### Fake Store API (Internal Routes)

```http
GET  /api/fakestore/products
POST /api/fakestore/import
GET  /api/fakestore/categories
```

-----

## 🎯 Usage

1.  **Select Source:** Choose "Database", "API", or "Both" using the toggle on the home page.
2.  **Browse:** Filter products by category or view all \~30 products.
3.  **Add to Cart:** Add items from any source to the persistent cart.
4.  **Checkout:** Fill in your details, get a final receipt, and your order is saved.
5.  **Order History:** Retrieve all past orders by entering your email.

-----

## 🔍 Hybrid Product System

The app's unique feature is its ability to merge products from two sources. This required a flexible design:

| Source | \# of Products | ID Format | Example |
| :--- | :--- | :--- | :--- |
| **Database** | 10 seeded | MongoDB ObjectId | `673e5f8a1234567890abcdef` |
| **API** | 20 external | `api-{number}` | `api-1`, `api-2` |
| **Both** | \~30 total | Mixed | Both formats work |

  * **Fallback:** If the Fake Store API fails, the app still functions perfectly with "Database Only" products.
  * **Schema:** The `User` model's `productId` field is a `String` to accept both formats.

-----

## 📦 Database Schema

### Product Model

```javascript
{
  name: String,
  price: Number,
  imageUrl: String,
  description: String,
  category: String,
  stock: Number,
  isActive: Boolean
}
```

### User Model

```javascript
{
  name: String,
  email: { type: String, unique: true },
  orders: [{
    orderId: String,
    items: [],
    totalPrice: Number,
    status: String,
    createdAt: Date
  }]
}
```




-----

## 🔮 Future Enhancements

  - [ ] User authentication (JWT) & protected routes
  - [ ] Payment gateway integration (Stripe)
  - [ ] Admin dashboard for product management
  - [ ] Product search functionality
  - [ ] Email notifications for orders

-----


## ScreenShots

<img width="1345" height="639" alt="Screenshot Homepage-1" src="https://github.com/user-attachments/assets/1b0922ae-06c7-4b7e-bc3d-f717525938de" />
<img width="1342" height="634" alt="Screenshot Homepage-2" src="https://github.com/user-attachments/assets/8a3fe386-9267-421f-b0fd-71b984af470c" />
<img width="1328" height="633" alt="Screenshot Cart" src="https://github.com/user-attachments/assets/6996a69f-df6d-4b19-960a-4fde11d44965" />
<img width="1333" height="632" alt="Screenshot Placeorder" src="https://github.com/user-attachments/assets/b0ff1010-f0fe-43cc-b586-55dad898b982" />
<img width="1315" height="630" alt="Screenshot Recipt" src="https://github.com/user-attachments/assets/48d2c205-b3e8-4a70-9a03-c98fd7447812" />

-----
## Demo video 

https://www.loom.com/share/2b0eceb33a7d4be1a2994e9b1329c947

-----
⭐ Star this repo if you found it helpful\! ⭐
