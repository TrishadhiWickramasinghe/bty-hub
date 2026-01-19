import React, { useState, useEffect } from 'react';
import { 
  FaChartBar, 
  FaChartLine, 
  FaChartPie, 
  FaDownload, 
  FaFilter,
  FaCalendar,
  FaDollarSign,
  FaShoppingCart,
  FaUsers,
  FaBox,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AdminReports = () => {
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState({});

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Mock data based on date range
      const mockData = generateMockReportData(dateRange);
      setReports(mockData);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockReportData = (range) => {
    const today = new Date();
    const data = {
      summary: {
        totalRevenue: 24580,
        totalOrders: 1248,
        totalCustomers: 854,
        totalProducts: 456,
        revenueChange: 12.5,
        ordersChange: 8.2,
        customersChange: 5.7,
        productsChange: 3.1
      },
      salesData: [],
      revenueData: [],
      categoryData: [],
      topProducts: [],
      recentOrders: []
    };

    // Generate sales data based on range
    let labels = [];
    if (range === 'week') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else if (range === 'month') {
      labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
    } else if (range === 'quarter') {
      labels = ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'];
    } else if (range === 'year') {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }

    // Sales Data
    data.salesData = labels.map(label => ({
      name: label,
      sales: Math.floor(Math.random() * 100) + 50,
      revenue: Math.floor(Math.random() * 5000) + 1000
    }));

    // Revenue Data
    data.revenueData = labels.map(label => ({
      name: label,
      revenue: Math.floor(Math.random() * 10000) + 5000,
      profit: Math.floor(Math.random() * 3000) + 1000
    }));

    // Category Data
    const categories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books'];
    data.categoryData = categories.map(category => ({
      name: category,
      value: Math.floor(Math.random() * 100) + 20,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    }));

    // Top Products
    data.topProducts = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      sales: Math.floor(Math.random() * 500) + 100,
      revenue: Math.floor(Math.random() * 10000) + 5000,
      rating: (Math.random() * 2 + 3).toFixed(1)
    }));

    // Recent Orders
    data.recentOrders = Array.from({ length: 5 }, (_, i) => ({
      id: `ORD-${1000 + i}`,
      customer: `Customer ${i + 1}`,
      amount: `$${(Math.random() * 1000 + 50).toFixed(2)}`,
      status: ['Completed', 'Processing', 'Shipped'][Math.floor(Math.random() * 3)],
      date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
    }));

    return data;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const exportReport = (format) => {
    alert(`Exporting report as ${format}...`);
    // Implement export functionality
  };

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
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
              <h1 className="h2 mb-1">Sales Reports</h1>
              <p className="text-muted mb-0">
                Analyze your store performance and sales data
              </p>
            </div>
            <div className="d-flex gap-2">
              <select
                className="form-select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                style={{ width: '150px' }}
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
              <button
                className="btn btn-primary"
                onClick={() => exportReport('PDF')}
              >
                <FaDownload className="me-2" /> Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-3">
          <div className="card border-0 bg-primary bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Revenue</h6>
                  <h3 className="mb-0">${reports.summary?.totalRevenue?.toLocaleString()}</h3>
                  <div className={`small ${reports.summary?.revenueChange >= 0 ? 'text-success' : 'text-danger'}`}>
                    {reports.summary?.revenueChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                    {Math.abs(reports.summary?.revenueChange || 0)}%
                  </div>
                </div>
                <div className="bg-primary text-white rounded-circle p-3">
                  <FaDollarSign size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-3">
          <div className="card border-0 bg-success bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Orders</h6>
                  <h3 className="mb-0">{reports.summary?.totalOrders?.toLocaleString()}</h3>
                  <div className={`small ${reports.summary?.ordersChange >= 0 ? 'text-success' : 'text-danger'}`}>
                    {reports.summary?.ordersChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                    {Math.abs(reports.summary?.ordersChange || 0)}%
                  </div>
                </div>
                <div className="bg-success text-white rounded-circle p-3">
                  <FaShoppingCart size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-3">
          <div className="card border-0 bg-info bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Customers</h6>
                  <h3 className="mb-0">{reports.summary?.totalCustomers?.toLocaleString()}</h3>
                  <div className={`small ${reports.summary?.customersChange >= 0 ? 'text-success' : 'text-danger'}`}>
                    {reports.summary?.customersChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                    {Math.abs(reports.summary?.customersChange || 0)}%
                  </div>
                </div>
                <div className="bg-info text-white rounded-circle p-3">
                  <FaUsers size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-3">
          <div className="card border-0 bg-warning bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Products</h6>
                  <h3 className="mb-0">{reports.summary?.totalProducts?.toLocaleString()}</h3>
                  <div className={`small ${reports.summary?.productsChange >= 0 ? 'text-success' : 'text-danger'}`}>
                    {reports.summary?.productsChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                    {Math.abs(reports.summary?.productsChange || 0)}%
                  </div>
                </div>
                <div className="bg-warning text-white rounded-circle p-3">
                  <FaBox size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="row mb-4">
        <div className="col-xl-8 mb-4">
          <div className="card h-100">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaChartLine className="me-2" />
                Sales & Revenue Trend
              </h5>
              <div className="btn-group btn-group-sm">
                <button className="btn btn-outline-secondary active">Revenue</button>
                <button className="btn btn-outline-secondary">Orders</button>
              </div>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reports.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#0088FE" name="Revenue" />
                  <Line type="monotone" dataKey="profit" stroke="#00C49F" name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="col-xl-4 mb-4">
          <div className="card h-100">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <FaChartPie className="me-2" />
                Sales by Category
              </h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reports.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {reports.categoryData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="row mb-4">
        <div className="col-xl-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <FaChartBar className="me-2" />
                Daily Sales Volume
              </h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reports.salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" name="Sales Count" />
                  <Bar dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="col-xl-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-light">
              <h5 className="mb-0">Top Performing Products</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Sales</th>
                      <th>Revenue</th>
                      <th>Rating</th>
                      <th>Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.topProducts?.map(product => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2"
                              style={{ width: '30px', height: '30px' }}>
                              {product.id}
                            </div>
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>{product.sales}</td>
                        <td>${product.revenue.toLocaleString()}</td>
                        <td>
                          <span className="badge bg-warning">
                            {product.rating} ★
                          </span>
                        </td>
                        <td>
                          <div className="progress" style={{ height: '8px' }}>
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{ width: `${(product.sales / 600) * 100}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Orders</h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => exportReport('CSV')}
              >
                <FaDownload className="me-1" /> Export Orders
              </button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.recentOrders?.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{order.amount}</td>
                        <td>
                          <span className={`badge ${
                            order.status === 'Completed' ? 'bg-success' :
                            order.status === 'Processing' ? 'bg-warning' :
                            'bg-info'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{order.date}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Export Reports</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => exportReport('PDF')}
                  >
                    <FaDownload className="me-2" />
                    PDF Report
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => exportReport('Excel')}
                  >
                    <FaDownload className="me-2" />
                    Excel Report
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => exportReport('CSV')}
                  >
                    <FaDownload className="me-2" />
                    CSV Data
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => alert('Print functionality coming soon')}
                  >
                    Print Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;