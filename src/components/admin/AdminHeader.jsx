import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin-header.css';
import { 
  FaBars, 
  FaTimes, 
  FaUserCircle, 
  FaSignOutAlt, 
  FaBell, 
  FaCog, 
  FaSearch,
  FaHome,
  FaChartBar,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaFileInvoiceDollar
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminHeader = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Mock notifications data
  const [notifications] = useState([
    { id: 1, message: 'New order #ORD1234 received', time: '10 min ago', read: false, type: 'order' },
    { id: 2, message: 'Product "Wireless Mouse" is low in stock', time: '1 hour ago', read: false, type: 'inventory' },
    { id: 3, message: 'Customer John Doe left a review', time: '2 hours ago', read: true, type: 'review' },
    { id: 4, message: 'Monthly sales report is ready', time: '1 day ago', read: true, type: 'report' },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Admin logged out successfully');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to search page or implement search functionality
      toast.info(`Searching for: ${searchQuery}`);
      setSearchQuery('');
    }
  };

  const markNotificationAsRead = (id) => {
    // In real app, make API call to mark as read
    toast.info('Marked notification as read');
    setShowNotifications(false);
  };

  const markAllAsRead = () => {
    toast.success('All notifications marked as read');
    setShowNotifications(false);
  };

  const clearAllNotifications = () => {
    toast.info('All notifications cleared');
    setShowNotifications(false);
  };

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/products')) return 'Products Management';
    if (path.includes('/orders')) return 'Order Management';
    if (path.includes('/users')) return 'User Management';
    if (path.includes('/reports')) return 'Sales Reports';
    return 'Admin Panel';
  };

  // Get page icon based on current route
  const getPageIcon = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return <FaChartBar className="me-2" />;
    if (path.includes('/products')) return <FaBox className="me-2" />;
    if (path.includes('/orders')) return <FaShoppingCart className="me-2" />;
    if (path.includes('/users')) return <FaUsers className="me-2" />;
    if (path.includes('/reports')) return <FaFileInvoiceDollar className="me-2" />;
    return <FaChartBar className="me-2" />;
  };

  return (
    <header className="admin-header bg-white shadow-sm border-bottom sticky-top">
      <div className="container-fluid">
        <div className="row align-items-center py-2">
          {/* Left Section - Toggle & Title */}
          <div className="col-md-3 col-lg-2">
            <div className="d-flex align-items-center">
              <button 
                className="btn btn-link text-dark d-lg-none me-2"
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
              >
                <FaBars size={20} />
              </button>
              
              <Link to="/" className="text-decoration-none d-none d-md-block">
                <span className="fs-4 fw-bold text-primary">BTY-HUB</span>
                <span className="badge bg-light text-dark ms-2">Admin</span>
              </Link>
            </div>
          </div>

          {/* Middle Section - Page Title & Breadcrumb */}
          <div className="col-md-4 col-lg-6 d-none d-md-block">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to="/admin/dashboard" className="text-decoration-none">
                    <FaHome className="me-1" /> Admin
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {getPageIcon()}
                  {getPageTitle()}
                </li>
              </ol>
            </nav>
          </div>

          {/* Right Section - Search, Notifications, User */}
          <div className="col-md-5 col-lg-4">
            <div className="d-flex align-items-center justify-content-end gap-3">
              {/* Search Bar */}
              <form className="d-none d-md-flex" onSubmit={handleSearch}>
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    className="form-control border-end-0"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '200px' }}
                  />
                  <button 
                    className="btn btn-outline-secondary border-start-0" 
                    type="submit"
                  >
                    <FaSearch />
                  </button>
                </div>
              </form>

              {/* Notifications Dropdown */}
              <div className="dropdown">
                <button
                  className="btn btn-link position-relative text-dark"
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  aria-expanded={showNotifications}
                >
                  <FaBell size={20} />
                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {unreadCount}
                      <span className="visually-hidden">unread notifications</span>
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="dropdown-menu dropdown-menu-end show p-0 shadow" style={{ width: '320px' }}>
                    <div className="dropdown-header bg-light d-flex justify-content-between align-items-center">
                      <strong>Notifications ({notifications.length})</strong>
                      <div>
                        <button 
                          className="btn btn-sm btn-link text-primary"
                          onClick={markAllAsRead}
                        >
                          Mark all read
                        </button>
                        <button 
                          className="btn btn-sm btn-link text-danger ms-2"
                          onClick={clearAllNotifications}
                        >
                          Clear all
                        </button>
                      </div>
                    </div>
                    <div className="dropdown-divider m-0"></div>
                    
                    <div className="notification-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`dropdown-item p-3 border-bottom ${!notification.read ? 'bg-light' : ''}`}
                            onClick={() => markNotificationAsRead(notification.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="d-flex">
                              <div className="flex-grow-1">
                                <p className="mb-1">{notification.message}</p>
                                <small className="text-muted">{notification.time}</small>
                              </div>
                              {!notification.read && (
                                <span className="badge bg-primary rounded-pill">New</span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="dropdown-item text-center py-4">
                          <FaBell className="text-muted mb-2" size={24} />
                          <p className="text-muted mb-0">No notifications</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="dropdown-divider m-0"></div>
                    <div className="dropdown-item text-center py-2">
                      <Link to="/admin/notifications" className="text-decoration-none">
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions Menu */}
              <div className="dropdown d-none d-lg-block">
                <button
                  className="btn btn-link text-dark"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaCog size={20} />
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow">
                  <li>
                    <Link className="dropdown-item" to="/admin/settings">
                      <FaCog className="me-2" /> Settings
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/profile">
                      <FaUserCircle className="me-2" /> Admin Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item" to="/">
                      <FaHome className="me-2" /> View Store
                    </Link>
                  </li>
                </ul>
              </div>

              {/* User Profile Dropdown */}
              <div className="dropdown">
                <button
                  className="btn d-flex align-items-center gap-2"
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-expanded={showUserMenu}
                >
                  <div className="text-end d-none d-md-block">
                    <div className="fw-semibold">{user?.name || 'Admin User'}</div>
                    <small className="text-muted">Administrator</small>
                  </div>
                  <div className="position-relative">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Admin"
                        className="rounded-circle border"
                        width="40"
                        height="40"
                      />
                    ) : (
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px' }}>
                        <FaUserCircle size={24} />
                      </div>
                    )}
                    <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
                      style={{ width: '10px', height: '10px' }}></span>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="dropdown-menu dropdown-menu-end show shadow" style={{ minWidth: '200px' }}>
                    <div className="dropdown-header">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          {user?.avatar ? (
                            <img
                              src={user.avatar}
                              alt="Admin"
                              className="rounded-circle border"
                              width="50"
                              height="50"
                            />
                          ) : (
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: '50px', height: '50px' }}>
                              <FaUserCircle size={30} />
                            </div>
                          )}
                        </div>
                        <div>
                          <h6 className="mb-0">{user?.name || 'Admin User'}</h6>
                          <small className="text-muted">{user?.email || 'admin@btyhub.com'}</small>
                        </div>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link className="dropdown-item" to="/admin/profile">
                      <FaUserCircle className="me-2" /> My Profile
                    </Link>
                    <Link className="dropdown-item" to="/admin/settings">
                      <FaCog className="me-2" /> Settings
                    </Link>
                    <div className="dropdown-divider"></div>
                    <Link className="dropdown-item" to="/">
                      <FaHome className="me-2" /> View Store
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="row d-md-none mt-2">
          <div className="col-12">
            <form onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products, orders, users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">
                  <FaSearch />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Stats Bar (Optional - can be shown on dashboard only) */}
      {location.pathname === '/admin/dashboard' && (
        <div className="container-fluid border-top bg-light py-2 d-none d-lg-block">
          <div className="row">
            <div className="col">
              <div className="d-flex justify-content-between">
                <small className="text-muted">
                  <span className="fw-semibold">Last Login:</span> Today, 09:30 AM
                </small>
                <small className="text-muted">
                  <span className="fw-semibold">Active Users:</span> 128
                </small>
                <small className="text-muted">
                  <span className="fw-semibold">Pending Orders:</span> 12
                </small>
                <small className="text-muted">
                  <span className="fw-semibold">System Status:</span> 
                  <span className="text-success ms-1">● All Systems Operational</span>
                </small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for dropdowns on mobile */}
      {(showNotifications || showUserMenu) && (
        <div 
          className="modal-backdrop fade show d-md-none" 
          style={{ zIndex: 1040 }}
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        ></div>
      )}
    </header>
  );
};

export default AdminHeader;

// Add CSS for custom styling
const styles = `
.admin-header {
  z-index: 1030;
}

.notification-list .dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-menu {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

/* Mobile specific styles */
@media (max-width: 768px) {
  .dropdown-menu {
    position: fixed !important;
    top: auto !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0;
    width: 100% !important;
    max-height: 70vh;
    border-radius: 10px 10px 0 0;
    transform: none !important;
  }
}
`;

// Add styles to document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}