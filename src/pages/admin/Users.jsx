import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import {
  FaSearch,
  FaFilter,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaUser,
  FaUserCheck,
  FaUserTimes,
  FaUserLock,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaShoppingCart,
  FaDollarSign,
  FaStar,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaDownload,
  FaFileExport,
  FaEllipsisV,
  FaCheck,
  FaTimes,
  FaSync,
  FaKey,
  FaComment,
  FaBan,
  FaCheckCircle,
  FaUserShield,
  FaUserTag,
  FaChartLine,
  FaLocationArrow,
  FaMapMarkerAlt,
  FaCreditCard,
  FaHistory,
  FaClipboardList
} from 'react-icons/fa';

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [sortConfig, setSortConfig] = useState({ key: 'joinedDate', direction: 'desc' });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  
  // Filters state
  const [filters, setFilters] = useState({
    status: 'all',
    role: 'all',
    emailVerified: 'all',
    hasOrders: 'all'
  });

  // New user form
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    password: '',
    confirmPassword: ''
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    customers: 0,
    admins: 0,
    active: 0,
    inactive: 0,
    emailVerified: 0,
    totalSpent: 0
  });

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1
  });

  // User roles
  const userRoles = [
    { id: 'customer', name: 'Customer', color: 'primary' },
    { id: 'admin', name: 'Administrator', color: 'danger' },
    { id: 'moderator', name: 'Moderator', color: 'warning' },
    { id: 'vendor', name: 'Vendor', color: 'info' }
  ];

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter and sort users when dependencies change
  useEffect(() => {
    applyFiltersAndSort();
  }, [users, filters, searchTerm, dateRange, sortConfig]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const mockUsers = generateMockUsers();
      setUsers(mockUsers);
      updateStats(mockUsers);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const generateMockUsers = () => {
    const roles = ['customer', 'admin', 'moderator', 'vendor'];
    const statuses = ['active', 'inactive', 'suspended'];
    
    return Array.from({ length: 50 }, (_, i) => {
      const isAdmin = i === 0;
      const joinDate = new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000);
      const totalOrders = Math.floor(Math.random() * 50);
      const totalSpent = parseFloat((Math.random() * 10000 + 50).toFixed(2));
      const avgRating = parseFloat((Math.random() * 2 + 3).toFixed(1));
      
      return {
        id: `USR-${String(i + 1).padStart(6, '0')}`,
        name: i === 0 ? 'Admin User' : `Customer ${i}`,
        email: i === 0 ? 'admin@btyhub.com' : `customer${i}@example.com`,
        phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        role: i === 0 ? 'admin' : roles[Math.floor(Math.random() * roles.length)],
        status: i === 0 ? 'active' : statuses[Math.floor(Math.random() * statuses.length)],
        emailVerified: Math.random() > 0.3,
        joinedDate: joinDate.toISOString().split('T')[0],
        lastLogin: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        totalOrders,
        totalSpent,
        avgRating,
        avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
        address: `${Math.floor(Math.random() * 9999) + 1} Main St, City, State ${Math.floor(Math.random() * 90000) + 10000}`,
        notes: i % 5 === 0 ? 'VIP Customer' : '',
        orderHistory: Array.from({ length: Math.min(totalOrders, 5) }, (_, j) => ({
          id: `ORD-${String(j + 1).padStart(6, '0')}`,
          date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          amount: parseFloat((Math.random() * 500 + 50).toFixed(2)),
          status: ['completed', 'processing', 'shipped', 'cancelled'][Math.floor(Math.random() * 4)]
        }))
      };
    });
  };

  const updateStats = (usersList) => {
    const statsObj = {
      total: usersList.length,
      customers: usersList.filter(u => u.role === 'customer').length,
      admins: usersList.filter(u => u.role === 'admin').length,
      active: usersList.filter(u => u.status === 'active').length,
      inactive: usersList.filter(u => u.status === 'inactive').length,
      emailVerified: usersList.filter(u => u.emailVerified).length,
      totalSpent: usersList.reduce((sum, user) => sum + user.totalSpent, 0)
    };
    setStats(statsObj);
  };

  const applyFiltersAndSort = () => {
    let result = [...users];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phone.toLowerCase().includes(term) ||
        user.id.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(user => user.status === filters.status);
    }

    // Apply role filter
    if (filters.role !== 'all') {
      result = result.filter(user => user.role === filters.role);
    }

    // Apply email verification filter
    if (filters.emailVerified !== 'all') {
      result = result.filter(user => 
        filters.emailVerified === 'verified' ? user.emailVerified : !user.emailVerified
      );
    }

    // Apply orders filter
    if (filters.hasOrders !== 'all') {
      result = result.filter(user => 
        filters.hasOrders === 'has_orders' ? user.totalOrders > 0 : user.totalOrders === 0
      );
    }

    // Apply date filter
    if (startDate && endDate) {
      result = result.filter(user => {
        const userDate = new Date(user.joinedDate);
        return userDate >= startDate && userDate <= endDate;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortConfig.key === 'name') {
        return sortConfig.direction === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortConfig.key === 'joinedDate') {
        const dateA = new Date(a.joinedDate);
        const dateB = new Date(b.joinedDate);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (sortConfig.key === 'totalSpent') {
        return sortConfig.direction === 'asc' ? a.totalSpent - b.totalSpent : b.totalSpent - a.totalSpent;
      }
      if (sortConfig.key === 'totalOrders') {
        return sortConfig.direction === 'asc' ? a.totalOrders - b.totalOrders : b.totalOrders - a.totalOrders;
      }
      return 0;
    });

    // Update pagination
    const totalPages = Math.ceil(result.length / pagination.itemsPerPage);
    setPagination(prev => ({ ...prev, totalPages }));

    // Get current page items
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    const paginatedResult = result.slice(startIndex, endIndex);

    setFilteredUsers(paginatedResult);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      role: 'all',
      emailVerified: 'all',
      hasOrders: 'all'
    });
    setDateRange([null, null]);
    setSearchTerm('');
    setSelectedUsers([]);
    toast.info('All filters reset');
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) {
      toast.warning('Please select users first');
      return;
    }

    switch (action) {
      case 'activate':
        updateUsersStatus(selectedUsers, 'active');
        break;
      case 'deactivate':
        updateUsersStatus(selectedUsers, 'inactive');
        break;
      case 'suspend':
        updateUsersStatus(selectedUsers, 'suspended');
        break;
      case 'send_email':
        sendBulkEmail();
        break;
      case 'export':
        exportSelectedUsers();
        break;
      case 'delete':
        setSelectedUserId(selectedUsers[0]);
        setShowDeleteModal(true);
        break;
    }
  };

  const updateUsersStatus = (userIds, status) => {
    setUsers(prev =>
      prev.map(user =>
        userIds.includes(user.id) ? { ...user, status } : user
      )
    );
    setSelectedUsers([]);
    toast.success(`${userIds.length} user(s) status updated to ${status}`);
  };

  const updateUserRole = (userId, role) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, role } : user
      )
    );
    toast.success(`User role updated to ${role}`);
  };

  const sendBulkEmail = () => {
    toast.info(`Sending email to ${selectedUsers.length} users...`);
    // In production, integrate with email service
  };

  const exportSelectedUsers = () => {
    const usersToExport = selectedUsers.length > 0
      ? users.filter(user => selectedUsers.includes(user.id))
      : filteredUsers;
    
    toast.success(`Exported ${usersToExport.length} users`);
    // In production, generate and download CSV/Excel
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const newUserObj = {
      id: `USR-${String(users.length + 1).padStart(6, '0')}`,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      status: 'active',
      emailVerified: false,
      joinedDate: new Date().toISOString().split('T')[0],
      lastLogin: null,
      totalOrders: 0,
      totalSpent: 0,
      avgRating: 0,
      avatar: 'https://i.pravatar.cc/150?img=51',
      address: '',
      notes: '',
      orderHistory: []
    };

    setUsers(prev => [newUserObj, ...prev]);
    setShowAddUserModal(false);
    resetNewUserForm();
    toast.success('User added successfully');
  };

  const resetNewUserForm = () => {
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'customer',
      password: '',
      confirmPassword: ''
    });
  };

  const deleteUser = () => {
    setUsers(prev => prev.filter(user => user.id !== selectedUserId));
    setShowDeleteModal(false);
    setSelectedUserId(null);
    setSelectedUsers([]);
    toast.success('User deleted successfully');
  };

  const viewUserDetails = (user) => {
    setSelectedUserDetails(user);
    setShowUserDetails(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'success', icon: <FaUserCheck />, text: 'Active' },
      inactive: { color: 'secondary', icon: <FaUserTimes />, text: 'Inactive' },
      suspended: { color: 'danger', icon: <FaUserLock />, text: 'Suspended' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`badge bg-${config.color} d-flex align-items-center gap-1`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleConfig = userRoles.find(r => r.id === role) || userRoles[0];
    return (
      <span className={`badge bg-${roleConfig.color}`}>
        {roleConfig.name}
      </span>
    );
  };

  const getVerificationBadge = (verified) => {
    return verified ? (
      <span className="badge bg-success">
        <FaCheck className="me-1" />
        Verified
      </span>
    ) : (
      <span className="badge bg-warning">
        <FaTimes className="me-1" />
        Unverified
      </span>
    );
  };

  const getOrderStatusBadge = (status) => {
    const config = {
      completed: { color: 'success', text: 'Completed' },
      processing: { color: 'warning', text: 'Processing' },
      shipped: { color: 'info', text: 'Shipped' },
      cancelled: { color: 'danger', text: 'Cancelled' }
    };
    const statusConfig = config[status] || config.completed;
    return (
      <span className={`badge bg-${statusConfig.color}`}>
        {statusConfig.text}
      </span>
    );
  };

  const handlePageChange = (pageNumber) => {
    setPagination(prev => ({ ...prev, currentPage: pageNumber }));
  };

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 mb-1">User Management</h1>
              <p className="text-muted mb-0">
                Manage your store's users and customers
              </p>
            </div>
            
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
              
              <button
                className="btn btn-primary"
                onClick={() => setShowAddUserModal(true)}
              >
                <FaUserPlus className="me-2" />
                Add New User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-2 col-sm-4 col-6 mb-3">
          <div className="card border-0 bg-primary bg-opacity-10">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-primary text-white rounded-circle p-3 me-3">
                  <FaUser size={20} />
                </div>
                <div>
                  <div className="h4 mb-0">{stats.total}</div>
                  <small className="text-muted">Total Users</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-2 col-sm-4 col-6 mb-3">
          <div className="card border-0 bg-success bg-opacity-10">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-success text-white rounded-circle p-3 me-3">
                  <FaUserCheck size={20} />
                </div>
                <div>
                  <div className="h4 mb-0">{stats.active}</div>
                  <small className="text-muted">Active</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-2 col-sm-4 col-6 mb-3">
          <div className="card border-0 bg-info bg-opacity-10">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-info text-white rounded-circle p-3 me-3">
                  <FaUserShield size={20} />
                </div>
                <div>
                  <div className="h4 mb-0">{stats.admins}</div>
                  <small className="text-muted">Admins</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-2 col-sm-4 col-6 mb-3">
          <div className="card border-0 bg-warning bg-opacity-10">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-warning text-white rounded-circle p-3 me-3">
                  <FaCheckCircle size={20} />
                </div>
                <div>
                  <div className="h4 mb-0">{stats.emailVerified}</div>
                  <small className="text-muted">Verified Email</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-2 col-sm-4 col-6 mb-3">
          <div className="card border-0 bg-danger bg-opacity-10">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-danger text-white rounded-circle p-3 me-3">
                  <FaShoppingCart size={20} />
                </div>
                <div>
                  <div className="h4 mb-0">{stats.customers}</div>
                  <small className="text-muted">Customers</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-2 col-sm-4 col-6 mb-3">
          <div className="card border-0 bg-dark bg-opacity-10">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-dark text-white rounded-circle p-3 me-3">
                  <FaDollarSign size={20} />
                </div>
                <div>
                  <div className="h4 mb-0">${stats.totalSpent.toLocaleString()}</div>
                  <small className="text-muted">Total Spent</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <FaFilter className="me-2" />
                Filters & Search
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {/* Search Bar */}
                <div className="col-md-12">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name, email, phone, or user ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setSearchTerm('')}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Basic Filters */}
                <div className="col-md-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={filters.role}
                    onChange={(e) => handleFilterChange('role', e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    {userRoles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Email Verification</label>
                  <select
                    className="form-select"
                    value={filters.emailVerified}
                    onChange={(e) => handleFilterChange('emailVerified', e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="verified">Verified Only</option>
                    <option value="unverified">Unverified Only</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Orders</label>
                  <select
                    className="form-select"
                    value={filters.hasOrders}
                    onChange={(e) => handleFilterChange('hasOrders', e.target.value)}
                  >
                    <option value="all">All Users</option>
                    <option value="has_orders">Has Orders</option>
                    <option value="no_orders">No Orders</option>
                  </select>
                </div>

                {/* Date Range */}
                <div className="col-md-6">
                  <label className="form-label">Joined Date Range</label>
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => setDateRange(update)}
                    placeholderText="Select joined date range"
                    className="form-control"
                    dateFormat="MMM dd, yyyy"
                  />
                </div>

                {/* Sort By */}
                <div className="col-md-6">
                  <label className="form-label">Sort By</label>
                  <select
                    className="form-select"
                    value={`${sortConfig.key}-${sortConfig.direction}`}
                    onChange={(e) => {
                      const [key, direction] = e.target.value.split('-');
                      setSortConfig({ key, direction });
                    }}
                  >
                    <option value="joinedDate-desc">Newest First</option>
                    <option value="joinedDate-asc">Oldest First</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="totalSpent-desc">Highest Spending</option>
                    <option value="totalOrders-desc">Most Orders</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="card border-primary">
              <div className="card-body py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{selectedUsers.length} user(s) selected</strong>
                  </div>
                  <div className="d-flex gap-2">
                    <div className="dropdown">
                      <button
                        className="btn btn-sm btn-outline-primary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        Update Status
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleBulkAction('activate')}
                          >
                            <FaUserCheck className="me-2 text-success" />
                            Activate
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleBulkAction('deactivate')}
                          >
                            <FaUserTimes className="me-2 text-secondary" />
                            Deactivate
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => handleBulkAction('suspend')}
                          >
                            <FaBan className="me-2" />
                            Suspend
                          </button>
                        </li>
                      </ul>
                    </div>
                    
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleBulkAction('send_email')}
                    >
                      <FaEnvelope className="me-1" /> Send Email
                    </button>
                    
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleBulkAction('export')}
                    >
                      <FaDownload className="me-1" /> Export
                    </button>
                    
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleBulkAction('delete')}
                    >
                      <FaTrash className="me-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <h5 className="mb-0 me-3">
                  Users ({filteredUsers.length} of {users.length})
                </h5>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                  />
                  <label className="form-check-label small">Select All</label>
                </div>
              </div>
              
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={fetchUsers}
                >
                  <FaSync />
                </button>
                
                <div className="dropdown">
                  <button
                    className="btn btn-sm btn-outline-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <FaFileExport className="me-1" /> Export
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button className="dropdown-item" onClick={() => exportSelectedUsers()}>
                        Export All
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item">
                        Export as CSV
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item">
                        Export as Excel
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '50px' }}>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            onChange={handleSelectAll}
                          />
                        </div>
                      </th>
                      <th>
                        <button
                          className="btn btn-link text-decoration-none p-0"
                          onClick={() => handleSort('name')}
                        >
                          User
                          {sortConfig.key === 'name' && (
                            sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                          )}
                        </button>
                      </th>
                      <th>Contact</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>
                        <button
                          className="btn btn-link text-decoration-none p-0"
                          onClick={() => handleSort('joinedDate')}
                        >
                          Joined
                          {sortConfig.key === 'joinedDate' && (
                            sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                          )}
                        </button>
                      </th>
                      <th>
                        <button
                          className="btn btn-link text-decoration-none p-0"
                          onClick={() => handleSort('totalOrders')}
                        >
                          Orders
                          {sortConfig.key === 'totalOrders' && (
                            sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                          )}
                        </button>
                      </th>
                      <th>
                        <button
                          className="btn btn-link text-decoration-none p-0"
                          onClick={() => handleSort('totalSpent')}
                        >
                          Spent
                          {sortConfig.key === 'totalSpent' && (
                            sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                          )}
                        </button>
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center py-5">
                          <div className="text-muted">
                            <FaSearch size={48} className="mb-3" />
                            <h5>No users found</h5>
                            <p>Try adjusting your filters or search term</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(user => (
                        <tr key={user.id} className={selectedUsers.includes(user.id) ? 'table-active' : ''}>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => handleSelectUser(user.id)}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="rounded-circle me-3"
                                width="40"
                                height="40"
                              />
                              <div>
                                <div className="fw-semibold">{user.name}</div>
                                <div className="small text-muted">ID: {user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="d-flex align-items-center mb-1">
                                <FaEnvelope className="me-2 text-muted" size={12} />
                                <div>{user.email}</div>
                                {getVerificationBadge(user.emailVerified)}
                              </div>
                              <div className="d-flex align-items-center">
                                <FaPhone className="me-2 text-muted" size={12} />
                                <div>{user.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            {getRoleBadge(user.role)}
                            {user.notes && (
                              <div className="small text-muted mt-1">{user.notes}</div>
                            )}
                          </td>
                          <td>{getStatusBadge(user.status)}</td>
                          <td>
                            <div>{user.joinedDate}</div>
                            <div className="small text-muted">
                              <FaCalendarAlt className="me-1" />
                              {new Date(user.joinedDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short'
                              })}
                            </div>
                          </td>
                          <td>
                            <div className="fw-semibold">{user.totalOrders}</div>
                            <div className="small text-muted">
                              <FaShoppingCart className="me-1" />
                              {user.totalOrders === 0 ? 'No orders' : 'orders'}
                            </div>
                          </td>
                          <td>
                            <div className="fw-bold text-primary">
                              ${user.totalSpent.toFixed(2)}
                            </div>
                            <div className="small text-muted">
                              <FaStar className="me-1 text-warning" />
                              {user.avgRating.toFixed(1)} rating
                            </div>
                          </td>
                          <td>
                            <div className="dropdown">
                              <button
                                className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                              >
                                <FaEllipsisV />
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => viewUserDetails(user)}
                                  >
                                    <FaEye className="me-2" />
                                    View Profile
                                  </button>
                                </li>
                                <li>
                                  <button className="dropdown-item">
                                    <FaEdit className="me-2" />
                                    Edit User
                                  </button>
                                </li>
                                <li>
                                  <button className="dropdown-item">
                                    <FaEnvelope className="me-2" />
                                    Send Email
                                  </button>
                                </li>
                                <li>
                                  <button className="dropdown-item">
                                    <FaKey className="me-2" />
                                    Reset Password
                                  </button>
                                </li>
                                <li>
                                  <button className="dropdown-item">
                                    <FaComment className="me-2" />
                                    Send Message
                                  </button>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                  <div className="dropdown-header">Update Status</div>
                                </li>
                                {user.status !== 'active' && (
                                  <li>
                                    <button
                                      className="dropdown-item text-success"
                                      onClick={() => updateUsersStatus([user.id], 'active')}
                                    >
                                      <FaUserCheck className="me-2" />
                                      Activate
                                    </button>
                                  </li>
                                )}
                                {user.status !== 'inactive' && (
                                  <li>
                                    <button
                                      className="dropdown-item text-secondary"
                                      onClick={() => updateUsersStatus([user.id], 'inactive')}
                                    >
                                      <FaUserTimes className="me-2" />
                                      Deactivate
                                    </button>
                                  </li>
                                )}
                                {user.status !== 'suspended' && (
                                  <li>
                                    <button
                                      className="dropdown-item text-danger"
                                      onClick={() => updateUsersStatus([user.id], 'suspended')}
                                    >
                                      <FaBan className="me-2" />
                                      Suspend
                                    </button>
                                  </li>
                                )}
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                  <div className="dropdown-header">Change Role</div>
                                </li>
                                {userRoles.map(role => (
                                  user.role !== role.id && (
                                    <li key={role.id}>
                                      <button
                                        className="dropdown-item"
                                        onClick={() => updateUserRole(user.id, role.id)}
                                      >
                                        <FaUserTag className="me-2" />
                                        Set as {role.name}
                                      </button>
                                    </li>
                                  )
                                ))}
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={() => {
                                      setSelectedUserId(user.id);
                                      setShowDeleteModal(true);
                                    }}
                                  >
                                    <FaTrash className="me-2" />
                                    Delete User
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {filteredUsers.length > 0 && (
              <div className="card-footer d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">
                    Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                    {Math.min(pagination.currentPage * pagination.itemsPerPage, users.length)} of{' '}
                    {users.length} users
                  </small>
                </div>
                
                <nav>
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                      >
                        Previous
                      </button>
                    </li>
                    
                    {[...Array(pagination.totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      if (
                        pageNumber === 1 ||
                        pageNumber === pagination.totalPages ||
                        (pageNumber >= pagination.currentPage - 1 && pageNumber <= pagination.currentPage + 1)
                      ) {
                        return (
                          <li
                            key={pageNumber}
                            className={`page-item ${pagination.currentPage === pageNumber ? 'active' : ''}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          </li>
                        );
                      } else if (
                        pageNumber === pagination.currentPage - 2 ||
                        pageNumber === pagination.currentPage + 2
                      ) {
                        return (
                          <li key={pageNumber} className="page-item disabled">
                            <span className="page-link">...</span>
                          </li>
                        );
                      }
                      return null;
                    })}
                    
                    <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <FaUserPlus className="me-2" />
                  Add New User
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setShowAddUserModal(false);
                    resetNewUserForm();
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newUser.name}
                        onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={newUser.phone}
                        onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">User Role</label>
                      <select
                        className="form-select"
                        value={newUser.role}
                        onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                      >
                        {userRoles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Password *</label>
                      <input
                        type="password"
                        className="form-control"
                        value={newUser.password}
                        onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Confirm Password *</label>
                      <input
                        type="password"
                        className="form-control"
                        value={newUser.confirmPassword}
                        onChange={(e) => setNewUser(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddUserModal(false);
                    resetNewUserForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddUser}
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  <FaTrash className="me-2" />
                  Confirm Deletion
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-danger">
                  <FaBan className="me-2" />
                  This action cannot be undone!
                </div>
                <p>
                  Are you sure you want to delete this user? All associated data will be permanently removed.
                </p>
                {selectedUserId && (
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <img
                          src={users.find(u => u.id === selectedUserId)?.avatar}
                          alt="User"
                          className="rounded-circle me-3"
                          width="50"
                          height="50"
                        />
                        <div>
                          <h6 className="mb-1">{users.find(u => u.id === selectedUserId)?.name}</h6>
                          <small className="text-muted">{users.find(u => u.id === selectedUserId)?.email}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={deleteUser}
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUserDetails && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <FaUser className="me-2" />
                  User Profile: {selectedUserDetails.name}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowUserDetails(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4">
                    <div className="text-center mb-4">
                      <img
                        src={selectedUserDetails.avatar}
                        alt={selectedUserDetails.name}
                        className="rounded-circle mb-3"
                        width="120"
                        height="120"
                      />
                      <h5>{selectedUserDetails.name}</h5>
                      <div className="mb-2">{getRoleBadge(selectedUserDetails.role)}</div>
                      <div className="mb-2">{getStatusBadge(selectedUserDetails.status)}</div>
                      <div>{getVerificationBadge(selectedUserDetails.emailVerified)}</div>
                    </div>
                    
                    <div className="card mb-3">
                      <div className="card-body">
                        <h6 className="card-title">Quick Stats</h6>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Total Orders:</span>
                          <strong>{selectedUserDetails.totalOrders}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Total Spent:</span>
                          <strong className="text-primary">${selectedUserDetails.totalSpent.toFixed(2)}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Avg. Rating:</span>
                          <strong>
                            <FaStar className="text-warning me-1" />
                            {selectedUserDetails.avgRating.toFixed(1)}
                          </strong>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Joined:</span>
                          <strong>{selectedUserDetails.joinedDate}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-12 mb-3">
                        <h6>Contact Information</h6>
                        <div className="card">
                          <div className="card-body">
                            <div className="d-flex align-items-center mb-2">
                              <FaEnvelope className="me-3 text-muted" />
                              <div>
                                <div className="small text-muted">Email</div>
                                <div>{selectedUserDetails.email}</div>
                              </div>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                              <FaPhone className="me-3 text-muted" />
                              <div>
                                <div className="small text-muted">Phone</div>
                                <div>{selectedUserDetails.phone}</div>
                              </div>
                            </div>
                            {selectedUserDetails.address && (
                              <div className="d-flex align-items-center">
                                <FaMapMarkerAlt className="me-3 text-muted" />
                                <div>
                                  <div className="small text-muted">Address</div>
                                  <div>{selectedUserDetails.address}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <h6>Recent Orders</h6>
                        {selectedUserDetails.orderHistory && selectedUserDetails.orderHistory.length > 0 ? (
                          <div className="table-responsive">
                            <table className="table table-sm">
                              <thead>
                                <tr>
                                  <th>Order ID</th>
                                  <th>Date</th>
                                  <th>Amount</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedUserDetails.orderHistory.map(order => (
                                  <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.date}</td>
                                    <td>${order.amount.toFixed(2)}</td>
                                    <td>{getOrderStatusBadge(order.status)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <FaClipboardList size={48} className="text-muted mb-3" />
                            <p className="text-muted">No orders found</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowUserDetails(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    // Handle edit user
                    toast.info('Edit user functionality');
                  }}
                >
                  <FaEdit className="me-2" />
                  Edit User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;