import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="display-1 text-muted mb-4">🛒</div>
          <h2>Your cart is empty</h2>
          <p className="text-muted mb-4">Add some products to your cart</p>
          <Link to="/products" className="btn btn-primary">
            <FaArrowLeft className="me-2" /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Shopping Cart</h1>
      
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              {cartItems.map(item => (
                <div key={item.id} className="row align-items-center mb-3 pb-3 border-bottom">
                  <div className="col-md-2">
                    <img 
                      src={item.image || 'https://via.placeholder.com/100'} 
                      alt={item.name}
                      className="img-fluid rounded"
                    />
                  </div>
                  
                  <div className="col-md-4">
                    <h5 className="mb-1">{item.name}</h5>
                    <p className="text-muted small mb-0">{item.category}</p>
                  </div>
                  
                  <div className="col-md-2">
                    <div className="input-group input-group-sm">
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <FaMinus />
                      </button>
                      <input 
                        type="text" 
                        className="form-control text-center" 
                        value={item.quantity}
                        readOnly
                      />
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-md-2">
                    <h5 className="mb-0">${(item.price * item.quantity).toFixed(2)}</h5>
                    <small className="text-muted">${item.price.toFixed(2)} each</small>
                  </div>
                  
                  <div className="col-md-2 text-end">
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="text-end">
                <Link to="/products" className="btn btn-outline-primary">
                  <FaArrowLeft className="me-2" /> Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-3">Order Summary</h5>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>${getCartTotal() > 50 ? '0.00' : '5.99'}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Tax</span>
                <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-3">
                <h5>Total</h5>
                <h5 className="text-primary">
                  ${(getCartTotal() + (getCartTotal() * 0.08) + (getCartTotal() > 50 ? 0 : 5.99)).toFixed(2)}
                </h5>
              </div>
              
              <button 
                className="btn btn-primary btn-lg w-100"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
              
              <div className="mt-3">
                <p className="small text-muted mb-2">We accept:</p>
                <div className="d-flex gap-2">
                  <span className="badge bg-light text-dark">Visa</span>
                  <span className="badge bg-light text-dark">MasterCard</span>
                  <span className="badge bg-light text-dark">PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;