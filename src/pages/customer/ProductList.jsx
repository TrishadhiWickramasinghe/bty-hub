import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/customer/ProductCard';
import { FaFilter, FaSort, FaSearch } from 'react-icons/fa';
import productService from '../../services/productService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'featured',
    search: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const applyFilters = () => {
    let result = [...products];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }

    // Apply price filters
    if (filters.minPrice) {
      result = result.filter(product => product.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(product => product.price <= parseFloat(filters.maxPrice));
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default: // featured
        result.sort((a, b) => (b.isFeatured || false) - (a.isFeatured || false));
    }

    setFilteredProducts(result);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'featured',
      search: ''
    });
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
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="h2 mb-3">Our Products</h1>
          <p className="text-muted">
            Discover {filteredProducts.length} amazing products
          </p>
        </div>
      </div>

      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-lg-3 col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <FaFilter className="me-2" /> Filters
              </h5>
            </div>
            <div className="card-body">
              {/* Search */}
              <div className="mb-4">
                <label className="form-label">Search</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-4">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="form-label">Price Range</label>
                <div className="row g-2">
                  <div className="col">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                  </div>
                  <div className="col">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-4">
                <label className="form-label">Sort By</label>
                <select
                  className="form-select"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Reset Button */}
              <button
                className="btn btn-outline-secondary w-100"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="card shadow-sm mt-4">
            <div className="card-header bg-light">
              <h6 className="mb-0">Categories</h6>
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <a 
                    href="#" 
                    className="text-decoration-none d-flex justify-content-between"
                    onClick={(e) => {
                      e.preventDefault();
                      handleFilterChange('category', '');
                    }}
                  >
                    <span>All Products</span>
                    <span className="badge bg-primary">{products.length}</span>
                  </a>
                </li>
                {categories.map(category => {
                  const count = products.filter(p => p.category === category).length;
                  return (
                    <li key={category} className="list-group-item">
                      <a 
                        href="#" 
                        className="text-decoration-none d-flex justify-content-between"
                        onClick={(e) => {
                          e.preventDefault();
                          handleFilterChange('category', category);
                        }}
                      >
                        <span>{category}</span>
                        <span className="badge bg-secondary">{count}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="col-lg-9 col-md-8">
          {/* Products Count and Sort */}
          <div className="card shadow-sm mb-4">
            <div className="card-body py-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted">
                    Showing {filteredProducts.length} of {products.length} products
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <FaSort className="me-2" />
                  <select
                    className="form-select form-select-sm"
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    <option value="featured">Featured</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="name_desc">Name: Z to A</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <div className="text-muted">
                <FaSearch size={48} className="mb-3" />
                <h4>No products found</h4>
                <p>Try adjusting your filters or search term</p>
                <button
                  className="btn btn-primary"
                  onClick={resetFilters}
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="col">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination (optional) */}
          {filteredProducts.length > 0 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className="page-item disabled">
                  <span className="page-link">Previous</span>
                </li>
                <li className="page-item active">
                  <span className="page-link">1</span>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">2</a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">3</a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">Next</a>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;