import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="card h-100 card-hover">
      <div className="position-relative">
        <img 
          src={product.image || 'https://via.placeholder.com/300'} 
          className="card-img-top" 
          alt={product.name}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        {product.discount && (
          <span className="badge bg-danger position-absolute top-0 start-0 m-2">
            -{product.discount}%
          </span>
        )}
      </div>
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-muted small">{product.description?.substring(0, 60)}...</p>
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <span className="h4 text-primary">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-muted text-decoration-line-through ms-2">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="d-flex align-items-center">
              <FaStar className="text-warning me-1" />
              <span>{product.rating || '4.5'}</span>
            </div>
          </div>
          
          <div className="d-grid gap-2">
            <button 
              className="btn btn-primary btn-sm"
              onClick={handleAddToCart}
            >
              <FaShoppingCart className="me-2" /> Add to Cart
            </button>
            
            <Link 
              to={`/product/${product.id}`}
              className="btn btn-outline-primary btn-sm"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;