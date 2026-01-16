import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

// Customer Pages
import Home from '../pages/customer/Home';
import ProductList from '../pages/customer/ProductList';
import ProductDetails from '../pages/customer/ProductDetails';
import Cart from '../pages/customer/Cart';
import Checkout from '../pages/customer/Checkout';
import Orders from '../pages/customer/Orders';
import Profile from '../pages/customer/Profile';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/Products';
import AddProduct from '../pages/admin/AddProduct';
import AdminOrders from '../pages/admin/Orders';
import AdminUsers from '../pages/admin/Users';
import Reports from '../pages/admin/Reports';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <Loader />;
  
  if (!user) return <Navigate to="/login" />;
  
  if (requireAdmin && !isAdmin) return <Navigate to="/" />;
  
  return children;
};

// Layout Components
const CustomerLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="min-vh-100">{children}</main>
    <Footer />
  </>
);

const AdminLayout = ({ children }) => (
  <div className="d-flex">
    {/* Admin sidebar would go here */}
    <Navbar />
    <main className="flex-grow-1 p-3">{children}</main>
  </div>
);

const AuthLayout = ({ children }) => (
  <div className="auth-layout">{children}</div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={
        <AuthLayout>
          <Login />
        </AuthLayout>
      } />
      
      <Route path="/register" element={
        <AuthLayout>
          <Register />
        </AuthLayout>
      } />

      {/* Customer Routes */}
      <Route path="/" element={
        <CustomerLayout>
          <Home />
        </CustomerLayout>
      } />
      
      <Route path="/products" element={
        <CustomerLayout>
          <ProductList />
        </CustomerLayout>
      } />
      
      <Route path="/product/:id" element={
        <CustomerLayout>
          <ProductDetails />
        </CustomerLayout>
      } />
      
      <Route path="/cart" element={
        <ProtectedRoute>
          <CustomerLayout>
            <Cart />
          </CustomerLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/checkout" element={
        <ProtectedRoute>
          <CustomerLayout>
            <Checkout />
          </CustomerLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/orders" element={
        <ProtectedRoute>
          <CustomerLayout>
            <Orders />
          </CustomerLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <CustomerLayout>
            <Profile />
          </CustomerLayout>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/products" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout>
            <AdminProducts />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/products/add" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout>
            <AddProduct />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/orders" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout>
            <AdminOrders />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/users" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout>
            <AdminUsers />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/reports" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout>
            <Reports />
          </AdminLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;