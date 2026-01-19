import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaEye,
  FaEdit,
  FaTrash,
  FaPrint,
  FaEnvelope,
  FaCheck,
  FaTimes,
  FaClock,
  FaShippingFast,
  FaBoxOpen,
  FaUndo,
  FaCalendarAlt,
  FaUser,
  FaDollarSign,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFileExport,
  FaSync,
  FaEllipsisV
} from 'react-icons/fa';
import orderService from '../../services/orderService';

const AdminOrders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  
  // Filters state
  const [filters, setFilters] = useState({
    status: 'all',
    payment: 'all',
    customer: '',
    minAmount: '',
    maxAmount: ''
  });
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0
  });

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1
  });

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter and sort orders when dependencies change
  useEffect(() => {
    applyFiltersAndSort();
  }, [orders, filters, searchTerm, dateRange, sortConfig]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // In production, fetch from API
      const mockOrders = generateMockOrders();
      setOrders(mockOrders);
      updateStats(mockOrders);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch orders');
      setLoading(false);
    }
  };

  const generateMockOrders = () => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const paymentMethods = ['credit_card', 'paypal', 'stripe', 'cod', 'bank_transfer'];
    const customers = ['John Smith', 'Emma Johnson', 'Michael Brown', 'Sarah Davis', 'Robert Wilson', 'Lisa Anderson'];
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: `ORD-${String(i + 1).padStart(6, '0')}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      email: `customer${i + 1}@example.com`,
      phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      amount: parseFloat((Math.random() * 1000 + 50).toFixed(2)),
      items: Math.floor(Math.random() * 10) + 1,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      shippingAddress: `${Math.floor(Math.random() * 9999) + 1} Main St, City, State ${Math.floor(Math.random() * 90000) + 10000}`,
      notes: i % 5 === 0 ? 'Special instructions provided' : '',
      trackingNumber: i % 3 === 0 ? `TRACK${Math.floor(Math.random() * 1000000)}` : null
    }));
  };

  const updateStats = (ordersList) => {
    const statsObj = {
      total: ordersList.length,
      pending: ordersList.filter(o => o.status === 'pending').length,
      processing: ordersList.filter(o => o.status === 'processing').length,
      shipped: ordersList.filter(o => o.status === 'shipped').length,
      delivered: ordersList.filter(o => o.status === 'delivered').length,
      cancelled: ordersList.filter(o => o.status === 'cancelled').length,
      totalRevenue: ordersList.reduce((sum, order) => sum + order.amount, 0)
    };
    setStats(statsObj);
  };

  const applyFiltersAndSort = () => {
    let result = [...orders];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order =>
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term) ||
        order.email.toLowerCase().includes(term) ||
        order.shippingAddress.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(order => order.status === filters.status);
    }

    // Apply payment filter
    if (filters.payment !== 'all') {
      result = result.filter(order => order.paymentMethod === filters.payment);
    }

    // Apply date filter
    if (startDate && endDate) {
      result = result.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    // Apply amount filters
    if (filters.minAmount) {
      result = result.filter(order => order.amount >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      result = result.filter(order => order.amount <= parseFloat(filters.maxAmount));
    }

    // Apply customer filter
    if (filters.customer) {
      result = result.filter(order =>
        order.customer.toLowerCase().includes(filters.customer.toLowerCase())
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortConfig.key === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      if (sortConfig.key === 'customer') {
        return sortConfig.direction === 'asc'
          ? a.customer.localeCompare(b.customer)
          : b.customer.localeCompare(a.customer);
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

    setFilteredOrders(paginatedResult);
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
      payment: 'all',
      customer: '',
      minAmount: '',
      maxAmount: ''
    });
    setDateRange([null, null]);
    setSearchTerm('');
    setSelectedOrders([]);
    toast.info('All filters reset');
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedOrders.length === 0) {
      toast.warning('Please select orders first');
      return;
    }

    switch (action) {
      case 'delete':
        if (window.confirm(`Delete ${selectedOrders.length} selected order(s)?`)) {
          setOrders(prev => prev.filter(order => !selectedOrders.includes(order.id)));
          setSelectedOrders([]);
          toast.success('Orders deleted successfully');
        }
        break;
      case 'export':
        exportSelectedOrders();
        break;
      case 'print':
        printSelectedOrders();
        break;
      case 'status':
        updateOrderStatus();
        break;
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // In production, call API
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      toast.success(`Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const exportSelectedOrders = () => {
    const ordersToExport = selectedOrders.length > 0
      ? orders.filter(order => selectedOrders.includes(order.id))
      : filteredOrders;
    
    // In production, generate and download CSV/Excel
    toast.success(`Exported ${ordersToExport.length} orders`);
  };

  const printSelectedOrders = () => {
    // In production, generate print view
    toast.info('Print functionality coming soon');
  };

  const sendOrderEmail = (orderId, emailType) => {
    toast.success(`${emailType} email sent for order ${orderId}`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'warning', icon: <FaClock />, text: 'Pending' },
      processing: { color: 'info', icon: <FaBoxOpen />, text: 'Processing' },
      shipped: { color: 'primary', icon: <FaShippingFast />, text: 'Shipped' },
      delivered: { color: 'success', icon: <FaCheck />, text: 'Delivered' },
      cancelled: { color: 'danger', icon: <FaTimes />, text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`badge bg-${config.color} d-flex align-items-center gap-1`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const getPaymentMethodBadge = (method) => {
    const methodNames = {
      credit_card: 'Credit Card',
      paypal: 'PayPal',
      stripe: 'Stripe',
      cod: 'Cash on Delivery',
      bank_transfer: 'Bank Transfer'
    };
    
    const colors = {
      credit_card: 'primary',
      paypal: 'info',
      stripe: 'secondary',
      cod: 'warning',
      bank_transfer: 'dark'
    };
    
    return (
      <span className={`badge bg-${colors[method] || 'secondary'}`}>
        {methodNames[method] || method}
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
          <p className="mt-3">Loading orders...</p>
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
              <h1 className="h2 mb-1">Order Management</h1>
              <p className="text-muted mb-0">
                Manage and track customer orders
              </p>
            </div>
            
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={handleResetFilters}
              >
                <FaUndo className="me-2" />
                Reset Filters
              </button>
              
              <button
                className="btn btn-primary"
                onClick={() => toast.info('Add new order functionality')}
              >
                + Add Manual Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-light border-0">
            <div className="card-body py-3">
              <div className="row text-center">
                <div className="col-6 col-md-3 mb-3 mb-md-0">
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3">
                      <FaBoxOpen />
                    </div>
                    <div className="text-start">
                      <div className="h4 mb-0">{stats.total}</div>
                      <small className="text-muted">Total Orders</small>
                    </div>
                  </div>
                </div>
                
                <div className="col-6 col-md-3 mb-3 mb-md-0">
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="bg-success bg-opacity-10 text-success rounded-circle p-2 me-3">
                      <FaDollarSign />
                    </div>
                    <div className="text-start">
                      <div className="h4 mb-0">${stats.totalRevenue.toLocaleString()}</div>
                      <small className="text-muted">Total Revenue</small>
                    </div>
                  </div>
                </div>
                
                <div className="col-6 col-md-3">
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="bg-warning bg-opacity-10 text-warning rounded-circle p-2 me-3">
                      <FaClock />
                    </div>
                    <div className="text-start">
                      <div className="h4 mb-0">{stats.pending + stats.processing}</div>
                      <small className="text-muted">Pending/Processing</small>
                    </div>
                  </div>
                </div>
                
                <div className="col-6 col-md-3">
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="bg-danger bg-opacity-10 text-danger rounded-circle p-2 me-3">
                      <FaTimes />
                    </div>
                    <div className="text-start">
                      <div className="h4 mb-0">{stats.cancelled}</div>
                      <small className="text-muted">Cancelled Orders</small>
                    </div>
                  </div>
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
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaFilter className="me-2" />
                Filters & Search
              </h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => document.getElementById('advancedFilters').classList.toggle('d-none')}
              >
                Toggle Advanced Filters
              </button>
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
                      placeholder="Search by Order ID, Customer, Email, or Address..."
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
                <div className="col-md-4">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-select"
                    value={filters.payment}
                    onChange={(e) => handleFilterChange('payment', e.target.value)}
                  >
                    <option value="all">All Methods</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="stripe">Stripe</option>
                    <option value="cod">Cash on Delivery</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Date Range</label>
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => setDateRange(update)}
                    placeholderText="Select date range"
                    className="form-control"
                    dateFormat="MMM dd, yyyy"
                  />
                </div>

                {/* Advanced Filters (Collapsible) */}
                <div id="advancedFilters" className="d-none">
                  <div className="col-md-6">
                    <label className="form-label">Customer Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Filter by customer name"
                      value={filters.customer}
                      onChange={(e) => handleFilterChange('customer', e.target.value)}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Min Amount ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      value={filters.minAmount}
                      onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Max Amount ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="10000"
                      value={filters.maxAmount}
                      onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="card border-primary">
              <div className="card-body py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{selectedOrders.length} order(s) selected</strong>
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
                            onClick={() => handleBulkAction('status')}
                          >
                            Mark as Processing
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item">
                            Mark as Shipped
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item">
                            Mark as Delivered
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item text-danger">
                            Cancel Orders
                          </button>
                        </li>
                      </ul>
                    </div>
                    
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleBulkAction('export')}
                    >
                      <FaDownload className="me-1" /> Export
                    </button>
                    
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleBulkAction('print')}
                    >
                      <FaPrint className="me-1" /> Print
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

      {/* Orders Table */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                Orders ({filteredOrders.length} of {orders.length})
              </h5>
              
              <div className="d-flex align-items-center gap-2">
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
                      <button className="dropdown-item" onClick={() => exportSelectedOrders()}>
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
                
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={fetchOrders}
                >
                  <FaSync />
                </button>
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
                            checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                            onChange={handleSelectAll}
                          />
                        </div>
                      </th>
                      <th>
                        <button
                          className="btn btn-link text-decoration-none p-0"
                          onClick={() => handleSort('id')}
                        >
                          Order ID
                          {sortConfig.key === 'id' && (
                            sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                          )}
                        </button>
                      </th>
                      <th>
                        <button
                          className="btn btn-link text-decoration-none p-0"
                          onClick={() => handleSort('customer')}
                        >
                          Customer
                          {sortConfig.key === 'customer' && (
                            sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                          )}
                        </button>
                      </th>
                      <th>
                        <button
                          className="btn btn-link text-decoration-none p-0"
                          onClick={() => handleSort('date')}
                        >
                          Date
                          {sortConfig.key === 'date' && (
                            sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                          )}
                        </button>
                      </th>
                      <th>
                        <button
                          className="btn btn-link text-decoration-none p-0"
                          onClick={() => handleSort('amount')}
                        >
                          Amount
                          {sortConfig.key === 'amount' && (
                            sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                          )}
                        </button>
                      </th>
                      <th>Items</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center py-5">
                          <div className="text-muted">
                            <FaSearch size={48} className="mb-3" />
                            <h5>No orders found</h5>
                            <p>Try adjusting your filters or search term</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => (
                        <tr key={order.id} className={selectedOrders.includes(order.id) ? 'table-active' : ''}>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedOrders.includes(order.id)}
                                onChange={() => handleSelectOrder(order.id)}
                              />
                            </div>
                          </td>
                          <td>
                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="text-decoration-none fw-semibold"
                            >
                              {order.id}
                            </Link>
                            {order.trackingNumber && (
                              <div className="small text-muted">
                                Track: {order.trackingNumber}
                              </div>
                            )}
                          </td>
                          <td>
                            <div>
                              <div className="fw-semibold">{order.customer}</div>
                              <div className="small text-muted">{order.email}</div>
                              <div className="small text-muted">{order.phone}</div>
                            </div>
                          </td>
                          <td>
                            <div>{order.date}</div>
                            <div className="small text-muted">
                              <FaCalendarAlt className="me-1" />
                              {new Date(order.date).toLocaleDateString('en-US', {
                                weekday: 'short'
                              })}
                            </div>
                          </td>
                          <td>
                            <div className="fw-bold">${order.amount.toFixed(2)}</div>
                            <div className="small text-muted">{order.items} items</div>
                          </td>
                          <td>{getStatusBadge(order.status)}</td>
                          <td>{getPaymentMethodBadge(order.paymentMethod)}</td>
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
                                  <Link
                                    className="dropdown-item"
                                    to={`/admin/orders/${order.id}`}
                                  >
                                    <FaEye className="me-2" />
                                    View Details
                                  </Link>
                                </li>
                                <li>
                                  <button className="dropdown-item">
                                    <FaEdit className="me-2" />
                                    Edit Order
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => sendOrderEmail(order.id, 'invoice')}
                                  >
                                    <FaEnvelope className="me-2" />
                                    Send Invoice
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => sendOrderEmail(order.id, 'shipping')}
                                  >
                                    <FaShippingFast className="me-2" />
                                    Shipping Update
                                  </button>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                  <div className="dropdown-header">Update Status</div>
                                </li>
                                {order.status !== 'processing' && (
                                  <li>
                                    <button
                                      className="dropdown-item text-info"
                                      onClick={() => updateOrderStatus(order.id, 'processing')}
                                    >
                                      Mark as Processing
                                    </button>
                                  </li>
                                )}
                                {order.status !== 'shipped' && (
                                  <li>
                                    <button
                                      className="dropdown-item text-primary"
                                      onClick={() => updateOrderStatus(order.id, 'shipped')}
                                    >
                                      Mark as Shipped
                                    </button>
                                  </li>
                                )}
                                {order.status !== 'delivered' && (
                                  <li>
                                    <button
                                      className="dropdown-item text-success"
                                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                                    >
                                      Mark as Delivered
                                    </button>
                                  </li>
                                )}
                                {order.status !== 'cancelled' && (
                                  <li>
                                    <button
                                      className="dropdown-item text-danger"
                                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                    >
                                      Cancel Order
                                    </button>
                                  </li>
                                )}
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                  <button className="dropdown-item text-danger">
                                    <FaTrash className="me-2" />
                                    Delete Order
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
            {filteredOrders.length > 0 && (
              <div className="card-footer d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">
                    Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                    {Math.min(pagination.currentPage * pagination.itemsPerPage, orders.length)} of{' '}
                    {orders.length} orders
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

      {/* Quick Stats */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h6 className="mb-3">Order Status Distribution</h6>
              <div className="row">
                <div className="col-md-2 col-4 text-center mb-3">
                  <div className={`rounded-circle bg-warning bg-opacity-10 text-warning p-3 mb-2`}>
                    <FaClock size={20} />
                  </div>
                  <div className="h5 mb-1">{stats.pending}</div>
                  <small className="text-muted">Pending</small>
                </div>
                <div className="col-md-2 col-4 text-center mb-3">
                  <div className={`rounded-circle bg-info bg-opacity-10 text-info p-3 mb-2`}>
                    <FaBoxOpen size={20} />
                  </div>
                  <div className="h5 mb-1">{stats.processing}</div>
                  <small className="text-muted">Processing</small>
                </div>
                <div className="col-md-2 col-4 text-center mb-3">
                  <div className={`rounded-circle bg-primary bg-opacity-10 text-primary p-3 mb-2`}>
                    <FaShippingFast size={20} />
                  </div>
                  <div className="h5 mb-1">{stats.shipped}</div>
                  <small className="text-muted">Shipped</small>
                </div>
                <div className="col-md-2 col-4 text-center mb-3">
                  <div className={`rounded-circle bg-success bg-opacity-10 text-success p-3 mb-2`}>
                    <FaCheck size={20} />
                  </div>
                  <div className="h5 mb-1">{stats.delivered}</div>
                  <small className="text-muted">Delivered</small>
                </div>
                <div className="col-md-2 col-4 text-center mb-3">
                  <div className={`rounded-circle bg-danger bg-opacity-10 text-danger p-3 mb-2`}>
                    <FaTimes size={20} />
                  </div>
                  <div className="h5 mb-1">{stats.cancelled}</div>
                  <small className="text-muted">Cancelled</small>
                </div>
                <div className="col-md-2 col-4 text-center mb-3">
                  <div className={`rounded-circle bg-secondary bg-opacity-10 text-secondary p-3 mb-2`}>
                    <FaDollarSign size={20} />
                  </div>
                  <div className="h5 mb-1">${stats.totalRevenue.toLocaleString()}</div>
                  <small className="text-muted">Total Revenue</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;