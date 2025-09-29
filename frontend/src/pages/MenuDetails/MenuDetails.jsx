import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import menuService from '../../services/menuService';
import reviewService from '../../services/reviewService';
import config from '../../services/config';
import './MenuDetails.css';

const MenuDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { user } = useAuth();
  
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Customization state
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  // Ingredient customization state - only one selection allowed
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  // Special items state
  const [selectedSpecialItems, setSelectedSpecialItems] = useState([]);
  
  // Related items state
  const [relatedItems, setRelatedItems] = useState([]);
  
  // Feedback form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Define ingredient options based on subCategory
  const getIngredientOptions = (subCategory) => {
    if (subCategory === 'rice') {
      // Specific pricing for Fried Rice
      return [
        { name: 'chicken half', price: 1200 },
        { name: 'chicken full', price: 1450 },
        { name: 'mix half', price: 1650 },
        { name: 'mix full', price: 1800 },
        { name: 'seafood half', price: 2100 },
        { name: 'seafood full', price: 2500 },
        { name: 'vegetable half', price: 650 },
        { name: 'vegetable full', price: 800 }
      ];
    }
    
    if (subCategory === 'kottu') {
      // Specific pricing for Kottu
      return [
        { name: 'cheese half', price: 1800 },
        { name: 'cheese full', price: 2000 },
        { name: 'chicken half', price: 1200 },
        { name: 'chicken full', price: 1450 },
        { name: 'mix half', price: 1650 },
        { name: 'mix full', price: 1800 },
        { name: 'seafood half', price: 2100 },
        { name: 'seafood full', price: 2500 },
        { name: 'vegetable half', price: 650 },
        { name: 'vegetable full', price: 800 }
      ];
    }
    
    if (subCategory === 'pesta') {
      // Specific pricing for Pesta
      return [
        { name: 'cheese half', price: 1400 },
        { name: 'cheese full', price: 1600 },
        { name: 'chicken half', price: 800 },
        { name: 'chicken full', price: 1000 },
        { name: 'mix half', price: 1200 },
        { name: 'mix full', price: 1800 },
        { name: 'seafood half', price: 1600 },
        { name: 'seafood full', price: 1800 },
        { name: 'vegetable half', price: 500 },
        { name: 'vegetable full', price: 700 }
      ];
    }
    
    if (subCategory === 'noodles') {
      // Specific pricing for Noodles
      return [
        { name: 'chicken half', price: 800 },
        { name: 'chicken full', price: 1000 },
        { name: 'mix half', price: 1200 },
        { name: 'mix full', price: 1800 },
        { name: 'seafood half', price: 1600 },
        { name: 'seafood full', price: 1800 },
        { name: 'vegetable half', price: 500 },
        { name: 'vegetable full', price: 700 }
      ];
    }
    
    return [];
  };

  // Initialize ingredients when menuItem changes
  useEffect(() => {
    if (menuItem && menuItem.subCategory) {
      // Reset selection when menu item changes
      setSelectedIngredient(null);
    }
  }, [menuItem]);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        setLoading(true);
        const data = await menuService.getMenuItemById(id);
        setMenuItem(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        addToast('Failed to fetch menu item details', 'error');
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const data = await reviewService.getReviewsByMenuItem(id);
        setReviews(data);
        setReviewsLoading(false);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
        setReviewsLoading(false);
      }
    };

    if (id) {
      fetchMenuItem();
      fetchReviews();
    }
  }, [id]);

  // Fetch related items when menuItem changes
  useEffect(() => {
    const fetchRelatedItems = async () => {
      if (!menuItem) return;
      
      try {
        // Fetch all menu items to find related ones
        const allItems = await menuService.getMenuItems();
        
        // Find related items (drinks for main items, or same category)
        let related = [];
        if (menuItem.category === 'main') {
          // For main items, suggest drinks
          related = allItems.filter(item => 
            item.category === 'drink' && item._id !== id
          ).slice(0, 3); // Limit to 3 suggestions
        } else {
          // For other items, suggest items from the same category
          related = allItems.filter(item => 
            item.category === menuItem.category && item._id !== id
          ).slice(0, 3); // Limit to 3 suggestions
        }
        
        setRelatedItems(related);
      } catch (err) {
        console.error('Failed to fetch related items:', err);
      }
    };

    if (menuItem) {
      fetchRelatedItems();
    }
  }, [menuItem, id]);

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

  // Function to get the current price based on selected ingredient
  const getCurrentPrice = () => {
    if (!menuItem) return 0;
    
    // If Fried Rice, Kottu, Pesta, or Noodles and an ingredient is selected, use ingredient price
    if ((menuItem.subCategory === 'rice' || menuItem.subCategory === 'kottu' || menuItem.subCategory === 'pesta' || menuItem.subCategory === 'noodles') && selectedIngredient) {
      // For Fried Rice, Kottu, Pesta, and Noodles, the ingredient price replaces the base price
      const ingredientOptions = getIngredientOptions(menuItem.subCategory);
      const selectedOption = ingredientOptions.find(option => option.name === selectedIngredient);
      if (selectedOption) {
        return selectedOption.price;
      }
    }
    
    // Default to base price
    return menuItem.price;
  };

  // Function to calculate total price including special items cost
  const getTotalPrice = () => {
    const basePrice = getCurrentPrice();
    
    // For non-Fried Rice, non-Kottu, non-Pesta, and non-Noodles items, add 50 RS for the selected ingredient
    let ingredientCost = 0;
    if (selectedIngredient && menuItem.subCategory !== 'rice' && menuItem.subCategory !== 'kottu' && menuItem.subCategory !== 'pesta' && menuItem.subCategory !== 'noodles') {
      ingredientCost = 50;
    }
    
    // Calculate cost for selected special items (Extra Meat, Extra Seafood, Extra Cheese)
    // Only Kottu and Pesta can have special items
    let specialItemsCost = 0;
    if ((menuItem.subCategory === 'kottu' || menuItem.subCategory === 'pesta') && selectedSpecialItems.length > 0) {
      specialItemsCost = selectedSpecialItems.length * 100; // Rs 100 per special item
    }
    
    return (basePrice * quantity) + ingredientCost + specialItemsCost;
  };

  // Select ingredient (only one allowed)
  const selectIngredient = (ingredientName) => {
    // For Fried Rice, Kottu, Pesta, and Noodles, the ingredient is an object with name and price
    // For others, it's just a string
    setSelectedIngredient(ingredientName);
  };

  // Toggle special items selection
  const toggleSpecialItem = (itemName) => {
    setSelectedSpecialItems(prev => {
      if (prev.includes(itemName)) {
        return prev.filter(item => item !== itemName);
      } else {
        return [...prev, itemName];
      }
    });
  };

  const handleAddToCart = () => {
    // Check if user is logged in
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      addToast('Please log in to add items to your cart', 'info');
      navigate('/login');
      return;
    }
    
    // Create a customized item object
    const customizedItem = {
      ...menuItem,
      // Override price with selected ingredient price for Fried Rice, Kottu, Pesta, and Noodles
      price: getCurrentPrice(),
      customizations: {
        specialInstructions: specialInstructions || undefined,
        quantity: quantity,
        ingredient: selectedIngredient,
        // Only add specialItems for Kottu and Pesta
        specialItems: (menuItem.subCategory === 'kottu' || menuItem.subCategory === 'pesta') && selectedSpecialItems.length > 0 ? selectedSpecialItems : undefined
      }
    };
    
    // Add to cart with quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(customizedItem);
    }
    
    addToast(`${quantity} x ${menuItem.name} added to cart!`, 'success');
  };

  const handleBackToMenu = () => {
    navigate('/menu');
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      addToast('Please log in to submit a review', 'info');
      navigate('/login');
      return;
    }
    
    if (rating === 0) {
      addToast('Please select a rating', 'error');
      return;
    }
    
    if (!comment.trim()) {
      addToast('Please enter a comment', 'error');
      return;
    }
    
    try {
      setSubmitting(true);
      const reviewData = { rating, comment };
      const newReview = await reviewService.createReview(id, reviewData);
      
      // Add new review to the list
      setReviews(prev => [newReview, ...prev]);
      
      // Reset form
      setRating(0);
      setComment('');
      
      addToast('Review submitted successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="menu-details-page">
        <div className="container">
          <p>Loading menu item details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-details-page">
        <div className="container">
          <p>Error: {error}</p>
          <button onClick={handleBackToMenu} className="btn-back">Back to Menu</button>
        </div>
      </div>
    );
  }

  if (!menuItem) {
    return (
      <div className="menu-details-page">
        <div className="container">
          <p>Menu item not found.</p>
          <button onClick={handleBackToMenu} className="btn-back">Back to Menu</button>
        </div>
      </div>
    );
  }

  // Get current price based on selected ingredient
  const currentPrice = getCurrentPrice();
  const totalPrice = getTotalPrice();
  const hasIngredients = menuItem.subCategory && getIngredientOptions(menuItem.subCategory).length > 0;
  const ingredientOptions = getIngredientOptions(menuItem.subCategory);
  
  // Define special items based on subCategory
  const getSpecialItems = (subCategory) => {
    // Only Kottu and Pesta can have Extra Cheese
    if (subCategory === 'kottu' || subCategory === 'pesta') {
      return ['Extra Meat', 'Extra Seafood', 'Extra Cheese'];
    }
    // Other categories don't have Extra Cheese
    return ['Extra Meat', 'Extra Seafood'];
  };
  
  const specialItems = getSpecialItems(menuItem.subCategory);

  return (
    <div className="menu-details-page">
      <div className="container">
        <button onClick={handleBackToMenu} className="btn-back">← Back to Menu</button>
        
        <div className="menu-item-detail">
          <div className="menu-item-image-large">
            {menuItem.imageUrl ? (
              <img src={getImageUrl(menuItem.imageUrl)} alt={menuItem.name} />
            ) : (
              <div className="no-image-placeholder-large">No Image Available</div>
            )}
          </div>
          
          <div className="menu-item-info">
            <h1 className="menu-item-name">{menuItem.name}</h1>
            <p className="menu-item-category">{menuItem.category.charAt(0).toUpperCase() + menuItem.category.slice(1)}</p>
            <p className="menu-item-price">RS.{currentPrice.toFixed(2)}</p>
            <p className="menu-item-description-detail">{menuItem.description}</p>
            
            <div className="menu-item-meta">
              {menuItem.vegetarian && (
                <span className="vegetarian-tag">Vegetarian</span>
              )}
              <span className={`availability-tag ${menuItem.available ? 'available' : 'unavailable'}`}>
                {menuItem.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            
            {/* Ingredient customization for specific subcategories - only one selection allowed */}
            {hasIngredients && (
              <div className="ingredient-customization">
                <h3>Choose Your Ingredients</h3>
                <p className="ingredient-note">Please select only one option</p>
                {menuItem.subCategory === 'rice' || menuItem.subCategory === 'kottu' || menuItem.subCategory === 'pesta' || menuItem.subCategory === 'noodles' ? (
                  // Special pricing for Fried Rice, Kottu, Pesta, and Noodles
                  <div className="ingredients-grid">
                    {ingredientOptions.map(ingredient => (
                      <button
                        key={ingredient.name}
                        className={`ingredient-btn ${selectedIngredient === ingredient.name ? 'selected' : ''}`}
                        onClick={() => selectIngredient(ingredient.name)}
                      >
                        <div className="ingredient-name">{ingredient.name}</div>
                        <div className="ingredient-price">RS.{ingredient.price}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  // Standard ingredients for other subcategories
                  <div className="ingredients-grid">
                    {ingredientOptions.map(ingredient => (
                      <button
                        key={ingredient}
                        className={`ingredient-btn ${selectedIngredient === ingredient ? 'selected' : ''}`}
                        onClick={() => selectIngredient(ingredient)}
                      >
                        {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
                        <div className="ingredient-price">+RS.50</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Special instructions */}
            <div className="special-instructions">
              <label htmlFor="special-instructions">Special Instructions:</label>
              <textarea
                id="special-instructions"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests? (e.g., no onions, extra sauce, etc.)"
                rows="3"
              />
              
              {/* Add special things options */}
              <div className="add-special-things">
                <h3>Add Special Things</h3>
                <div className="special-items-grid">
                  {specialItems.map(item => (
                    <button
                      key={item}
                      className={`special-item-btn ${selectedSpecialItems.includes(item) ? 'selected' : ''}`}
                      onClick={() => toggleSpecialItem(item)}
                    >
                      {item} (+RS.100)
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Quantity selector */}
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Price breakdown */}
            <div className="price-breakdown">
              <div className="price-line">
                <span>Item Price:</span>
                <span>RS.{(currentPrice * quantity).toFixed(2)}</span>
              </div>
              {/* Show ingredient costs */}
              {selectedIngredient && menuItem.subCategory !== 'rice' && menuItem.subCategory !== 'kottu' && menuItem.subCategory !== 'pesta' && menuItem.subCategory !== 'noodles' && (
                <div className="price-line">
                  <span>Ingredient Cost:</span>
                  <span>RS.50.00</span>
                </div>
              )}
              {selectedSpecialItems.length > 0 && (
                <div className="price-line">
                  <span>Special Items ({selectedSpecialItems.join(', ')}):</span>
                  <span>RS.{(selectedSpecialItems.length * 100).toFixed(2)}</span>
                </div>
              )}
              <div className="price-line total">
                <span>Total:</span>
                <span>RS.{totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="menu-item-actions-detail">
              <button 
                className="btn-add-to-cart-detail"
                onClick={handleAddToCart}
                disabled={!menuItem.available || (hasIngredients && !selectedIngredient)}>
                {menuItem.available ? (
                  hasIngredients && !selectedIngredient ? 
                  'Please Select an Ingredient' : 
                  'Add to Cart - RS.' + totalPrice.toFixed(2)
                ) : 'Unavailable'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Related Items Section */}
        {relatedItems.length > 0 && (
          <div className="related-items-section">
            <h2>{menuItem.category === 'main' ? 'Perfect Pairings' : 'You Might Also Like'}</h2>
            <div className="related-items">
              {relatedItems.map(item => (
                <div key={item._id} className="related-item">
                  <div className="related-item-image">
                    {item.imageUrl ? (
                      <img src={getImageUrl(item.imageUrl)} alt={item.name} />
                    ) : (
                      <div className="no-image-placeholder-small">No Image</div>
                    )}
                  </div>
                  <div className="related-item-info">
                    <h4>{item.name}</h4>
                    <p className="related-item-price">RS.{item.price.toFixed(2)}</p>
                    <button 
                      className="btn-add-related"
                      onClick={() => {
                        addToCart(item);
                        addToast(`${item.name} added to cart!`, 'success');
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Feedback Section */}
        <div className="feedback-section">
          <h2>Customer Feedback</h2>
          
          {/* Feedback Form */}
          <div className="feedback-form">
            <h3>Leave a Review</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="rating-input">
                <label>Rating:</label>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= rating ? 'filled' : ''}`}
                      onClick={() => handleRatingChange(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="comment-input">
                <label htmlFor="comment">Comment:</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this item..."
                  rows="4"
                />
              </div>
              
              <button 
                type="submit" 
                className="btn-submit-review"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
          
          {/* Reviews List */}
          <div className="reviews-list">
            <h3>Customer Reviews</h3>
            
            {reviewsLoading ? (
              <p>Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet. Be the first to review this item!</p>
            ) : (
              <div className="reviews">
                {reviews.map((review) => (
                  <div key={review._id} className="review">
                    <div className="review-header">
                      <span className="reviewer-name">{review.user?.name || 'Anonymous'}</span>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetails;