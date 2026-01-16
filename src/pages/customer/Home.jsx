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
      <section className="bg-primary text-white py-5 mb-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-4 fw-bold">Welcome to BTY-HUB</h1>
              <p className="lead">Discover amazing products at unbeatable prices</p>
              <a href="/products" className="btn btn-light btn-lg mt-3">
                Shop Now
              </a>
            </div>
            <div className="col-md-6">
              <img 
                src="https://via.placeholder.com/500x300" 
                alt="Hero" 
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mb-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="text-center p-4 border rounded bg-white">
              <FaShippingFast size={40} className="text-primary mb-3" />
              <h4>Free Shipping</h4>
              <p className="text-muted">On orders over $50</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center p-4 border rounded bg-white">
              <FaTags size={40} className="text-primary mb-3" />
              <h4>Best Prices</h4>
              <p className="text-muted">Guaranteed lowest prices</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center p-4 border rounded bg-white">
              <FaFire size={40} className="text-primary mb-3" />
              <h4>Hot Deals</h4>
              <p className="text-muted">Daily flash sales</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h3">
            <FaFire className="text-danger me-2" />
            Featured Products
          </h2>
          <a href="/products" className="btn btn-outline-primary">
            View All Products
          </a>
        </div>
        
        <div className="row g-4">
          {featuredProducts.map(product => (
            <div key={product.id} className="col-md-3 col-sm-6">
              <ProductCard product={product} />
            </div>
          ))}
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