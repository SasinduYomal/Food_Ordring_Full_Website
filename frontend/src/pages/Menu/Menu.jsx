import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import menuService from '../../services/menuService';
import orderService from '../../services/orderService';
import reviewService from '../../services/reviewService';
import Loading from '../../components/Loading/Loading';
import './Menu.css';
import config from '../../services/config';

const Menu = () => {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [orderCounts, setOrderCounts] = useState({});
  const [reviews, setReviews] = useState({});
  
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const data = await menuService.getMenuItems();
      setMenuItems(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      addToast('Failed to fetch menu items', 'error');
      setLoading(false);
    }
  };

  // Fetch order counts for menu items
  const fetchOrderCounts = async () => {
    try {
      const counts = await orderService.getOrderCountsForMenuItems();
      setOrderCounts(counts);
    } catch (err) {
      console.error('Failed to fetch order counts:', err);
      addToast('Failed to fetch order counts', 'error');
    }
  };

  // Fetch reviews for a menu item
  const fetchReviews = async (menuItemId) => {
    try {
      const itemReviews = await reviewService.getReviewsByMenuItem(menuItemId);
      return itemReviews;
    } catch (err) {
      console.error(`Failed to fetch reviews for item ${menuItemId}:`, err);
      return [];
    }
  };

  // Fetch all reviews for menu items
  const fetchAllReviews = async () => {
    try {
      const reviewsData = {};
      for (const item of menuItems) {
        const itemReviews = await fetchReviews(item._id);
        reviewsData[item._id] = itemReviews;
      }
      setReviews(reviewsData);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      addToast('Failed to fetch reviews', 'error');
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (menuItems.length > 0) {
      fetchOrderCounts();
      fetchAllReviews();
    }
  }, [menuItems.length]); // Changed dependency to menuItems.length

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'starter', name: 'Starters' },
    { id: 'main', name: 'Main Course' },
    { id: 'dessert', name: 'Desserts' },
    { id: 'drink', name: 'Drinks' }
  ];

  // Define subcategories for main course
  const subCategories = [
    { id: 'all', name: 'All Types' },
    { id: 'rice', name: 'Fried Rice' }, // Changed from 'Rice' to 'Fried Rice'
    { id: 'kottu', name: 'Kottu' },
    { id: 'pesta', name: 'Pesta' },
    { id: 'noodles', name: 'Noodles' }
  ];

  // Filter items based on category and subcategory
  const filteredItems = (() => {
    let items = selectedCategory === 'all' 
      ? menuItems 
      : menuItems.filter(item => item.category === selectedCategory);

    // Apply subcategory filter only for main course
    if (selectedCategory === 'main' && selectedSubCategory !== 'all') {
      items = items.filter(item => 
        item.subCategory === selectedSubCategory || 
        (item.name.toLowerCase().includes(selectedSubCategory))
      );
    }

    return items;
  })();

  const handleAddToCart = (item) => {
    // Check if user is logged in
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      addToast('Please log in to add items to your cart', 'info');
      navigate('/login');
      return;
    }
    
    addToCart(item);
    addToast(`${item.name} added to cart!`, 'success');
  };

  // Function to calculate average rating from reviews
  const calculateAverageRating = (itemReviews) => {
    if (!itemReviews || itemReviews.length === 0) return 0;
    
    const totalRating = itemReviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / itemReviews.length).toFixed(1);
  };

  // Function to render star ratings
  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star full">★</span>);
      } else if (i === fullStars + 1 && halfStar) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    
    return stars;
  };

  // Function to construct image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // If it's an absolute path starting with /, prepend the base URL
    if (imageUrl.startsWith('/')) {
      return `${config.ASSET_BASE_URL}${imageUrl}`;
    }
    
    // Otherwise, return as is (relative path)
    return imageUrl;
  };

  // Get ingredient options for display
  const getIngredientPreview = (subCategory) => {
    const ingredients = {
      rice: ['chicken half', 'chicken full', 'mix half', 'mix full', 'seafood half', 'seafood full', 'vegetable half', 'vegetable full'],
      kottu: ['cheese', 'chicken', 'mix', 'seafood', 'vegetable'],
      pesta: ['cheese', 'chicken', 'mix', 'seafood'],
      noodles: ['chicken', 'mix', 'seafood']
    };
    return ingredients[subCategory] || [];
  };

  // Format subcategory display name
  const formatSubCategoryName = (subCategory) => {
    if (subCategory === 'rice') {
      return 'Fried Rice';
    }
    return subCategory.charAt(0).toUpperCase() + subCategory.slice(1);
  };

  if (loading) {
    return <Loading message="Loading delicious menu items..." />;
  }

  if (error) {
    return <div className="menu-page">Error: {error}</div>;
  }

  return (
    <div className="menu-page">
      <header className="menu-header">
        <h1>Our Menu</h1>
        <p>Discover our delicious selection of dishes</p>
        <button className="refresh-btn" onClick={fetchMenuItems}>
          Refresh Menu
        </button>
      </header>

      <div className="menu-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedCategory(category.id);
              // Reset subcategory when changing main category
              if (category.id !== 'main') {
                setSelectedSubCategory('all');
              }
            }}>
            {category.name}
          </button>
        ))}
      </div>

      {/* Subcategory filters - only show for main course */}
      {selectedCategory === 'main' && (
        <div className="menu-sub-filters">
          {subCategories.map(subCategory => (
            <button
              key={subCategory.id}
              className={`filter-btn ${selectedSubCategory === subCategory.id ? 'active' : ''}`}
              onClick={() => setSelectedSubCategory(subCategory.id)}>
              {subCategory.name}
            </button>
          ))}
        </div>
      )}

      <div className="menu-items">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => {
            const itemCount = orderCounts[item._id] || 0;
            const itemReviews = reviews[item._id] || [];
            const avgRating = calculateAverageRating(itemReviews);
            const hasIngredients = item.subCategory && getIngredientPreview(item.subCategory).length > 0;
            
            return (
              <div key={item._id} className="menu-item-card">
                <div className="menu-item-image-container">
                  {item.imageUrl ? (
                    <img 
                      src={getImageUrl(item.imageUrl)} 
                      alt={item.name} 
                      className="menu-item-image"
                    />
                  ) : (
                    <div className="no-image-placeholder">
                      <span>No Image</span>
                    </div>
                  )}
                  {item.vegetarian && (
                    <span className="vegetarian-badge">Vegetarian</span>
                  )}
                </div>
                <div className="menu-item-content">
                  <div className="menu-item-header">
                    <h3 className="menu-item-title">{item.name}</h3>
                    <span className="menu-item-price">RS.{item.price.toFixed(2)}</span>
                  </div>
                  
                  {/* Display subcategory if available */}
                  {item.subCategory && (
                    <div className="menu-item-subcategory">
                      <span className="subcategory-badge">{formatSubCategoryName(item.subCategory)}</span>
                    </div>
                  )}
                  
                  <p className="menu-item-description">{item.description}</p>
                  
                  {/* Display ingredient preview for customizable items */}
                  {hasIngredients && (
                    <div className="ingredient-preview">
                      <span className="ingredient-preview-label">Customize with:</span>
                      <div className="ingredient-tags">
                        {getIngredientPreview(item.subCategory).slice(0, 3).map(ingredient => (
                          <span key={ingredient} className="ingredient-tag">
                            {ingredient}
                          </span>
                        ))}
                        {getIngredientPreview(item.subCategory).length > 3 && (
                          <span className="ingredient-tag more">+{getIngredientPreview(item.subCategory).length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Customer feedback section */}
                  <div className="menu-item-feedback">
                    {avgRating > 0 ? (
                      <div className="rating-section">
                        <div className="stars">
                          {renderStarRating(parseFloat(avgRating))}
                        </div>
                        <span className="rating-value">{avgRating}</span>
                        <span className="review-count">({itemReviews.length})</span>
                      </div>
                    ) : (
                      <div className="no-reviews">No reviews yet</div>
                    )}
                  </div>
                  
                  {/* Order count section */}
                  <div className="menu-item-stats">
                    <span className="order-count">{itemCount} orders</span>
                  </div>
                  
                  <div className="menu-item-actions">
                    <button 
                      className="btn-add-to-cart"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(item);
                      }}
                      disabled={!item.available}>
                      {item.available ? (
                        <>
                          <span className="plus-icon">+</span> Add to Cart
                        </>
                      ) : 'Unavailable'}
                    </button>
                    <Link to={`/menu/${item._id}`} className="view-more-btn">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-items-message">
            <p>No items available in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;