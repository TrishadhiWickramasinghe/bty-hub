import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaBox,
  FaTags,
  FaDollarSign,
  FaChartLine,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUpload,
  FaDownload,
  FaToggleOn,
  FaToggleOff,
  FaStar,
  FaCopy,
  FaEllipsisV,
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
  FaSync,
  FaBarcode
} from 'react-icons/fa';
import productService from '../../services/productService';

const AdminProducts = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  
  // Filters state
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    stock: 'all',
    minPrice: '',
    maxPrice: '',
    minStock: '',
    maxStock: ''
  });

  // Categories
  const [categories, setCategories] = useState([
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Sports & Outdoors',
    'Books',
    'Health & Beauty',
    'Toys & Games',
    'Automotive',
    'Groceries',
    'Office Supplies'
  ]);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    outOfStock: 0,
    lowStock: 0,
    totalValue: 0
  });

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 12,
    totalPages: 1
  });

  // Bulk actions
  const [bulkAction, setBulkAction] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter and sort products when dependencies change
  useEffect(() => {
    applyFiltersAndSort();
  }, [products, filters, searchTerm, sortConfig]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
      updateStats(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch products');
      setLoading(false);
    }
  };

  const updateStats = (productsList) => {
    const statsObj = {
      total: productsList.length,
      active: productsList.filter(p => p.isActive).length,
      outOfStock: productsList.filter(p => p.stock === 0).length,
      lowStock: productsList.filter(p => p.stock > 0 && p.stock <= 10).length,
      totalValue: productsList.reduce((sum, product) => sum + (product.price * product.stock), 0)
    };
    setStats(statsObj);
  };

  const applyFiltersAndSort = () => {
    let result = [...products];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.sku?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (filters.category !== 'all') {
      result = result.filter(product => product.category === filters.category);
    }

    // Apply status filter
    if (filters.status !== 'all') {
      if (filters.status === 'active') {
        result = result.filter(product => product.isActive);
      } else if (filters.status === 'inactive') {
        result = result.filter(product => !product.isActive);
      } else if (filters.status === 'featured') {
        result = result.filter(product => product.isFeatured);
      }
    }

    // Apply stock filter
    if (filters.stock !== 'all') {
      if (filters.stock === 'in_stock') {
        result = result.filter(product => product.stock > 0);
      } else if (filters.stock === 'out_of_stock') {
        result = result.filter(product => product.stock === 0);
      } else if (filters.stock === 'low_stock') {
        result = result.filter(product => product.stock > 0 && product.stock <= 10);
      }
    }

    // Apply price filters
    if (filters.minPrice) {
      result = result.filter(product => product.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(product => product.price <= parseFloat(filters.maxPrice));
    }

    // Apply stock quantity filters
    if (filters.minStock) {
      result = result.filter(product => product.stock >= parseInt(filters.minStock));
    }
    if (filters.maxStock) {
      result = result.filter(product => product.stock <= parseInt(filters.maxStock));
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortConfig.key === 'name') {
        return sortConfig.direction === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortConfig.key === 'price') {
        return sortConfig.direction === 'asc' ? a.price - b.price : b.price - a.price;
      }
      if (sortConfig.key === 'stock') {
        return sortConfig.direction === 'asc' ? a.stock - b.stock : b.stock - a.stock;
      }
      if (sortConfig.key === 'createdAt') {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
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

    setFilteredProducts(paginatedResult);
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
      category: 'all',
      status: 'all',
      stock: 'all',
      minPrice: '',
      maxPrice: '',
      minStock: '',
      maxStock: ''
    });
    setSearchTerm('');
    setSelectedProducts([]);
    toast.info('All filters reset');
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product.id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedProducts.length === 0) {
      toast.warning('Please select products first');
      return;
    }

    switch (action) {
      case 'delete':
        setShowDeleteConfirm(true);
        break;
      case 'activate':
        await updateProductsStatus(selectedProducts, true);
        break;
      case 'deactivate':
        await updateProductsStatus(selectedProducts, false);
        break;
      case 'toggle_featured':
        await toggleProductsFeatured(selectedProducts);
        break;
      case 'duplicate':
        await duplicateProducts(selectedProducts);
        break;
      case 'export':
        exportSelectedProducts();
        break;
    }
    setBulkAction('');
  };

  const updateProductsStatus = async (productIds, isActive) => {
    try {
      // In production, call API
      setProducts(prev =>
        prev.map(product =>
          productIds.includes(product.id) ? { ...product, isActive } : product
        )
      );
      toast.success(`${productIds.length} product(s) ${isActive ? 'activated' : 'deactivated'}`);
      setSelectedProducts([]);
    } catch (error) {
      toast.error('Failed to update products');
    }
  };

  const toggleProductsFeatured = async (productIds) => {
    try {
      setProducts(prev =>
        prev.map(product =>
          productIds.includes(product.id) ? { ...product, isFeatured: !product.isFeatured } : product
        )
      );
      toast.success(`${productIds.length} product(s) featured status updated`);
      setSelectedProducts([]);
    } catch (error) {
      toast.error('Failed to update featured status');
    }
  };

  const duplicateProducts = async (productIds) => {
    try {
      const productsToDuplicate = products.filter(p => productIds.includes(p.id));
      const duplicatedProducts = productsToDuplicate.map(product => ({
        ...product,
        id: Date.now() + Math.random(),
        name: `${product.name} (Copy)`,
        sku: `${product.sku}-COPY`,
        createdAt: new Date().toISOString()
      }));
      
      setProducts(prev => [...prev, ...duplicatedProducts]);
      toast.success(`${productIds.length} product(s) duplicated`);
      setSelectedProducts([]);
    } catch (error) {
      toast.error('Failed to duplicate products');
    }
  };

  const deleteProducts = async () => {
    try {
      setProducts(prev => prev.filter(product => !selectedProducts.includes(product.id)));
      setSelectedProducts([]);
      setShowDeleteConfirm(false);
      toast.success(`${selectedProducts.length} product(s) deleted`);
    } catch (error) {
      toast.error('Failed to delete products');
    }
  };

  const exportSelectedProducts = () => {
    const productsToExport = selectedProducts.length > 0
      ? products.filter(product => selectedProducts.includes(product.id))
      : filteredProducts;
    
    // In production, generate and download CSV/Excel
    toast.success(`Exported ${productsToExport.length} products`);
  };

  const handleQuickEdit = (productId, field, value) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId ? { ...product, [field]: value } : product
      )
    );
  };

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return (
        <span className="badge bg-danger">
          <FaTimes className="me-1" /> Out of Stock
        </span>
      );
    } else if (stock <= 10) {
      return (
        <span className="badge bg-warning">
          <FaExclamationTriangle className="me-1" /> Low Stock ({stock})
        </span>
      );
    } else {
      return (
        <span className="badge bg-success">
          <FaCheck className="me-1" /> In Stock ({stock})
        </span>
      );
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="badge bg-success">Active</span>
    ) : (
      <span className="badge bg-secondary">Inactive</span>
    );
  };

  const getFeaturedBadge = (isFeatured) => {
    return isFeatured ? (
      <span className="badge bg-primary">
        <FaStar className="me-1" /> Featured
      </span>
    ) : null;
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
          <p className="mt-3">Loading products...</p>
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
              <h1 className="h2 mb-1">Product Management</h1>
              <p className="text-muted mb-0">
                Manage your product catalog and inventory
              </p>
            </div>
            
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
              
              <Link
                to="/admin/products/add"
                className="btn btn-primary"
              >
                <FaPlus className="me-2" />
                Add New Product
              </Link>
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
                  <FaBox size={20} />
                </div>
                <div>
                  <div className="h4 mb-0">{stats.total}</div>
                  <small className="text-muted">Total Products</small>
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
                  <FaCheck size={20} />
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
          <div className="card border-0 bg-warning bg-opacity-10">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-warning text-white rounded-circle p-3 me-3">
                  <FaExclamationTriangle size={20} />
                </div>
                <div>
                  <div className="h4 mb-0">{stats.lowStock}</div>
                  <small className="text-muted">Low Stock</small>
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
                  <FaTimes size={20} />
                </div>
                <div>
                  <div className="h4 mb-0">{stats.outOfStock}</div>
                  <small className="text-muted">Out of Stock</small>
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
                  <FaDollarSign size={20} />
                </div>
                <div>
                  <div className="h4 mb-0">${stats.totalValue.toLocaleString()}</div>
                  <small className="text-muted">Inventory Value</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-2 col-sm-4 col-6 mb-3">
          <div className="card border-0 bg-secondary bg-opacity-10">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-secondary text-white rounded-circle p-3 me-3">
                  <FaChartLine size={20} />
                </div>
                <div>
                  <div className="h4 mb-0">-</div>
                  <small className="text-muted">Avg. Rating</small>
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
                      placeholder="Search by name, description, SKU or category..."
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
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                    <option value="featured">Featured Only</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Stock Status</label>
                  <select
                    className="form-select"
                    value={filters.stock}
                    onChange={(e) => handleFilterChange('stock', e.target.value)}
                  >
                    <option value="all">All Stock</option>
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="low_stock">Low Stock (&lt;10)</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Sort By</label>
                  <select
                    className="form-select"
                    value={`${sortConfig.key}-${sortConfig.direction}`}
                    onChange={(e) => {
                      const [key, direction] = e.target.value.split('-');
                      setSortConfig({ key, direction });
                    }}
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="stock-desc">Stock: High to Low</option>
                    <option value="stock-asc">Stock: Low to High</option>
                  </select>
                </div>

                {/* Advanced Filters */}
                <div className="col-md-6">
                  <label className="form-label">Price Range</label>
                  <div className="row g-2">
                    <div className="col">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Min Price"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      />
                    </div>
                    <div className="col">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Max Price"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Stock Quantity</label>
                  <div className="row g-2">
                    <div className="col">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Min Stock"
                        value={filters.minStock}
                        onChange={(e) => handleFilterChange('minStock', e.target.value)}
                      />
                    </div>
                    <div className="col">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Max Stock"
                        value={filters.maxStock}
                        onChange={(e) => handleFilterChange('maxStock', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="card border-primary">
              <div className="card-body py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{selectedProducts.length} product(s) selected</strong>
                  </div>
                  <div className="d-flex gap-2">
                    <select
                      className="form-select form-select-sm"
                      style={{ width: '200px' }}
                      value={bulkAction}
                      onChange={(e) => {
                        setBulkAction(e.target.value);
                        if (e.target.value) {
                          handleBulkAction(e.target.value);
                        }
                      }}
                    >
                      <option value="">Bulk Actions</option>
                      <option value="activate">Activate</option>
                      <option value="deactivate">Deactivate</option>
                      <option value="toggle_featured">Toggle Featured</option>
                      <option value="duplicate">Duplicate</option>
                      <option value="export">Export Selected</option>
                      <option value="delete" className="text-danger">Delete Selected</option>
                    </select>
                    
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setSelectedProducts([])}
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <h5 className="mb-0 me-3">
                  Products ({filteredProducts.length} of {products.length})
                </h5>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={handleSelectAll}
                  />
                  <label className="form-check-label small">Select All</label>
                </div>
              </div>
              
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={fetchProducts}
                >
                  <FaSync />
                </button>
                
                <div className="dropdown">
                  <button
                    className="btn btn-sm btn-outline-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <FaDownload className="me-1" /> Export
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button className="dropdown-item" onClick={() => exportSelectedProducts()}>
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
              {filteredProducts.length === 0 ? (
                <div className="text-center py-5">
                  <div className="text-muted">
                    <FaSearch size={48} className="mb-3" />
                    <h5>No products found</h5>
                    <p>Try adjusting your filters or search term</p>
                    <Link to="/admin/products/add" className="btn btn-primary mt-2">
                      <FaPlus className="me-2" /> Add New Product
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3 p-3">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="col">
                      <div className={`card h-100 ${selectedProducts.includes(product.id) ? 'border-primary' : ''}`}>
                        <div className="card-body">
                          {/* Product Header */}
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedProducts.includes(product.id)}
                                onChange={() => handleSelectProduct(product.id)}
                              />
                            </div>
                            
                            <div className="dropdown">
                              <button
                                className="btn btn-sm btn-link text-dark"
                                type="button"
                                data-bs-toggle="dropdown"
                              >
                                <FaEllipsisV />
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`/admin/products/edit/${product.id}`}
                                  >
                                    <FaEdit className="me-2" />
                                    Edit Product
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`/product/${product.id}`}
                                    target="_blank"
                                  >
                                    <FaEye className="me-2" />
                                    View on Store
                                  </Link>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => handleQuickEdit(product.id, 'isActive', !product.isActive)}
                                  >
                                    {product.isActive ? (
                                      <>
                                        <FaToggleOff className="me-2" />
                                        Deactivate
                                      </>
                                    ) : (
                                      <>
                                        <FaToggleOn className="me-2" />
                                        Activate
                                      </>
                                    )}
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => handleQuickEdit(product.id, 'isFeatured', !product.isFeatured)}
                                  >
                                    {product.isFeatured ? (
                                      <>
                                        <FaStar className="me-2" />
                                        Remove Featured
                                      </>
                                    ) : (
                                      <>
                                        <FaStar className="me-2" />
                                        Mark as Featured
                                      </>
                                    )}
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => duplicateProducts([product.id])}
                                  >
                                    <FaCopy className="me-2" />
                                    Duplicate
                                  </button>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={() => {
                                      setSelectedProducts([product.id]);
                                      setShowDeleteConfirm(true);
                                    }}
                                  >
                                    <FaTrash className="me-2" />
                                    Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>

                          {/* Product Image */}
                          <div className="text-center mb-3">
                            <div className="position-relative" style={{ height: '120px' }}>
                              <img
                                src={product.image || 'https://via.placeholder.com/200'}
                                alt={product.name}
                                className="img-fluid rounded"
                                style={{ maxHeight: '120px', objectFit: 'contain' }}
                              />
                              {getFeaturedBadge(product.isFeatured)}
                            </div>
                          </div>

                          {/* Product Info */}
                          <div>
                            <h6 className="card-title mb-1" title={product.name}>
                              {product.name.length > 50 ? `${product.name.substring(0, 50)}...` : product.name}
                            </h6>
                            
                            <div className="d-flex align-items-center mb-2">
                              <span className="badge bg-secondary me-2">
                                {product.category || 'Uncategorized'}
                              </span>
                              {getStatusBadge(product.isActive)}
                            </div>

                            <div className="mb-2">
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="h5 text-primary mb-0">
                                  ${product.price.toFixed(2)}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-muted text-decoration-line-through">
                                    ${product.originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Quick Stock Update */}
                            <div className="mb-3">
                              <div className="d-flex justify-content-between align-items-center">
                                {getStockBadge(product.stock)}
                                <div className="input-group input-group-sm" style={{ width: '100px' }}>
                                  <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    value={product.stock}
                                    onChange={(e) => handleQuickEdit(product.id, 'stock', parseInt(e.target.value) || 0)}
                                    min="0"
                                  />
                                  <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => handleQuickEdit(product.id, 'stock', product.stock + 1)}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Quick Price Update */}
                            <div className="mb-3">
                              <label className="form-label small mb-1">Quick Price Update</label>
                              <div className="input-group input-group-sm">
                                <span className="input-group-text">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="form-control"
                                  value={product.price}
                                  onChange={(e) => handleQuickEdit(product.id, 'price', parseFloat(e.target.value) || 0)}
                                />
                              </div>
                            </div>

                            {/* Additional Info */}
                            <div className="small text-muted">
                              <div className="d-flex justify-content-between mb-1">
                                <span>SKU:</span>
                                <span>{product.sku || 'N/A'}</span>
                              </div>
                              <div className="d-flex justify-content-between mb-1">
                                <span>Created:</span>
                                <span>
                                  {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                              {product.rating && (
                                <div className="d-flex justify-content-between">
                                  <span>Rating:</span>
                                  <span>
                                    <FaStar className="text-warning" size={12} />
                                    {product.rating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="card-footer d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">
                    Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                    {Math.min(pagination.currentPage * pagination.itemsPerPage, products.length)} of{' '}
                    {products.length} products
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

      {/* Categories Overview */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Categories Overview</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {categories.map(category => {
                  const categoryProducts = products.filter(p => p.category === category);
                  const categoryValue = categoryProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
                  
                  return (
                    <div key={category} className="col-md-3 col-sm-4 col-6 mb-3">
                      <div className="card border-0 bg-light">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1">{category}</h6>
                              <div className="small text-muted">
                                {categoryProducts.length} products
                              </div>
                            </div>
                            <div className="text-end">
                              <div className="h6 mb-0">${categoryValue.toLocaleString()}</div>
                              <small className="text-muted">Value</small>
                            </div>
                          </div>
                          <div className="progress mt-2" style={{ height: '5px' }}>
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ 
                                width: `${(categoryProducts.length / products.length) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
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
                  onClick={() => setShowDeleteConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-danger">
                  <FaExclamationTriangle className="me-2" />
                  This action cannot be undone!
                </div>
                <p>
                  Are you sure you want to delete {selectedProducts.length} selected product(s)?
                </p>
                <ul className="list-group">
                  {products
                    .filter(p => selectedProducts.includes(p.id))
                    .slice(0, 5)
                    .map(product => (
                      <li key={product.id} className="list-group-item">
                        {product.name}
                      </li>
                    ))}
                  {selectedProducts.length > 5 && (
                    <li className="list-group-item text-muted">
                      ...and {selectedProducts.length - 5} more
                    </li>
                  )}
                </ul>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={deleteProducts}
                >
                  Delete {selectedProducts.length} Product(s)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;