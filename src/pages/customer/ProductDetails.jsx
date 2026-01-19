import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import {
  FaShoppingCart,
  FaHeart,
  FaShare,
  FaStar,
  FaTruck,
  FaUndo,
  FaShieldAlt,
  FaTag,
  FaCheck
} from 'react-icons/fa';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      // Mock data - replace with API call
      const mockProduct = {
        id: parseInt(id),
        name: `Product ${id}`,
        description: `This is a detailed description for product ${id}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
        price: parseFloat((Math.random() * 1000 + 50).toFixed(2)),
        originalPrice: parseFloat((Math.random() * 1200 + 100).toFixed(2)),
        category: ['Electronics', 'Fashion', 'Home', 'Sports'][Math.floor(Math.random() * 4)],
        stock: Math.floor(Math.random() * 100),
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
        reviews: Math.floor(Math.random() * 500),
        images: [
          'https://via.placeholder.com/600x400/007bff/ffffff?text=Product+Image+1',
          'https://via.placeholder.com/600x400/28a745/ffffff?text=Product+Image+2',
          'https://via.placeholder.com/600x400/dc3545/ffffff?text=Product+Image+3',
          'https://via.placeholder.com/600x400/ffc107/ffffff?text=Product+Image+4'
        ],
        features: [
          'High Quality Material',
          'Durable Construction',
          'Easy to Use',
          '1 Year Warranty',
          'Free Shipping'
        ],
        variants: [
          { id: 1, name: 'Color', options: ['Red', 'Blue', 'Green', 'Black'] },
          { id: 2, name: 'Size', options: ['S', 'M', 'L', 'XL'] }
        ],
        specifications: [
          { key: 'Brand', value: 'BTY-HUB' },
          { key: 'Model', value: `MOD-${id}` },
          { key: 'Weight', value: '1.5 kg' },
          { key: 'Dimensions', value: '10 x 5 x 3 inches' },
          { key: 'Warranty', value: '1 Year' }
        ]
      };
      setProduct(mockProduct);
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    // Mock related products
    const mockRelated = Array.from({ length: 4 }, (_, i) => ({
      id: i + 100,
      name: `Related Product ${i + 1}`,
      price: parseFloat((Math.random() * 500 + 50).toFixed(2)),
      image: `https://via.placeholder.com/300x200?text=Related+${i + 1}`,
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1))
    }));
    setRelatedProducts(mockRelated);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        quantity: quantity
      });
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleQuantityChange = (value) => {
    if (value < 1) return;
    if (product && value > product.stock) {
      toast.error(`Only ${product.stock} units available`);
      return;
    }
    setQuantity(value);
  };

  if (loading || !product) {
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

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/">Home</a>
          </li>
          <li className="breadcrumb-item">
            <a href="/products">Products</a>
          </li>
          <li className="breadcrumb-item">
            <a href={`/products?category=${product.category}`}>{product.category}</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="row">
        {/* Product Images */}
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-body">
              {/* Main Image */}
              <div className="text-center mb-3">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="img-fluid rounded"
                  style={{ maxHeight: '400px', objectFit: 'contain' }}
                />
              </div>

              {/* Thumbnail Images */}
              <div className="row g-2">
                {product.images.map((img, index) => (
                  <div key={index} className="col-3">
                    <button
                      className={`btn p-0 border ${selectedImage === index ? 'border-primary' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="img-fluid rounded"
                        style={{ height: '80px', objectFit: 'cover', width: '100%' }}
                      />
                    </button>
                  </div>
                ))}
              </div>

              {/* Share & Wishlist */}
              <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-outline-secondary">
                  <FaShare className="me-2" /> Share
                </button>
                <button className="btn btn-outline-danger">
                  <FaHeart className="me-2" /> Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-body">
              {/* Product Title */}
              <h1 className="h2 mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="d-flex align-items-center mb-3">
                <div className="d-flex align-items-center me-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`me-1 ${i < Math.floor(product.rating) ? 'text-warning' : 'text-muted'}`}
                    />
                  ))}
                  <span className="ms-2">{product.rating}</span>
                </div>
                <span className="text-muted">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <h2 className="text-primary mb-0">${product.price.toFixed(2)}</h2>
                  {product.originalPrice && (
                    <>
                      <del className="text-muted ms-3 fs-5">${product.originalPrice.toFixed(2)}</del>
                      <span className="badge bg-danger ms-2">
                        Save {discountPercentage}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-4">
                {product.stock > 0 ? (
                  <div className="text-success">
                    <FaCheck className="me-2" />
                    In Stock ({product.stock} available)
                  </div>
                ) : (
                  <div className="text-danger">Out of Stock</div>
                )}
              </div>

              {/* Variants */}
              {product.variants.map(variant => (
                <div key={variant.id} className="mb-3">
                  <label className="form-label fw-semibold">{variant.name}:</label>
                  <div className="d-flex flex-wrap gap-2">
                    {variant.options.map(option => (
                      <button
                        key={option}
                        className={`btn btn-sm ${selectedVariant === option ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setSelectedVariant(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Quantity:</label>
                <div className="input-group" style={{ width: '150px' }}>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    min="1"
                    max={product.stock}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2 mb-4">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <FaShoppingCart className="me-2" />
                  Add to Cart
                </button>
                <button
                  className="btn btn-success btn-lg"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  Buy Now
                </button>
              </div>

              {/* Features */}
              <div className="mb-4">
                <h5 className="mb-3">Features:</h5>
                <ul className="list-unstyled">
                  {product.features.map((feature, index) => (
                    <li key={index} className="mb-2">
                      <FaCheck className="text-success me-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Delivery Info */}
              <div className="card bg-light">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 text-center mb-3 mb-md-0">
                      <FaTruck className="text-primary fs-4 mb-2" />
                      <div className="small">Free Shipping</div>
                      <div className="small text-muted">On orders over $50</div>
                    </div>
                    <div className="col-md-4 text-center mb-3 mb-md-0">
                      <FaUndo className="text-primary fs-4 mb-2" />
                      <div className="small">30-Day Returns</div>
                      <div className="small text-muted">Easy return policy</div>
                    </div>
                    <div className="col-md-4 text-center">
                      <FaShieldAlt className="text-primary fs-4 mb-2" />
                      <div className="small">Warranty</div>
                      <div className="small text-muted">1 Year warranty</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <ul className="nav nav-tabs" id="productTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="description-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#description"
                    type="button"
                  >
                    Description
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="specifications-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#specifications"
                    type="button"
                  >
                    Specifications
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="reviews-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#reviews"
                    type="button"
                  >
                    Reviews ({product.reviews})
                  </button>
                </li>
              </ul>
              <div className="tab-content p-3" id="productTabContent">
                <div className="tab-pane fade show active" id="description">
                  <p>{product.description}</p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
                <div className="tab-pane fade" id="specifications">
                  <table className="table">
                    <tbody>
                      {product.specifications.map((spec, index) => (
                        <tr key={index}>
                          <th style={{ width: '200px' }}>{spec.key}</th>
                          <td>{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="tab-pane fade" id="reviews">
                  <div className="text-center py-5">
                    <h5>Customer Reviews</h5>
                    <p className="text-muted">No reviews yet. Be the first to review this product!</p>
                    <button className="btn btn-primary">Write a Review</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="row mt-5">
          <div className="col-12">
            <h3 className="h4 mb-4">Related Products</h3>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
              {relatedProducts.map(related => (
                <div key={related.id} className="col">
                  <div className="card h-100">
                    <img
                      src={related.image}
                      className="card-img-top"
                      alt={related.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{related.name}</h5>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-primary fw-bold">
                          ${related.price.toFixed(2)}
                        </span>
                        <small className="text-warning">
                          <FaStar className="me-1" />
                          {related.rating}
                        </small>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-primary w-100 mt-2"
                        onClick={() => navigate(`/product/${related.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;