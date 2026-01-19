import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaEdit,
  FaSave,
  FaTimes,
  FaHistory,
  FaHeart,
  FaCreditCard,
  FaBell,
  FaShieldAlt
} from 'react-icons/fa';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        country: user.country || 'United States'
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async () => {
    try {
      setLoading(true);
      await updateProfile(profileData);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      // Implement password change logic here
      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <FaUser /> },
    { id: 'orders', name: 'Orders', icon: <FaHistory /> },
    { id: 'wishlist', name: 'Wishlist', icon: <FaHeart /> },
    { id: 'payment', name: 'Payment Methods', icon: <FaCreditCard /> },
    { id: 'security', name: 'Security', icon: <FaLock /> },
    { id: 'notifications', name: 'Notifications', icon: <FaBell /> }
  ];

  // Mock data
  const recentOrders = [
    { id: 'ORD-001', date: '2024-01-15', total: '$129.99', status: 'Delivered' },
    { id: 'ORD-002', date: '2024-01-10', total: '$89.99', status: 'Processing' },
    { id: 'ORD-003', date: '2024-01-05', total: '$199.99', status: 'Shipped' }
  ];

  const wishlistItems = [
    { id: 1, name: 'Wireless Headphones', price: '$199.99', image: 'https://via.placeholder.com/100' },
    { id: 2, name: 'Smart Watch', price: '$299.99', image: 'https://via.placeholder.com/100' },
    { id: 3, name: 'Laptop Stand', price: '$49.99', image: 'https://via.placeholder.com/100' }
  ];

  const paymentMethods = [
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true },
    { id: 2, type: 'PayPal', email: user?.email, isDefault: false }
  ];

  return (
    <div className="container py-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-lg-3 mb-4">
          <div className="card">
            <div className="card-body">
              <div className="text-center mb-4">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: '80px', height: '80px' }}>
                  <FaUser size={40} />
                </div>
                <h5 className="mb-1">{user?.name || 'Customer'}</h5>
                <p className="text-muted small mb-0">{user?.email}</p>
                <span className="badge bg-success mt-2">Verified Account</span>
              </div>
              
              <nav className="nav flex-column">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`nav-link text-start d-flex align-items-center mb-2 ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="me-3">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
              
              <div className="mt-4 pt-3 border-top">
                <div className="d-grid">
                  <button className="btn btn-outline-danger">
                    <FaLock className="me-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaUser className="me-2" />
                  Profile Information
                </h5>
                {!editMode ? (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setEditMode(true)}
                  >
                    <FaEdit className="me-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => setEditMode(false)}
                    >
                      <FaTimes className="me-2" />
                      Cancel
                    </button>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={handleProfileSave}
                      disabled={loading}
                    >
                      <FaSave className="me-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
              <div className="card-body">
                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaUser />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaEnvelope />
                        </span>
                        <input
                          type="email"
                          className="form-control"
                          value={profileData.email}
                          disabled
                        />
                      </div>
                      <small className="text-muted">Email cannot be changed</small>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone Number</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaPhone />
                        </span>
                        <input
                          type="tel"
                          className="form-control"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Address</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaMapMarkerAlt />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          name="address"
                          value={profileData.address}
                          onChange={handleProfileChange}
                          disabled={!editMode}
                          placeholder="Street address"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={profileData.city}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        name="state"
                        value={profileData.state}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">ZIP Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="zipCode"
                        value={profileData.zipCode}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Country</label>
                      <select
                        className="form-select"
                        name="country"
                        value={profileData.country}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="card">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <FaHistory className="me-2" />
                  Order History
                </h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.date}</td>
                          <td>{order.total}</td>
                          <td>
                            <span className={`badge ${
                              order.status === 'Delivered' ? 'bg-success' :
                              order.status === 'Processing' ? 'bg-warning' : 'bg-info'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-center mt-3">
                  <button className="btn btn-primary">
                    View All Orders
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="card">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <FaHeart className="me-2" />
                  My Wishlist ({wishlistItems.length})
                </h5>
              </div>
              <div className="card-body">
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  {wishlistItems.map(item => (
                    <div key={item.id} className="col">
                      <div className="card h-100">
                        <img
                          src={item.image}
                          className="card-img-top"
                          alt={item.name}
                          style={{ height: '150px', objectFit: 'cover' }}
                        />
                        <div className="card-body">
                          <h6 className="card-title">{item.name}</h6>
                          <p className="card-text text-primary fw-bold">{item.price}</p>
                          <div className="d-grid gap-2">
                            <button className="btn btn-sm btn-primary">
                              Add to Cart
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Payment Methods Tab */}
          {activeTab === 'payment' && (
            <div className="card">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaCreditCard className="me-2" />
                  Payment Methods
                </h5>
                <button className="btn btn-sm btn-primary">
                  Add Payment Method
                </button>
              </div>
              <div className="card-body">
                {paymentMethods.map(method => (
                  <div key={method.id} className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="d-flex align-items-center">
                            {method.type === 'Visa' ? (
                              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{ width: '40px', height: '40px' }}>
                                VISA
                              </div>
                            ) : (
                              <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{ width: '40px', height: '40px' }}>
                                PP
                              </div>
                            )}
                            <div>
                              <h6 className="mb-1">
                                {method.type} {method.last4 ? `•••• ${method.last4}` : ''}
                              </h6>
                              {method.expiry && (
                                <small className="text-muted">Expires {method.expiry}</small>
                              )}
                              {method.email && (
                                <small className="text-muted">{method.email}</small>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          {method.isDefault && (
                            <span className="badge bg-success me-2">Default</span>
                          )}
                          <button className="btn btn-sm btn-outline-primary me-2">
                            Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="card">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <FaLock className="me-2" />
                  Security Settings
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <h6>Change Password</h6>
                  <form>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Current Password</label>
                        <input
                          type="password"
                          className="form-control"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Confirm New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <div className="col-12">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handlePasswordSave}
                          disabled={loading}
                        >
                          {loading ? 'Changing Password...' : 'Change Password'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                
                <div className="border-top pt-4">
                  <h6>Two-Factor Authentication</h6>
                  <div className="alert alert-warning">
                    <FaShieldAlt className="me-2" />
                    Two-factor authentication is not enabled for your account.
                  </div>
                  <button className="btn btn-outline-primary">
                    Enable 2FA
                  </button>
                </div>
                
                <div className="border-top pt-4 mt-4">
                  <h6 className="text-danger">Danger Zone</h6>
                  <div className="alert alert-danger">
                    <strong>Delete Account</strong>
                    <p className="mb-2">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="btn btn-outline-danger">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <FaBell className="me-2" />
                  Notification Preferences
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <h6>Email Notifications</h6>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="orderUpdates"
                      defaultChecked
                    />
                    <label className="form-check-label" htmlFor="orderUpdates">
                      Order updates and shipping notifications
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="promotions"
                      defaultChecked
                    />
                    <label className="form-check-label" htmlFor="promotions">
                      Promotions and special offers
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="newsletter"
                    />
                    <label className="form-check-label" htmlFor="newsletter">
                      Newsletter and product updates
                    </label>
                  </div>
                </div>
                
                <div className="border-top pt-4">
                  <h6>Push Notifications</h6>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="pushOrder"
                      defaultChecked
                    />
                    <label className="form-check-label" htmlFor="pushOrder">
                      Order status updates
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="pushPromo"
                    />
                    <label className="form-check-label" htmlFor="pushPromo">
                      Promotional offers
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="pushSecurity"
                      defaultChecked
                    />
                    <label className="form-check-label" htmlFor="pushSecurity">
                      Security alerts
                    </label>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button className="btn btn-primary">
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;