import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoutes';
import AdminSidebar from '../components/admin/Sidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/Products';
import AddProduct from '../pages/admin/AddProduct';
import AdminOrders from '../pages/admin/Orders';
import AdminUsers from '../pages/admin/Users';
import Reports from '../pages/admin/Reports';

const AdminRoutes = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="d-flex">
      <AdminSidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className="flex-grow-1" style={{ 
        marginLeft: sidebarCollapsed ? '70px' : '250px',
        transition: 'margin-left 0.3s ease'
      }}>
        <AdminHeader toggleSidebar={toggleSidebar} />
        <div className="admin-content p-3">
          <Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="reports" element={<Reports />} />
            <Route path="/" element={<Navigate to="dashboard" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminRoutes;