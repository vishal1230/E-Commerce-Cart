import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

function AppContent() {
  const { getCartCount } = useCart();

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <Link to="/" className="app-logo">
            🛒 E Commerce
          </Link>
          <nav className="app-nav">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/cart" className="nav-link cart-link">
              🛒 Cart
              {getCartCount() > 0 && (
                <span className="cart-badge">{getCartCount()}</span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2025 E Commerce Cart. Built with MERN Stack.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
