import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      
      navigate('/');
      toast.success('Registration successful! Welcome to BTY-HUB');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Create Account</h2>
                <p className="text-muted">Join BTY-HUB today</p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Full Name */}
                  <div className="col-12">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>
                  
                  {/* Email */}
                  <div className="col-12">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                  
                  {/* Phone */}
                  <div className="col-12">
                    <label className="form-label">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  {/* Password */}
                  <div className="col-md-6">
                    <label className="form-label">Password *</label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                    <small className="text-muted">At least 6 characters</small>
                  </div>
                  
                  {/* Confirm Password */}
                  <div className="col-md-6">
                    <label className="form-label">Confirm Password *</label>
                    <input
                      type="password"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">{errors.confirmPassword}</div>
                    )}
                  </div>
                  
                  {/* Terms and Conditions */}
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className={`form-check-input ${errors.acceptTerms ? 'is-invalid' : ''}`}
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        id="acceptTerms"
                      />
                      <label className="form-check-label" htmlFor="acceptTerms">
                        I agree to the <a href="/terms" className="text-decoration-none">Terms and Conditions</a> and <a href="/privacy" className="text-decoration-none">Privacy Policy</a> *
                      </label>
                      {errors.acceptTerms && (
                        <div className="invalid-feedback d-block">{errors.acceptTerms}</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-3"
                      disabled={loading}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </div>
                </div>
              </form>
              
              {/* Divider */}
              <div className="position-relative my-4">
                <hr />
                <div className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
                  OR
                </div>
              </div>
              
              {/* Social Login (Optional) */}
              <div className="row g-2 mb-4">
                <div className="col-md-6">
                  <button className="btn btn-outline-dark w-100">
                    <i className="fab fa-google me-2"></i>
                    Continue with Google
                  </button>
                </div>
                <div className="col-md-6">
                  <button className="btn btn-outline-primary w-100">
                    <i className="fab fa-facebook me-2"></i>
                    Continue with Facebook
                  </button>
                </div>
              </div>
              
              {/* Login Link */}
              <div className="text-center">
                <p className="mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-decoration-none fw-semibold">
                    Sign in here
                  </Link>
                </p>
              </div>
              
              {/* Benefits */}
              <div className="mt-4 pt-3 border-top">
                <h6 className="mb-3">Benefits of joining:</h6>
                <ul className="list-unstyled small text-muted">
                  <li className="mb-2">✓ Fast checkout with saved details</li>
                  <li className="mb-2">✓ Track your orders</li>
                  <li className="mb-2">✓ Wishlist your favorite items</li>
                  <li className="mb-2">✓ Exclusive member discounts</li>
                  <li>✓ Personalized recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;