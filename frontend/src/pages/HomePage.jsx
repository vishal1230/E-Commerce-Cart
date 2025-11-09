import { useCart } from '../context/CartContext';
import ProductList from '../components/ProductList';
import './HomePage.css';

const HomePage = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    console.log('Added to cart:', product.name);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="brand-highlight">E Commerce</span>
          </h1>
          <p className="hero-subtitle">
            Discover amazing products at unbeatable prices. Shop with confidence!
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5+</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <ProductList onAddToCart={handleAddToCart} />
      </section>
    </div>
  );
};

export default HomePage;
