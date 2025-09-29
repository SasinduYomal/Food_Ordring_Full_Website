import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/Loading/Loading';
import './Cart.css';
import config from '../../services/config';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const discount = 0; // In a real app, this would be calculated based on promo code
  const total = subtotal + tax - discount;

  // Function to calculate base price (without special items cost)
  const calculateBasePrice = (item) => {
    let basePrice = item.price;
    
    // Subtract cost of special items (Rs.100 each)
    // Only for Kottu and Pesta items
    if (item.customizations && item.customizations.specialItems && 
        (item.subCategory === 'kottu' || item.subCategory === 'pesta')) {
      const specialItemsCost = item.customizations.specialItems.length * 100;
      basePrice -= specialItemsCost;
    }
    
    return basePrice;
  };

  // Function to check if item has special items
  const hasSpecialItems = (item) => {
    return item.customizations && item.customizations.specialItems && 
           item.customizations.specialItems.length > 0 &&
           (item.subCategory === 'kottu' || item.subCategory === 'pesta');
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

  const handlePromoCodeChange = (e) => {
    setPromoCode(e.target.value);
  };

  const applyPromoCode = () => {
    // In a real app, this would validate and apply the promo code
    alert(`Promo code "${promoCode}" applied!`);
  };

  const handleCheckout = () => {
    // Check if user is logged in
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      addToast('Please log in to proceed to checkout', 'info');
      navigate('/login');
      return;
    }
    
    setLoading(true);
    // Simulate a short delay for loading effect
    setTimeout(() => {
      setLoading(false);
      navigate('/checkout');
    }, 1000);
  };

  if (loading) {
    return <Loading message="Preparing your checkout..." />;
  }

  return (
    <div className="cart-page">
      <header className="cart-header">
        <h1><span className="icon">🛒</span> Your Cart</h1>
        <p>Review your items before checkout</p>
      </header>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some delicious items to your cart!</p>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => {
              return (
                <div key={item.cartKey} className="cart-item">
                  <div className="cart-item-image">
                    {item.imageUrl ? (
                      <img src={getImageUrl(item.imageUrl)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                    ) : (
                      <div className="image-placeholder">No Image</div>
                    )}
                  </div>
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    {item.customizations && (
                      <div className="customizations">
                        {item.customizations.size && (
                          <p className="size-info">Size: {item.customizations.size}</p>
                        )}
                        {item.customizations.specialInstructions && (
                          <p className="instructions-info">Instructions: {item.customizations.specialInstructions}</p>
                        )}
                        {item.customizations.specialItems && item.customizations.specialItems.length > 0 && 
                         (item.subCategory === 'kottu' || item.subCategory === 'pesta') && (
                          <p className="special-items-info">Special Items: {item.customizations.specialItems.join(', ')}</p>
                        )}
                      </div>
                    )}
                    <div className="price-breakdown">
                      <p className="cart-item-price">
                        {hasSpecialItems(item) ? (
                          <span>
                            <span className="base-price">Rs {calculateBasePrice(item).toFixed(2)}</span>
                            <span className="fee"> + Rs {(item.customizations.specialItems.length * 100).toFixed(2)} (Special Items)</span>
                            <span className="total-price"> = Rs {item.price.toFixed(2)}</span>
                          </span>
                        ) : (
                          <span>Rs {item.price.toFixed(2)}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="cart-item-quantity">
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}>
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  <div className="cart-item-total">
                    Rs {(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.cartKey)}>
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <div className="promo-code">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={handlePromoCodeChange}
              />
              <button onClick={applyPromoCode}>Apply</button>
            </div>

            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-item">
                <span>Subtotal</span>
                <span>Rs {subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span>Tax</span>
                <span>Rs {tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="summary-item discount">
                  <span>Discount</span>
                  <span>-Rs {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-item total">
                <span>Total</span>
                <span>Rs {total.toFixed(2)}</span>
              </div>
            </div>

            <button className="checkout-btn" onClick={handleCheckout} disabled={loading}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;