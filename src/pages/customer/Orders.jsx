import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaEye, 
  FaDownload, 
  FaShoppingBag, 
  FaShippingFast, 
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFilter,
  FaSearch
} from 'react-icons/fa';
import orderService from '../../services/orderService';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // In production, use user.id to fetch user's orders
      const mockOrders = await generateMockOrders();
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockOrders = async () => {
    const statuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    const products = [
      { id: 1, name: 'Premium Laptop', price: 1299.99 },
      { id: 2, name: 'Wireless Mouse', price: 29.99 },
      { id: 3, name: 'Mechanical Keyboard', price: 89.99 },
      { id: 4, name: '4K Monitor', price: 399.99 },
      { id: 5, name: 'USB-C Hub', price: 49.99 }
    ];
    
    return Array.from({ length: 8 }, (_, i) => {
      const itemCount = Math.floor(Math.random() * 3) + 1;
      const items = Array.from({ length: itemCount }, (_, j) => {
        const product = products[Math.floor(Math.random() * products.length)];
        return {
          ...product,
          quantity: Math.floor(Math.random() * 2) + 1,
          image: `https://via.placeholder.com/100?text=Product+${product.id}`
        };
      });
      
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = subtotal > 50 ? 0 : 5.99;
      const tax = subtotal * 0.08;
      const total = subtotal + shipping + tax;
      const status = statuses[i % statuses.length];
      const orderDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
      
      return {
        id: `ORD-${String(i + 1).padStart(6, '0')}`,
        items,
        subtotal,
        shipping,
        tax,
        total,
        status,
        orderDate: orderDate.toISOString().split('T')[0],
        deliveryDate: status === 'delivered' 
          ? new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          : null,
        shippingAddress: '123 Main St, New York, NY 10001',
        paymentMethod: ['credit_card', 'paypal', 'cash_on_delivery'][i % 3],
        trackingNumber: status !== 'processing' ? `TRACK${Math.floor(Math.random() * 1000000)}` : null
      };
    });
  };

  const filterOrders = () => {
    if (selectedStatus === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === selectedStatus));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'processing':
        return (
          <span className="badge bg-warning">
            <FaClock className="me-1" /> Processing
          </span>
        );
      case 'shipped':
        return (
          <span className="badge bg-info">
            <FaShippingFast className="me-1" /> Shipped
          </span>
        );
      case 'delivered':
        return (
          <span className="badge bg-success">
            <FaCheckCircle className="me-1" /> Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="badge bg-danger">
            <FaTimesCircle className="me-1" /> Cancelled
          </span>
        );
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing': return <FaClock className="text-warning" />;
      case 'shipped': return <FaShippingFast className="text-info" />;
      case 'delivered': return <FaCheckCircle className="text-success" />;
      case 'cancelled': return <FaTimesCircle className="text-danger" />;
      default: return <FaShoppingBag className="text-secondary" />;
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'credit_card': return 'Credit Card';
      case 'paypal': return 'PayPal';
      case 'cash_on_delivery': return 'Cash on Delivery';
      default: return method;
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 mb-1">My Orders</h1>
              <p className="text-muted mb-0">
                Track and manage your orders
              </p>
            </div>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card border-0 bg-primary bg-opacity-10">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-primary text-white rounded-circle p-3 me-3">
                  <FaShoppingBag />
                </div>
                <div>
                  <div className="h4 mb-0">{orders.length}</div>
                  <small className="text-muted">Total Orders</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card border-0 bg-warning bg-opacity-10">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-warning text-white rounded-circle p-3 me-3">
                  <FaClock />
                </div>
                <div>
                  <div className="h4 mb-0">
                    {orders.filter(o => o.status === 'processing').length}
                  </div>
                  <small className="text-muted">Processing</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card border-0 bg-success bg-opacity-10">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-success text-white rounded-circle p-3 me-3">
                  <FaCheckCircle />
                </div>
                <div>
                  <div className="h4 mb-0">
                    {orders.filter(o => o.status === 'delivered').length}
                  </div>
                  <small className="text-muted">Delivered</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card border-0 bg-danger bg-opacity-10">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-danger text-white rounded-circle p-3 me-3">
                  <FaTimesCircle />
                </div>
                <div>
                  <div className="h4 mb-0">
                    {orders.filter(o => o.status === 'cancelled').length}
                  </div>
                  <small className="text-muted">Cancelled</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <label className="form-label">
                    <FaFilter className="me-2" />
                    Filter by Status
                  </label>
                  <select
                    className="form-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">All Orders</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    <FaSearch className="me-2" />
                    Search Orders
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by Order ID..."
                    />
                    <button className="btn btn-outline-secondary">
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-5">
          <div className="text-muted">
            <FaShoppingBag size={48} className="mb-3" />
            <h4>No orders found</h4>
            <p>
              {selectedStatus === 'all'
                ? "You haven't placed any orders yet."
                : `You don't have any ${selectedStatus} orders.`}
            </p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <div className="fw-semibold">{order.id}</div>
                        {order.trackingNumber && (
                          <small className="text-muted">
                            Track: {order.trackingNumber}
                          </small>
                        )}
                      </td>
                      <td>
                        <div>{order.orderDate}</div>
                        {order.deliveryDate && (
                          <small className="text-muted">
                            Delivered: {order.deliveryDate}
                          </small>
                        )}
                      </td>
                      <td>
                        <div className="d-flex">
                          {order.items.slice(0, 2).map((item, index) => (
                            <img
                              key={index}
                              src={item.image}
                              alt={item.name}
                              className="rounded me-1"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                              title={item.name}
                            />
                          ))}
                          {order.items.length > 2 && (
                            <div className="bg-light rounded d-flex align-items-center justify-content-center"
                              style={{ width: '40px', height: '40px' }}>
                              +{order.items.length - 2}
                            </div>
                          )}
                        </div>
                        <small className="text-muted">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </small>
                      </td>
                      <td>
                        <div className="fw-bold">${order.total.toFixed(2)}</div>
                        <small className="text-muted">
                          {getPaymentMethodText(order.paymentMethod)}
                        </small>
                      </td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-outline-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            Actions
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/orders/${order.id}`}
                              >
                                <FaEye className="me-2" />
                                View Details
                              </Link>
                            </li>
                            <li>
                              <button className="dropdown-item">
                                <FaDownload className="me-2" />
                                Download Invoice
                              </button>
                            </li>
                            {order.status === 'processing' && (
                              <li>
                                <button className="dropdown-item text-danger">
                                  Cancel Order
                                </button>
                              </li>
                            )}
                            {order.status === 'delivered' && (
                              <>
                                <li>
                                  <button className="dropdown-item">
                                    Return Item
                                  </button>
                                </li>
                                <li>
                                  <button className="dropdown-item">
                                    Write Review
                                  </button>
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Example */}
      {filteredOrders.length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <h3 className="h4 mb-3">Recent Orders</h3>
            {filteredOrders.slice(0, 3).map(order => (
              <div key={order.id} className="card mb-3">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-2 col-3">
                      <div className="text-center">
                        {getStatusIcon(order.status)}
                        <div className="mt-2">
                          <small className="text-muted">{order.id}</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 col-9">
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="text-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="rounded mb-1"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                            <div className="small">{item.quantity}x</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="small text-muted">Order Date</div>
                      <div>{order.orderDate}</div>
                      {order.deliveryDate && (
                        <>
                          <div className="small text-muted">Delivery Date</div>
                          <div>{order.deliveryDate}</div>
                        </>
                      )}
                    </div>
                    <div className="col-md-3 col-6 text-end">
                      <div className="h5 mb-2">${order.total.toFixed(2)}</div>
                      <div className="mb-2">{getStatusBadge(order.status)}</div>
                      <Link
                        to={`/orders/${order.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body">
              <h5 className="mb-3">Need Help with Your Orders?</h5>
              <div className="row">
                <div className="col-md-4 mb-3 mb-md-0">
                  <h6>Track Your Order</h6>
                  <p className="small text-muted">
                    Use the tracking number to check delivery status.
                  </p>
                </div>
                <div className="col-md-4 mb-3 mb-md-0">
                  <h6>Returns & Refunds</h6>
                  <p className="small text-muted">
                    30-day return policy. Contact support for returns.
                  </p>
                </div>
                <div className="col-md-4">
                  <h6>Contact Support</h6>
                  <p className="small text-muted">
                    Email: support@btyhub.com<br />
                    Phone: +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;