import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaUpload, 
  FaImages, 
  FaTags, 
  FaDollarSign, 
  FaBox, 
  FaInfoCircle,
  FaPlus,
  FaTrash,
  FaTimes,
  FaArrowLeft,
  FaSave
} from 'react-icons/fa';
import productService from '../../services/productService';

// Validation Schema
const productValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Product name must be at least 3 characters')
    .max(100, 'Product name must be less than 100 characters')
    .required('Product name is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .required('Description is required'),
  price: Yup.number()
    .min(0.01, 'Price must be greater than 0')
    .max(1000000, 'Price cannot exceed $1,000,000')
    .required('Price is required'),
  originalPrice: Yup.number()
    .min(0.01, 'Original price must be greater than 0')
    .max(1000000, 'Original price cannot exceed $1,000,000')
    .test('less-than-price', 'Original price must be greater than sale price', 
      function(value) {
        if (!value) return true;
        return value > this.parent.price;
      }),
  category: Yup.string().required('Category is required'),
  stock: Yup.number()
    .min(0, 'Stock cannot be negative')
    .max(100000, 'Stock cannot exceed 100,000')
    .required('Stock is required'),
  sku: Yup.string()
    .min(3, 'SKU must be at least 3 characters')
    .max(50, 'SKU must be less than 50 characters')
    .required('SKU is required'),
  brand: Yup.string()
    .min(2, 'Brand must be at least 2 characters')
    .max(50, 'Brand must be less than 50 characters'),
  weight: Yup.number().min(0, 'Weight cannot be negative'),
  dimensions: Yup.object({
    length: Yup.number().min(0, 'Length cannot be negative'),
    width: Yup.number().min(0, 'Width cannot be negative'),
    height: Yup.number().min(0, 'Height cannot be negative')
  })
});

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [features, setFeatures] = useState(['High Quality', 'Durable']);
  const [newFeature, setNewFeature] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [variations, setVariations] = useState([
    { id: 1, type: 'Color', options: ['Red', 'Blue', 'Green'] },
    { id: 2, type: 'Size', options: ['S', 'M', 'L', 'XL'] }
  ]);

  // Product categories
  const categories = [
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
  ];

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      stock: '',
      sku: '',
      brand: '',
      weight: '',
      dimensions: {
        length: '',
        width: '',
        height: ''
      },
      isFeatured: false,
      isActive: true,
      tags: '',
      warranty: '1 year',
      shippingInfo: 'Free shipping on orders over $50'
    },
    validationSchema: productValidationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        
        // Prepare product data
        const productData = {
          ...values,
          price: parseFloat(values.price),
          originalPrice: values.originalPrice ? parseFloat(values.originalPrice) : null,
          stock: parseInt(values.stock),
          weight: values.weight ? parseFloat(values.weight) : null,
          dimensions: {
            length: values.dimensions.length ? parseFloat(values.dimensions.length) : null,
            width: values.dimensions.width ? parseFloat(values.dimensions.width) : null,
            height: values.dimensions.height ? parseFloat(values.dimensions.height) : null
          },
          features,
          variations,
          images: imagePreviews,
          createdAt: new Date().toISOString(),
          rating: 0,
          reviews: []
        };

        // Save product
        await productService.createProduct(productData);
        
        toast.success('Product added successfully!');
        navigate('/admin/products');
      } catch (error) {
        toast.error(error.message || 'Failed to add product');
      } finally {
        setLoading(false);
      }
    }
  });

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (imagePreviews.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`${file.name} is too large (max 5MB)`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, {
          url: reader.result,
          file,
          name: file.name,
          size: file.size
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Add feature
  const addFeature = () => {
    if (newFeature.trim() && features.length < 10) {
      setFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };

  // Remove feature
  const removeFeature = (index) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  // Add variation
  const addVariation = () => {
    const newId = variations.length + 1;
    setVariations(prev => [...prev, { 
      id: newId, 
      type: '', 
      options: [] 
    }]);
  };

  // Remove variation
  const removeVariation = (id) => {
    if (variations.length > 1) {
      setVariations(prev => prev.filter(v => v.id !== id));
    }
  };

  // Update variation
  const updateVariation = (id, field, value) => {
    setVariations(prev => prev.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  // Add variation option
  const addVariationOption = (variationId, option) => {
    if (!option.trim()) return;
    
    setVariations(prev => prev.map(v => {
      if (v.id === variationId && !v.options.includes(option.trim())) {
        return { ...v, options: [...v.options, option.trim()] };
      }
      return v;
    }));
  };

  // Remove variation option
  const removeVariationOption = (variationId, optionIndex) => {
    setVariations(prev => prev.map(v => {
      if (v.id === variationId) {
        return {
          ...v,
          options: v.options.filter((_, i) => i !== optionIndex)
        };
      }
      return v;
    }));
  };

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (formik.values.originalPrice && formik.values.price) {
      const original = parseFloat(formik.values.originalPrice);
      const sale = parseFloat(formik.values.price);
      if (original > sale) {
        return Math.round(((original - sale) / original) * 100);
      }
    }
    return 0;
  };

  const discountPercentage = calculateDiscount();

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <button 
                className="btn btn-outline-secondary btn-sm mb-2"
                onClick={() => navigate('/admin/products')}
              >
                <FaArrowLeft className="me-2" /> Back to Products
              </button>
              <h1 className="h3 mb-0">
                <FaPlus className="me-2 text-primary" />
                Add New Product
              </h1>
              <p className="text-muted mb-0">Fill in the details to add a new product</p>
            </div>
            
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  if (window.confirm('Are you sure? All unsaved changes will be lost.')) {
                    navigate('/admin/products');
                  }
                }}
                disabled={loading}
              >
                Cancel
              </button>
              
              <button
                type="button"
                className="btn btn-primary"
                onClick={formik.submitForm}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    Save Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Left Column - Basic Information */}
        <div className="col-lg-8">
          {/* Product Information Card */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <FaInfoCircle className="me-2 text-primary" />
                Product Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {/* Product Name */}
                <div className="col-md-12">
                  <label className="form-label fw-semibold">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                    placeholder="Enter product name"
                    {...formik.getFieldProps('name')}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="invalid-feedback">{formik.errors.name}</div>
                  )}
                </div>

                {/* Description */}
                <div className="col-md-12">
                  <label className="form-label fw-semibold">
                    Description *
                  </label>
                  <textarea
                    className={`form-control ${formik.touched.description && formik.errors.description ? 'is-invalid' : ''}`}
                    rows="5"
                    placeholder="Enter detailed product description"
                    {...formik.getFieldProps('description')}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className="invalid-feedback">{formik.errors.description}</div>
                  )}
                  <small className="text-muted">
                    {formik.values.description.length}/2000 characters
                  </small>
                </div>

                {/* Price & Stock */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <FaDollarSign className="me-1" />
                    Price *
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      step="0.01"
                      className={`form-control ${formik.touched.price && formik.errors.price ? 'is-invalid' : ''}`}
                      placeholder="0.00"
                      {...formik.getFieldProps('price')}
                    />
                  </div>
                  {formik.touched.price && formik.errors.price && (
                    <div className="invalid-feedback d-block">{formik.errors.price}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Original Price
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      step="0.01"
                      className={`form-control ${formik.touched.originalPrice && formik.errors.originalPrice ? 'is-invalid' : ''}`}
                      placeholder="Original price (for discounts)"
                      {...formik.getFieldProps('originalPrice')}
                    />
                  </div>
                  {formik.touched.originalPrice && formik.errors.originalPrice && (
                    <div className="invalid-feedback d-block">{formik.errors.originalPrice}</div>
                  )}
                  {discountPercentage > 0 && (
                    <div className="text-success mt-1">
                      <FaTags className="me-1" />
                      {discountPercentage}% discount applied
                    </div>
                  )}
                </div>

                {/* Category & SKU */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Category *
                  </label>
                  <select
                    className={`form-select ${formik.touched.category && formik.errors.category ? 'is-invalid' : ''}`}
                    {...formik.getFieldProps('category')}
                    onChange={(e) => {
                      formik.handleChange(e);
                      setSelectedCategory(e.target.value);
                    }}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {formik.touched.category && formik.errors.category && (
                    <div className="invalid-feedback">{formik.errors.category}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    SKU (Stock Keeping Unit) *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formik.touched.sku && formik.errors.sku ? 'is-invalid' : ''}`}
                    placeholder="e.g., PROD-001"
                    {...formik.getFieldProps('sku')}
                  />
                  {formik.touched.sku && formik.errors.sku && (
                    <div className="invalid-feedback">{formik.errors.sku}</div>
                  )}
                </div>

                {/* Stock */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <FaBox className="me-1" />
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    className={`form-control ${formik.touched.stock && formik.errors.stock ? 'is-invalid' : ''}`}
                    placeholder="Available quantity"
                    {...formik.getFieldProps('stock')}
                  />
                  {formik.touched.stock && formik.errors.stock && (
                    <div className="invalid-feedback">{formik.errors.stock}</div>
                  )}
                </div>

                {/* Brand */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Brand
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Brand name"
                    {...formik.getFieldProps('brand')}
                  />
                </div>

                {/* Weight & Dimensions */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    Weight (kg)
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="0.00"
                      {...formik.getFieldProps('weight')}
                    />
                    <span className="input-group-text">kg</span>
                  </div>
                </div>

                <div className="col-md-8">
                  <label className="form-label fw-semibold">
                    Dimensions (L × W × H in cm)
                  </label>
                  <div className="row g-2">
                    <div className="col-4">
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        placeholder="Length"
                        {...formik.getFieldProps('dimensions.length')}
                      />
                    </div>
                    <div className="col-4">
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        placeholder="Width"
                        {...formik.getFieldProps('dimensions.width')}
                      />
                    </div>
                    <div className="col-4">
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        placeholder="Height"
                        {...formik.getFieldProps('dimensions.height')}
                      />
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="col-md-12">
                  <label className="form-label fw-semibold">
                    Tags
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags separated by commas"
                    {...formik.getFieldProps('tags')}
                  />
                  <small className="text-muted">e.g., new, featured, bestseller</small>
                </div>
              </div>
            </div>
          </div>

          {/* Product Features Card */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">Product Features</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Add Features</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter a feature"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                  />
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={addFeature}
                    disabled={!newFeature.trim() || features.length >= 10}
                  >
                    <FaPlus />
                  </button>
                </div>
                <small className="text-muted">
                  Press Enter or click + to add. Maximum 10 features.
                </small>
              </div>

              <div className="features-list">
                <h6 className="mb-2">Current Features ({features.length}/10):</h6>
                <div className="d-flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <div key={index} className="badge bg-primary d-flex align-items-center gap-2 p-2">
                      {feature}
                      <button
                        type="button"
                        className="btn btn-sm btn-link text-white p-0"
                        onClick={() => removeFeature(index)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  {features.length === 0 && (
                    <p className="text-muted mb-0">No features added yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Variations Card */}
          <div className="card mb-4">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Product Variations</h5>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={addVariation}
              >
                <FaPlus className="me-1" /> Add Variation
              </button>
            </div>
            <div className="card-body">
              {variations.map((variation, index) => (
                <div key={variation.id} className="variation-item mb-4 p-3 border rounded">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Variation {index + 1}</h6>
                    {variations.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeVariation(variation.id)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Variation Type</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Color, Size, Material"
                        value={variation.type}
                        onChange={(e) => updateVariation(variation.id, 'type', e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Add Option</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., Red, Blue"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addVariationOption(variation.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={(e) => {
                            const input = e.target.previousElementSibling;
                            addVariationOption(variation.id, input.value);
                            input.value = '';
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Options</label>
                      <div className="d-flex flex-wrap gap-2">
                        {variation.options.map((option, optIndex) => (
                          <div key={optIndex} className="badge bg-info d-flex align-items-center gap-2 p-2">
                            {option}
                            <button
                              type="button"
                              className="btn btn-sm btn-link text-white p-0"
                              onClick={() => removeVariationOption(variation.id, optIndex)}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                        {variation.options.length === 0 && (
                          <span className="text-muted">No options added yet.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Images & Settings */}
        <div className="col-lg-4">
          {/* Product Images Card */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <FaImages className="me-2 text-primary" />
                Product Images
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Upload Images *
                </label>
                <div className="image-upload-area border rounded p-5 text-center"
                  style={{ backgroundColor: '#f8f9fa', cursor: 'pointer' }}
                  onClick={() => document.getElementById('imageUpload').click()}
                >
                  <FaUpload size={48} className="text-muted mb-3" />
                  <h5>Click to upload images</h5>
                  <p className="text-muted mb-0">
                    PNG, JPG, GIF up to 5MB each
                  </p>
                  <p className="text-muted">
                    {imagePreviews.length}/5 images selected
                  </p>
                </div>
                <input
                  id="imageUpload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="d-none"
                  onChange={handleImageUpload}
                />
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="image-previews">
                  <h6 className="mb-3">Selected Images:</h6>
                  <div className="row g-2">
                    {imagePreviews.map((image, index) => (
                      <div key={index} className="col-6">
                        <div className="position-relative border rounded p-1">
                          <img
                            src={image.url}
                            alt={`Preview ${index + 1}`}
                            className="img-fluid rounded"
                            style={{ height: '100px', width: '100%', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                            onClick={() => removeImage(index)}
                          >
                            <FaTrash size={12} />
                          </button>
                          {index === 0 && (
                            <span className="badge bg-primary position-absolute top-0 start-0 m-1">
                              Main
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Settings Card */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">Product Settings</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isFeatured"
                    checked={formik.values.isFeatured}
                    onChange={formik.handleChange}
                  />
                  <label className="form-check-label" htmlFor="isFeatured">
                    <strong>Featured Product</strong>
                  </label>
                  <p className="text-muted small mb-0">
                    Show this product in featured sections
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isActive"
                    checked={formik.values.isActive}
                    onChange={formik.handleChange}
                  />
                  <label className="form-check-label" htmlFor="isActive">
                    <strong>Active Product</strong>
                  </label>
                  <p className="text-muted small mb-0">
                    Product will be visible to customers
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Warranty</label>
                <select
                  className="form-select"
                  {...formik.getFieldProps('warranty')}
                >
                  <option value="No warranty">No warranty</option>
                  <option value="30 days">30 days</option>
                  <option value="6 months">6 months</option>
                  <option value="1 year">1 year</option>
                  <option value="2 years">2 years</option>
                  <option value="Lifetime">Lifetime</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Shipping Information</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Shipping details"
                  {...formik.getFieldProps('shippingInfo')}
                />
              </div>
            </div>
          </div>

          {/* Product Summary Card */}
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Product Summary</h5>
            </div>
            <div className="card-body">
              <div className="product-summary">
                <div className="mb-2 d-flex justify-content-between">
                  <span className="text-muted">Status:</span>
                  <span className={`badge ${formik.values.isActive ? 'bg-success' : 'bg-danger'}`}>
                    {formik.values.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {formik.values.name && (
                  <div className="mb-2">
                    <small className="text-muted">Name:</small>
                    <p className="mb-0 fw-semibold">{formik.values.name}</p>
                  </div>
                )}
                
                {formik.values.category && (
                  <div className="mb-2">
                    <small className="text-muted">Category:</small>
                    <p className="mb-0">{formik.values.category}</p>
                  </div>
                )}
                
                {formik.values.price && (
                  <div className="mb-2">
                    <small className="text-muted">Price:</small>
                    <p className="mb-0">
                      ${parseFloat(formik.values.price).toFixed(2)}
                      {discountPercentage > 0 && (
                        <span className="text-success ms-2">
                          ({discountPercentage}% off)
                        </span>
                      )}
                    </p>
                  </div>
                )}
                
                {formik.values.stock && (
                  <div className="mb-2">
                    <small className="text-muted">Stock:</small>
                    <p className="mb-0">{formik.values.stock} units</p>
                  </div>
                )}
                
                {features.length > 0 && (
                  <div className="mb-2">
                    <small className="text-muted">Features:</small>
                    <p className="mb-0">{features.length} features added</p>
                  </div>
                )}
                
                {imagePreviews.length > 0 && (
                  <div className="mb-2">
                    <small className="text-muted">Images:</small>
                    <p className="mb-0">{imagePreviews.length} images uploaded</p>
                  </div>
                )}
                
                {variations.length > 0 && (
                  <div className="mb-2">
                    <small className="text-muted">Variations:</small>
                    <p className="mb-0">{variations.length} variations configured</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    if (window.confirm('Are you sure? All unsaved changes will be lost.')) {
                      navigate('/admin/products');
                    }
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => {
                      if (window.confirm('Save as draft?')) {
                        // Handle draft save
                        toast.info('Saved as draft');
                      }
                    }}
                    disabled={loading}
                  >
                    Save as Draft
                  </button>
                  
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={formik.submitForm}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Publishing Product...
                      </>
                    ) : (
                      <>
                        <FaSave className="me-2" />
                        Publish Product
                      </>
                    )}
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

export default AddProduct;