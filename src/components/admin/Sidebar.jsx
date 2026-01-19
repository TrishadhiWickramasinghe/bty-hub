import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaChartBar,
  FaCog,
  FaFileInvoiceDollar,
  FaTags,
  FaHome,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaList,
  FaUserCog,
  FaClipboardList,
  FaDollarSign,
  FaChartLine,
  FaArchive,
  FaCommentDollar,
  FaStore,
  FaUserShield,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const AdminSidebar = ({ collapsed = false, toggleSidebar }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [hoverCollapsed, setHoverCollapsed] = useState(false);

  // Determine if a menu item is active
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  // Check if any child item is active
  const isParentActive = (paths) => {
    return paths.some(path => location.pathname.startsWith(path));
  };

  // Toggle submenu
  const toggleSubmenu = (menuName) => {
    if (activeSubmenu === menuName) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(menuName);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    toast.success('Admin logged out successfully');
  };

  // Main navigation items
  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: <FaTachometerAlt />,
      exact: true
    },
    {
      name: 'Products',
      icon: <FaBox />,
      submenu: true,
      isActive: isParentActive(['/admin/products', '/admin/products/add', '/admin/products/edit']),
      items: [
        { name: 'All Products', path: '/admin/products', icon: <FaList /> },
        { name: 'Add Product', path: '/admin/products/add', icon: <FaPlus /> },
        { name: 'Categories', path: '/admin/categories', icon: <FaTags /> },
        { name: 'Inventory', path: '/admin/inventory', icon: <FaArchive /> },
      ]
    },
    {
      name: 'Orders',
      icon: <FaShoppingCart />,
      submenu: true,
      isActive: isParentActive(['/admin/orders', '/admin/orders/pending', '/admin/orders/completed']),
      items: [
        { name: 'All Orders', path: '/admin/orders', icon: <FaList /> },
        { name: 'Pending Orders', path: '/admin/orders/pending', icon: <FaClipboardList /> },
        { name: 'Completed Orders', path: '/admin/orders/completed', icon: <FaFileInvoiceDollar /> },
        { name: 'Returns', path: '/admin/returns', icon: <FaCommentDollar /> },
      ]
    },
    {
      name: 'Customers',
      path: '/admin/customers',
      icon: <FaUsers />
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: <FaUserShield />
    },
    {
      name: 'Reports',
      icon: <FaChartBar />,
      submenu: true,
      isActive: isParentActive(['/admin/reports', '/admin/reports/sales', '/admin/reports/analytics']),
      items: [
        { name: 'Sales Report', path: '/admin/reports', icon: <FaDollarSign /> },
        { name: 'Analytics', path: '/admin/reports/analytics', icon: <FaChartLine /> },
        { name: 'Revenue', path: '/admin/reports/revenue', icon: <FaChartBar /> },
      ]
    },
    {
      name: 'Store',
      icon: <FaStore />,
      submenu: true,
      isActive: isParentActive(['/admin/store/settings', '/admin/store/theme']),
      items: [
        { name: 'Store Settings', path: '/admin/store/settings', icon: <FaCog /> },
        { name: 'Theme Customization', path: '/admin/store/theme', icon: <FaTags /> },
        { name: 'Payment Methods', path: '/admin/store/payments', icon: <FaDollarSign /> },
      ]
    },
  ];

  // Quick stats (mock data)
  const quickStats = [
    { label: 'New Orders', value: '12', change: '+2', color: 'primary' },
    { label: 'Low Stock', value: '5', change: '-1', color: 'warning' },
    { label: 'Pending Reviews', value: '8', change: '+3', color: 'info' },
  ];

  // Handle mouse enter/leave for hover effect
  const handleMouseEnter = () => {
    if (collapsed) {
      setHoverCollapsed(true);
    }
  };

  const handleMouseLeave = () => {
    setHoverCollapsed(false);
  };

  // Determine sidebar width class
  const sidebarWidthClass = collapsed && !hoverCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded';

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div 
          className="sidebar-overlay d-lg-none"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`admin-sidebar bg-dark text-white ${sidebarWidthClass} ${collapsed ? 'collapsed' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header p-3 border-bottom border-secondary">
          <div className="d-flex align-items-center justify-content-between">
            {(!collapsed || hoverCollapsed) ? (
              <>
                <div className="d-flex align-items-center">
                  <div className="logo-icon bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                    style={{ width: '36px', height: '36px' }}>
                    <FaStore size={18} />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold">BTY-HUB</h5>
                    <small className="text-muted">Admin Panel</small>
                  </div>
                </div>
                <button 
                  className="btn btn-link text-white p-0 d-lg-none"
                  onClick={toggleSidebar}
                >
                  <FaTimes size={20} />
                </button>
              </>
            ) : (
              <div className="text-center w-100">
                <div className="logo-icon bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto"
                  style={{ width: '36px', height: '36px' }}>
                  <FaStore size={18} />
                </div>
              </div>
            )}
            
            {/* Toggle Button for Desktop */}
            <button 
              className="btn btn-link text-white p-0 d-none d-lg-block"
              onClick={toggleSidebar}
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          </div>
        </div>

        {/* Quick Stats (Visible when expanded) */}
        {(!collapsed || hoverCollapsed) && (
          <div className="sidebar-stats p-3 border-bottom border-secondary">
            <small className="text-muted d-block mb-2">Quick Stats</small>
            <div className="row g-2">
              {quickStats.map((stat, index) => (
                <div key={index} className="col-4">
                  <div className="text-center">
                    <div className={`badge bg-${stat.color} rounded-circle d-inline-flex align-items-center justify-content-center mb-1`}
                      style={{ width: '30px', height: '30px' }}>
                      {stat.value}
                    </div>
                    <div className="text-truncate" style={{ fontSize: '11px' }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav flex-grow-1 p-3">
          <ul className="nav flex-column">
            {/* Home Link */}
            <li className="nav-item mb-2">
              <NavLink 
                to="/" 
                className="nav-link d-flex align-items-center text-white"
                activeClassName="active"
              >
                <FaHome className="sidebar-icon" />
                {(!collapsed || hoverCollapsed) && <span className="ms-3">View Store</span>}
              </NavLink>
            </li>

            {/* Main Navigation Items */}
            {navItems.map((item, index) => (
              <li key={index} className="nav-item mb-1">
                {item.submenu ? (
                  <>
                    <div 
                      className={`nav-link d-flex align-items-center justify-content-between text-white cursor-pointer ${item.isActive ? 'active' : ''}`}
                      onClick={() => toggleSubmenu(item.name)}
                    >
                      <div className="d-flex align-items-center">
                        <span className="sidebar-icon">{item.icon}</span>
                        {(!collapsed || hoverCollapsed) && <span className="ms-3">{item.name}</span>}
                      </div>
                      {(!collapsed || hoverCollapsed) && (
                        <span className={`arrow ${activeSubmenu === item.name ? 'rotate' : ''}`}>
                          <FaChevronRight size={12} />
                        </span>
                      )}
                    </div>
                    
                    {/* Submenu */}
                    {(!collapsed || hoverCollapsed) && activeSubmenu === item.name && (
                      <ul className="nav flex-column submenu ps-4">
                        {item.items.map((subItem, subIndex) => (
                          <li key={subIndex} className="nav-item">
                            <NavLink 
                              to={subItem.path}
                              className="nav-link d-flex align-items-center text-white"
                              activeClassName="active"
                            >
                              <span className="sidebar-icon-sm">{subItem.icon}</span>
                              <span className="ms-2">{subItem.name}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <NavLink 
                    to={item.path}
                    end={item.exact}
                    className="nav-link d-flex align-items-center text-white"
                    activeClassName="active"
                  >
                    <span className="sidebar-icon">{item.icon}</span>
                    {(!collapsed || hoverCollapsed) && <span className="ms-3">{item.name}</span>}
                  </NavLink>
                )}
              </li>
            ))}

            {/* Divider */}
            <li className="nav-item my-3">
              <hr className="border-secondary" />
            </li>

            {/* Settings */}
            <li className="nav-item mb-1">
              <NavLink 
                to="/admin/settings" 
                className="nav-link d-flex align-items-center text-white"
                activeClassName="active"
              >
                <FaCog className="sidebar-icon" />
                {(!collapsed || hoverCollapsed) && <span className="ms-3">Settings</span>}
              </NavLink>
            </li>

            {/* Logout */}
            <li className="nav-item mt-auto">
              <button 
                className="nav-link d-flex align-items-center text-white w-100 border-0 bg-transparent"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="sidebar-icon" />
                {(!collapsed || hoverCollapsed) && <span className="ms-3">Logout</span>}
              </button>
            </li>
          </ul>
        </nav>

        {/* Admin Profile (Visible when expanded) */}
        {(!collapsed || hoverCollapsed) && (
          <div className="sidebar-footer p-3 border-top border-secondary">
            <div className="d-flex align-items-center">
              <div className="position-relative me-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '40px', height: '40px' }}>
                  <FaUserCog size={20} />
                </div>
                <span className="position-absolute bottom-0 end-0 bg-success border border-dark rounded-circle"
                  style={{ width: '10px', height: '10px' }}></span>
              </div>
              <div className="flex-grow-1">
                <div className="fw-semibold">Administrator</div>
                <small className="text-muted">Super Admin</small>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed Admin Profile Icon */}
        {(collapsed && !hoverCollapsed) && (
          <div className="sidebar-footer text-center p-3">
            <div className="position-relative d-inline-block">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style={{ width: '40px', height: '40px' }}>
                <FaUserCog size={20} />
              </div>
              <span className="position-absolute bottom-0 end-0 bg-success border border-dark rounded-circle"
                style={{ width: '10px', height: '10px' }}></span>
            </div>
          </div>
        )}
      </aside>

      {/* Add CSS */}
      <style jsx="true">{`
        .admin-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 250px;
          z-index: 1000;
          transition: all 0.3s ease;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .admin-sidebar.collapsed {
          width: 70px;
        }

        .admin-sidebar.collapsed .sidebar-expanded {
          display: none;
        }

        .admin-sidebar:not(.collapsed) .sidebar-collapsed {
          display: none;
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .sidebar-header {
          min-height: 70px;
        }

        .sidebar-stats {
          background-color: rgba(255, 255, 255, 0.05);
        }

        .sidebar-icon {
          min-width: 20px;
          text-align: center;
        }

        .sidebar-icon-sm {
          min-width: 16px;
          text-align: center;
          font-size: 14px;
        }

        .nav-link {
          padding: 10px 15px;
          border-radius: 5px;
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: white !important;
        }

        .nav-link.active {
          background-color: #0d6efd;
          color: white !important;
        }

        .cursor-pointer {
          cursor: pointer;
        }

        .submenu {
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .arrow {
          transition: transform 0.3s ease;
        }

        .arrow.rotate {
          transform: rotate(90deg);
        }

        .sidebar-footer {
          background-color: rgba(255, 255, 255, 0.05);
        }

        /* Scrollbar styling */
        .admin-sidebar::-webkit-scrollbar {
          width: 5px;
        }

        .admin-sidebar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        .admin-sidebar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }

        .admin-sidebar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        /* Responsive adjustments */
        @media (max-width: 992px) {
          .admin-sidebar {
            transform: translateX(-100%);
            box-shadow: 3px 0 10px rgba(0, 0, 0, 0.2);
          }
          
          .admin-sidebar.collapsed {
            transform: translateX(0);
            width: 250px;
          }
        }

        @media (min-width: 993px) {
          .admin-sidebar.collapsed:hover {
            width: 250px;
            box-shadow: 3px 0 10px rgba(0, 0, 0, 0.2);
          }
          
          .admin-sidebar.collapsed:hover .sidebar-expanded {
            display: block;
          }
          
          .admin-sidebar.collapsed:hover .sidebar-collapsed {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;