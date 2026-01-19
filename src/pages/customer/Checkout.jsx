import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  FaCreditCard, 
  FaPaypal, 
  FaShippingFast, 
  FaLock,
  FaCheckCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from 'react-icons/fa';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    saveInfo: true
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'credit_card',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    saveCard: false
  });
  
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  
  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  
  const handleShippingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const validateStep1 = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    for (const field of requiredFields) {
      if (!shippingInfo[field]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    if (!/^\S+@\S+\.\S+$/.test(shippingInfo.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    if (!/^\d{10}$/.test(shippingInfo.phone.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    
    return true;
  };
  
  const validateStep2 = () => {
    if (paymentInfo.method === 'credit_card') {
      if (!paymentInfo.cardNumber || !paymentInfo.cardName || !paymentInfo.expiry || !paymentInfo.cvv) {
        toast.error('Please fill in all payment details');
        return false;
      }
      
      if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
        toast.error('Please enter a valid 16-digit card number');
        return false;
      }
      
      if (!/^\d{3}$/.test(paymentInfo.cvv)) {
        toast.error('Please enter a valid 3-digit CVV');
        return false;
      }
    }
    
    return true;
  };
  
  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };
  
  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newOrderId = `ORD-${Date.now()}`;
      setOrderId(newOrderId);
      setOrderPlaced(true);
      
      // Clear cart
      clearCart();
      
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="display-1 text-muted mb-4">🛒</div>
          <h2>Your cart is empty</h2>
          <p className="text-muted mb-4">Add some products to proceed to checkout</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  
  if (orderPlaced) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-5 text-center">
                <div className="text-success mb-4">
                  <FaCheckCircle size={80} />
                </div>
                <h2 className="mb-3">Order Confirmed!</h2>
                <p className="text-muted mb-4">
                  Thank you for your order. Your order has been placed successfully.
                </p>
                
                <div className="card bg-light mb-4">
                  <div className="card-body">
                    <h5 className="card-title">Order Details</h5>
                    <p className="mb-1"><strong>Order ID:</strong> {orderId}</p>
                    <p className="mb-1"><strong>Total Amount:</strong> ${total.toFixed(2)}</p>
                    <p className="mb-0"><strong>Estimated Delivery:</strong> 3-5 business days</p>
                  </div>
                </div>
                
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/orders')}
                  >
                    View Order Details
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/')}
                  >
                    Continue Shopping
                  </button>
                </div>
                
                <div className="mt-4">
                  <small className="text-muted">
                    A confirmation email has been sent to {shippingInfo.email}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      <h1 className="h2 mb-4">Checkout</h1>
      
      {/* Progress Steps */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className={`text-center ${step >= 1 ? 'text-primary' : 'text-muted'}`}>
                  <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-2"
                    style={{ width: '50px', height: '50px' }}>
                    <span className="fs-5">1</span>
                  </div>
                  <div>Shipping</div>
                </div>
                
                <div className="flex-grow-1 mx-3">
                  <div className="progress" style={{ height: '2px' }}>
                    <div className="progress-bar" style={{ width: step >= 2 ? '100%' : '0%' }}></div>
                  </div>
                </div>
                
                <div className={`text-center ${step >= 2 ? 'text-primary' : 'text-muted'}`}>
                  <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-2"
                    style={{ width: '50px', height: '50px' }}>
                    <span className="fs-5">2</span>
                  </div>
                  <div>Payment</div>
                </div>
                
                <div className="flex-grow-1 mx-3">
                  <div className="progress" style={{ height: '2px' }}>
                    <div className="progress-bar" style={{ width: step >= 3 ? '100%' : '0%' }}></div>
                  </div>
                </div>
                
                <div className={`text-center ${step >= 3 ? 'text-primary' : 'text-muted'}`}>
                  <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-2"
                    style={{ width: '50px', height: '50px' }}>
                    <span className="fs-5">3</span>
                  </div>
                  <div>Review</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        {/* Left Column - Forms */}
        <div className="col-lg-8 mb-4">
          {step === 1 && (
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <FaUser className="me-2" />
                  Shipping Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email *</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone *</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaPhone />
                      </span>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Address *</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaMapMarkerAlt />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        placeholder="Street address"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">ZIP *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Country</label>
                    <select
                      className="form-select"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="saveInfo"
                        checked={shippingInfo.saveInfo}
                        onChange={handleShippingChange}
                      />
                      <label className="form-check-label">
                        Save this information for next time
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <FaCreditCard className="me-2" />
                  Payment Method
                </h5>
              </div>
              <div className="card-body">
                {/* Payment Method Selection */}
                <div className="mb-4">
                  <label className="form-label">Select Payment Method *</label>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="form-check card-radio">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="creditCard"
                          value="credit_card"
                          checked={paymentInfo.method === 'credit_card'}
                          onChange={(e) => setPaymentInfo(prev => ({ ...prev, method: e.target.value }))}
                        />
                        <label className="form-check-label w-100" htmlFor="creditCard">
                          <div className="card border p-3 text-center">
                            <FaCreditCard className="fs-3 mb-2" />
                            <div>Credit Card</div>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-check card-radio">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="paypal"
                          value="paypal"
                          checked={paymentInfo.method === 'paypal'}
                          onChange={(e) => setPaymentInfo(prev => ({ ...prev, method: e.target.value }))}
                        />
                        <label className="form-check-label w-100" htmlFor="paypal">
                          <div className="card border p-3 text-center">
                            <FaPaypal className="fs-3 mb-2" />
                            <div>PayPal</div>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-check card-radio">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="cod"
                          value="cod"
                          checked={paymentInfo.method === 'cod'}
                          onChange={(e) => setPaymentInfo(prev => ({ ...prev, method: e.target.value }))}
                        />
                        <label className="form-check-label w-100" htmlFor="cod">
                          <div className="card border p-3 text-center">
                            <FaShippingFast className="fs-3 mb-2" />
                            <div>Cash on Delivery</div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Credit Card Form */}
                {paymentInfo.method === 'credit_card' && (
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Card Number *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaCreditCard />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          name="cardNumber"
                          value={paymentInfo.cardNumber}
                          onChange={handlePaymentChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Name on Card *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="cardName"
                        value={paymentInfo.cardName}
                        onChange={handlePaymentChange}
                        placeholder="JOHN DOE"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Expiry Date *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="expiry"
                        value={paymentInfo.expiry}
                        onChange={handlePaymentChange}
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">CVV *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="cvv"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentChange}
                        placeholder="123"
                        maxLength="3"
                      />
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="saveCard"
                          checked={paymentInfo.saveCard}
                          onChange={handlePaymentChange}
                        />
                        <label className="form-check-label">
                          Save card for future purchases
                        </label>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* PayPal Note */}
                {paymentInfo.method === 'paypal' && (
                  <div className="alert alert-info">
                    You will be redirected to PayPal to complete your payment.
                  </div>
                )}
                
                {/* COD Note */}
                {paymentInfo.method === 'cod' && (
                  <div className="alert alert-warning">
                    Cash on Delivery available. You'll pay when you receive your order.
                  </div>
                )}
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Order Review</h5>
              </div>
              <div className="card-body">
                {/* Shipping Info Review */}
                <div className="mb-4">
                  <h6 className="mb-3">Shipping Information</h6>
                  <div className="card bg-light">
                    <div className="card-body">
                      <p className="mb-1">
                        <strong>{shippingInfo.firstName} {shippingInfo.lastName}</strong>
                      </p>
                      <p className="mb-1">{shippingInfo.address}</p>
                      <p className="mb-1">{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                      <p className="mb-1">{shippingInfo.country}</p>
                      <p className="mb-0">
                        <FaPhone className="me-2" size={12} />
                        {shippingInfo.phone}
                      </p>
                      <p className="mb-0">
                        <FaEnvelope className="me-2" size={12} />
                        {shippingInfo.email}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Payment Method Review */}
                <div className="mb-4">
                  <h6 className="mb-3">Payment Method</h6>
                  <div className="card bg-light">
                    <div className="card-body">
                      {paymentInfo.method === 'credit_card' && (
                        <>
                          <p className="mb-1">
                            <FaCreditCard className="me-2" />
                            Credit Card
                          </p>
                          <p className="mb-0 text-muted">
                            **** **** **** {paymentInfo.cardNumber.slice(-4)}
                          </p>
                        </>
                      )}
                      {paymentInfo.method === 'paypal' && (
                        <p className="mb-0">
                          <FaPaypal className="me-2" />
                          PayPal
                        </p>
                      )}
                      {paymentInfo.method === 'cod' && (
                        <p className="mb-0">
                          <FaShippingFast className="me-2" />
                          Cash on Delivery
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Order Items Review */}
                <div>
                  <h6 className="mb-3">Order Items</h6>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map(item => (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={item.image || 'https://via.placeholder.com/50'}
                                  alt={item.name}
                                  className="rounded me-3"
                                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                                <div>
                                  <div className="fw-semibold">{item.name}</div>
                                  <small className="text-muted">{item.category}</small>
                                </div>
                              </div>
                            </td>
                            <td>{item.quantity}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between">
            {step > 1 && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button
                className="btn btn-primary ms-auto"
                onClick={handleNextStep}
              >
                Continue to {step === 1 ? 'Payment' : 'Review'}
              </button>
            ) : (
              <button
                className="btn btn-success ms-auto"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaLock className="me-2" />
                    Place Order
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Right Column - Order Summary */}
        <div className="col-lg-4">
          <div className="card sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-light">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              {/* Order Items */}
              <div className="mb-4">
                <h6 className="mb-3">Items ({cartItems.length})</h6>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {cartItems.map(item => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center">
                        <img
                          src={item.image || 'https://via.placeholder.com/40'}
                          alt={item.name}
                          className="rounded me-2"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="small">{item.name}</div>
                          <small className="text-muted">Qty: {item.quantity}</small>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="small">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Order Totals */}
              <div className="border-top pt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-success' : ''}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold fs-5 mt-3 pt-3 border-top">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Security Note */}
              <div className="mt-4 text-center">
                <FaLock className="text-success me-2" />
                <small className="text-muted">
                  Secure checkout. Your information is protected.
                </small>
              </div>
              
              {/* Return Policy */}
              <div className="mt-3 text-center">
                <small className="text-muted">
                  30-Day Return Policy • Free Shipping on orders over $50
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;