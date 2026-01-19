import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import { 
  FaTrash, 
  FaPlus, 
  FaMinus, 
  FaHeart, 
  FaRegHeart,
  FaEye,
  FaExchangeAlt,
  FaTag
} from 'react-icons/fa';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);

  // Calculate item total
  const itemTotal = item.price * item.quantity;
  const savings = item.originalPrice ? 
    (item.originalPrice - item.price) * item.quantity : 0;

  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      handleRemove();
      return;
    }
    
    if (newQuantity > item.stock || newQuantity > 10) {
      toast.error(`Maximum ${Math.min(item.stock || 10, 10)} units allowed`);
      return;
    }
    
    setQuantity(newQuantity);
    updateQuantity(item.id, newQuantity);
  };

  // Increment quantity
  const incrementQuantity = () => {
    handleQuantityChange(quantity + 1);
  };

  // Decrement quantity
  const decrementQuantity = () => {
    handleQuantityChange(quantity - 1);
  };

  // Handle direct input change
  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    handleQuantityChange(value);
  };

  // Remove item from cart
  const handleRemove = () => {
    removeFromCart(item.id);
    toast.info(`${item.name} removed from cart`);
  };

  // Toggle favorite status
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(
      !isFavorite 
        ? `${item.name} added to wishlist` 
        : `${item.name} removed from wishlist`
    );
  };

  // Toggle compare status
  const toggleCompare = () => {
    setIsComparing(!isComparing);
    toast.info(
      !isComparing 
        ? `${item.name} added to compare list` 
        : `${item.name} removed from compare list`
    );
  };

  // Move to wishlist
  const moveToWishlist = () => {
    setIsFavorite(true);
    handleRemove();
    toast.success(`${item.name} moved to wishlist`);
  };

  // Check stock status
  const getStockStatus = () => {
    if (!item.stock) return { text: 'In Stock', color: 'success' };
    
    if (item.stock < 5) {
      return { 
        text: `Only ${item.stock} left`, 
        color: 'warning' 
      };
    }
    
    if (item.stock === 0) {
      return { 
        text: 'Out of Stock', 
        color: 'danger' 
      };
    }
    
    return { text: 'In Stock', color: 'success' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="cart-item card mb-3">
      <div className="card-body">
        <div className="row align-items-center">
          {/* Product Image */}
          <div className="col-md-2 col-4">
            <div className="position-relative">
              <img 
                src={item.image || 'https://via.placeholder.com/150'} 
                alt={item.name}
                className="img-fluid rounded"
                style={{ height: '100px', objectFit: 'cover', width: '100%' }}
              />
              
              {/* Discount Badge */}
              {item.discount && (
                <span className="badge bg-danger position-absolute top-0 start-0 m-1">
                  -{item.discount}%
                </span>
              )}
              
              {/* Out of Stock Overlay */}
              {stockStatus.color === 'danger' && (
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center">
                  <span className="badge bg-danger">Out of Stock</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="col-md-4 col-8">
            <h5 className="card-title mb-1">
              <a 
                href={`/product/${item.id}`} 
                className="text-decoration-none text-dark"
              >
                {item.name}
              </a>
            </h5>
            
            <p className="card-text text-muted small mb-2">
              {item.description?.substring(0, 80)}...
            </p>
            
            <div className="mb-2">
              <span className={`badge bg-${stockStatus.color}`}>
                {stockStatus.text}
              </span>
              
              {item.category && (
                <span className="badge bg-secondary ms-1">
                  {item.category}
                </span>
              )}
            </div>
            
            {/* Product Features */}
            {item.features && item.features.length > 0 && (
              <div className="mt-2">
                <small className="text-muted d-block">Features:</small>
                <div className="d-flex flex-wrap gap-1">
                  {item.features.slice(0, 2).map((feature, index) => (
                    <span key={index} className="badge bg-light text-dark">
                      {feature}
                    </span>
                  ))}
                  {item.features.length > 2 && (
                    <span className="badge bg-light text-dark">
                      +{item.features.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="col-md-3 col-12 mt-3 mt-md-0">
            <div className="d-flex align-items-center justify-content-center">
              <div className="input-group input-group-sm" style={{ width: '140px' }}>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <FaMinus />
                </button>
                
                <input 
                  type="number" 
                  className="form-control text-center"
                  value={quantity}
                  onChange={handleInputChange}
                  min="1"
                  max={Math.min(item.stock || 10, 10)}
                  style={{ appearance: 'textfield' }}
                />
                
                <button 
                  className="btn btn-outline-secondary"
                  onClick={incrementQuantity}
                  disabled={quantity >= (item.stock || 10) || quantity >= 10}
                >
                  <FaPlus />
                </button>
              </div>
              
              <button 
                className="btn btn-link text-danger ms-2"
                onClick={handleRemove}
                title="Remove item"
              >
                <FaTrash />
              </button>
            </div>
            
            {/* Save for Later / Move to Wishlist */}
            <div className="d-flex justify-content-center mt-2 gap-2">
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={moveToWishlist}
                title="Move to wishlist"
              >
                <FaRegHeart className="me-1" /> Save
              </button>
              
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={toggleCompare}
                title={isComparing ? "Remove from compare" : "Add to compare"}
              >
                <FaExchangeAlt className="me-1" /> Compare
              </button>
            </div>
          </div>

          {/* Price & Total */}
          <div className="col-md-3 col-12 mt-3 mt-md-0">
            <div className="text-end">
              {/* Price per item */}
              <div className="mb-1">
                <span className="h5 text-primary">
                  ${item.price.toFixed(2)}
                </span>
                
                {item.originalPrice && (
                  <>
                    <span className="text-muted text-decoration-line-through ms-2">
                      ${item.originalPrice.toFixed(2)}
                    </span>
                    <small className="text-success ms-2">
                      Save ${(item.originalPrice - item.price).toFixed(2)}
                    </small>
                  </>
                )}
              </div>
              
              {/* Item total */}
              <div className="mb-2">
                <small className="text-muted d-block">Item Total:</small>
                <h4 className="text-primary mb-0">
                  ${itemTotal.toFixed(2)}
                </h4>
                
                {savings > 0 && (
                  <small className="text-success">
                    <FaTag className="me-1" /> 
                    You save ${savings.toFixed(2)}
                  </small>
                )}
              </div>
              
              {/* Shipping Info */}
              <div className="text-muted small">
                {item.shipping === 0 ? (
                  <span className="text-success">✓ Free Shipping</span>
                ) : (
                  <span>Shipping: ${item.shipping?.toFixed(2) || '5.99'}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Actions Row */}
        <div className="row mt-3 border-top pt-3">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              {/* Left Actions */}
              <div className="d-flex gap-2">
                <button 
                  className={`btn btn-sm ${isFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={toggleFavorite}
                >
                  {isFavorite ? <FaHeart /> : <FaRegHeart />}
                  <span className="ms-1">
                    {isFavorite ? 'In Wishlist' : 'Add to Wishlist'}
                  </span>
                </button>
                
                <a 
                  href={`/product/${item.id}`}
                  className="btn btn-sm btn-outline-primary"
                >
                  <FaEye className="me-1" /> View Details
                </a>
              </div>
              
              {/* Right Actions */}
              <div className="d-flex gap-2">
                {item.estimatedDelivery && (
                  <small className="text-muted align-self-center">
                    Est. Delivery: {item.estimatedDelivery}
                  </small>
                )}
                
                <button 
                  className="btn btn-sm btn-outline-warning"
                  onClick={() => toast.info('Share feature coming soon!')}
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS Styles */}
      <style jsx="true">{`
        .cart-item {
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }
        
        .cart-item:hover {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          border-left-color: #0d6efd;
          transform: translateY(-2px);
        }
        
        .cart-item .input-group {
          max-width: 200px;
        }
        
        .cart-item input[type="number"] {
          -moz-appearance: textfield;
        }
        
        .cart-item input[type="number"]::-webkit-outer-spin-button,
        .cart-item input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        .cart-item .btn-outline-secondary:disabled,
        .cart-item .btn-outline-secondary[disabled] {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .cart-item .card-body {
            padding: 1rem;
          }
          
          .cart-item .row > div {
            margin-bottom: 1rem;
          }
          
          .cart-item .text-end {
            text-align: left !important;
          }
          
          .cart-item .d-flex.justify-content-between {
            flex-direction: column;
            gap: 1rem;
          }
          
          .cart-item .d-flex.gap-2 {
            flex-wrap: wrap;
          }
        }
        
        @media (max-width: 576px) {
          .cart-item .input-group {
            width: 120px !important;
          }
          
          .cart-item h5 {
            font-size: 1rem;
          }
          
          .cart-item h4 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

// Prop Types (optional, for better development experience)
CartItem.propTypes = {
  item: (props, propName, componentName) => {
    const item = props[propName];
    if (!item) {
      return new Error(`Missing required prop 'item' in ${componentName}`);
    }
    
    if (!item.id || !item.name || !item.price || !item.quantity) {
      return new Error(
        `Invalid prop 'item' supplied to ${componentName}. ` +
        `Expected an object with id, name, price, and quantity properties.`
      );
    }
    
    if (typeof item.price !== 'number' || item.price < 0) {
      return new Error(
        `Invalid prop 'item.price' supplied to ${componentName}. ` +
        `Expected a non-negative number.`
      );
    }
    
    if (typeof item.quantity !== 'number' || item.quantity < 1) {
      return new Error(
        `Invalid prop 'item.quantity' supplied to ${componentName}. ` +
        `Expected a number greater than 0.`
      );
    }
  }
};

export default CartItem;