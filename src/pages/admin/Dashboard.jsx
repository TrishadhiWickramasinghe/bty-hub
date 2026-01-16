import React from 'react';
import { 
  FaShoppingCart, 
  FaUsers, 
  FaDollarSign, 
  FaChartLine,
  FaBox,
  FaStar
} from 'react-icons/fa';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const stats = [
    { 
      title: 'Total Revenue', 
      value: '$24,580', 
      change: '+12.5%', 
      icon: <FaDollarSign size={24} />,
      color: 'bg-success'
    },
    { 
      title: 'Total Orders', 
      value: '1,248', 
      change: '+8.2%', 
      icon: <FaShoppingCart size={24} />,
      color: 'bg-primary'
    },
    { 
      title: 'Total Customers', 
      value: '8,542', 
      change: '+5.7%', 
      icon: <FaUsers size={24} />,
      color: 'bg-info'
    },
    { 
      title: 'Total Products', 
      value: '456', 
      change: '+3.1%', 
      icon: <FaBox size={24} />,
      color: 'bg-warning'
    }
  ];

  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Sales ($)',
        data: [6500, 8900, 12000, 10500, 14500, 18000, 22000],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      },
    ],
  };

  const ordersData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Orders',
        data: [45, 78, 65, 90, 120, 85, 60],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const recentOrders = [
    { id: '#ORD001', customer: 'John Doe', amount: '$249.99', status: 'Delivered', date: '2024-01-15' },
    { id: '#ORD002', customer: 'Jane Smith', amount: '$149.99', status: 'Processing', date: '2024-01-15' },
    { id: '#ORD003', customer: 'Bob Johnson', amount: '$349.99', status: 'Shipped', date: '2024-01-14' },
    { id: '#ORD004', customer: 'Alice Brown', amount: '$89.99', status: 'Pending', date: '2024-01-14' },
    { id: '#ORD005', customer: 'Charlie Wilson', amount: '$199.99', status: 'Delivered', date: '2024-01-13' },
  ];

  const topProducts = [
    { name: 'Wireless Earbuds', sales: 245, revenue: '$12,250' },
    { name: 'Smart Watch', sales: 189, revenue: '$9,450' },
    { name: 'Laptop Stand', sales: 156, revenue: '$3,120' },
    { name: 'USB-C Hub', sales: 142, revenue: '$2,840' },
    { name: 'Phone Case', sales: 128, revenue: '$1,280' },
  ];

  return (
    <div className="container-fluid p-3">
      <h1 className="h2 mb-4">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="row mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-md-3 mb-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">{stat.title}</h6>
                    <h3 className="mb-0">{stat.value}</h3>
                    <small className={`text-${stat.change.includes('+') ? 'success' : 'danger'}`}>
                      {stat.change} from last month
                    </small>
                  </div>
                  <div className={`${stat.color} text-white rounded-circle p-3`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row mb-4">
        <div className="col-md-8 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Sales Overview</h5>
              <Bar data={salesData} />
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Orders This Week</h5>
              <Line data={ordersData} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="row">
        <div className="col-md-8 mb-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Recent Orders</h5>
                <a href="/admin/orders" className="btn btn-sm btn-outline-primary">
                  View All
                </a>
              </div>
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
                    {recentOrders.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{order.amount}</td>
                        <td>
                          <span className={`badge ${
                            order.status === 'Delivered' ? 'bg-success' :
                            order.status === 'Processing' ? 'bg-warning' :
                            order.status === 'Shipped' ? 'bg-info' : 'bg-secondary'
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

        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Top Products</h5>
                <a href="/admin/products" className="btn btn-sm btn-outline-primary">
                  View All
                </a>
              </div>
              {topProducts.map((product, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <div>
                    <h6 className="mb-1">{product.name}</h6>
                    <small className="text-muted">{product.sales} units sold</small>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold">{product.revenue}</div>
                    <div className="d-flex align-items-center">
                      <FaStar className="text-warning me-1" size={12} />
                      <small>4.5</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;