import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/customer/ProductCard';
import { FaFire, FaTags, FaShippingFast } from 'react-icons/fa';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with API call
    const mockProducts = [
      {
        id: 1,
        name: 'Premium Laptop',
        description: 'High-performance laptop for professionals',
        price: 1299.99,
        image: 'https://via.placeholder.com/300',
        category: 'Electronics',
        rating: 4.8,
        discount: 15
      },
      {
        id: 2,
        name: 'Wireless Headphones',
        description: 'Noise cancelling wireless headphones',
        price: 199.99,
        image: 'https://via.placeholder.com/300',
        category: 'Electronics',
        rating: 4.5
      },
      {
        id: 3,
        name: 'Smart Watch',
        description: 'Fitness tracker and smart notifications',
        price: 299.99,
        image: 'https://via.placeholder.com/300',
        category: 'Wearables',
        rating: 4.3,
        discount: 10
      },
      {
        id: 4,
        name: 'Gaming Mouse',
        description: 'RGB gaming mouse with high DPI',
        price: 79.99,
        image: 'https://via.placeholder.com/300',
        category: 'Gaming',
        rating: 4.7
      }
    ];
    
    setFeaturedProducts(mockProducts);
    setLoading(false);
  }, []);

  const categories = [
    { name: 'Electronics', count: 45 },
    { name: 'Fashion', count: 32 },
    { name: 'Home & Kitchen', count: 28 },
    { name: 'Sports', count: 15 },
    { name: 'Books', count: 67 }
  ];

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Discover Premium <span className="highlight">Products</span></h1>
              <p>Shop the finest selection of products handpicked just for you. Experience quality, style, and excellence.</p>
              <div className="hero-features">
                <div className="hero-feature">
                  <div className="hero-feature-icon">✓</div>
                  <div className="hero-feature-text">
                    <h4>Premium Quality</h4>
                    <p>Carefully selected premium products</p>
                  </div>
                </div>
                <div className="hero-feature">
                  <div className="hero-feature-icon">✓</div>
                  <div className="hero-feature-text">
                    <h4>Fast Shipping</h4>
                    <p>Quick delivery to your doorstep</p>
                  </div>
                </div>
                <div className="hero-feature">
                  <div className="hero-feature-icon">✓</div>
                  <div className="hero-feature-text">
                    <h4>Secure Checkout</h4>
                    <p>Safe and secure payment processing</p>
                  </div>
                </div>
              </div>
              <button className="btn-cta mt-3">Shop Now</button>
            </div>
            <div className="hero-image">
              <img src="https://via.placeholder.com/400x400" alt="Featured Product" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-light">
        <div className="container">
          <h2 className="section-title">Featured <span className="highlight">Products</span></h2>
          <p className="section-subtitle">Discover our most popular items handpicked for you</p>
          
          <div className="product-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <div className="container">
        <div className="cta-banner">
          <div className="cta-banner-content">
            <h2>Limited Time Offer</h2>
            <p>Get exclusive discounts on your favorite products. Shop now and save up to 40%!</p>
            <button className="btn-cta">Explore Deals</button>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="section-dark py-5">
        <div className="container">
          <h2 className="section-title" style={{color: 'white'}}>Shop by <span className="highlight">Category</span></h2>
          <p className="section-subtitle" style={{color: 'rgba(255, 255, 255, 0.7)'}}>Browse our wide selection of products</p>
          
          <div className="gallery-section">
            {categories.map((cat, idx) => (
              <div key={idx} className="gallery-item">
                <img 
                  src="https://via.placeholder.com/300x300" 
                  alt={cat.name}
                />
                <div className="gallery-item-overlay">
                  <div className="gallery-item-overlay-content">
                    <div className="gallery-item-overlay-icon">📦</div>
                    <div className="gallery-item-overlay-text">{cat.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mb-5">
        <h2 className="h3 mb-4">Shop by Category</h2>
        <div className="row g-3">
          {categories.map(category => (
            <div key={category.name} className="col-md-2 col-sm-4 col-6">
              <a 
                href={`/products?category=${category.name}`}
                className="text-decoration-none"
              >
                <div className="card text-center p-3 card-hover">
                  <div className="card-body">
                    <h6 className="card-title mb-1">{category.name}</h6>
                    <small className="text-muted">{category.count} items</small>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="container mb-5">
        <div className="bg-warning rounded p-5 text-center">
          <h2 className="display-6 fw-bold">Limited Time Offer!</h2>
          <p className="lead">Get 30% off on all electronics. Use code: BTYHUB30</p>
          <button className="btn btn-dark btn-lg">Shop Now</button>
        </div>
      </section>
    </div>
  );
};

export default Home;