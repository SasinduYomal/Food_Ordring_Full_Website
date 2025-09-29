import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    paymentMethod: 'credit-card'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setOrderDetails(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setOrderDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePaymentMethodChange = (method) => {
    setOrderDetails(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    setIsProcessing(true);
    
    try {
      // Prepare payment data
      const paymentData = {
        amount: total,
        currency: 'inr',
        customerInfo: {
          name: orderDetails.name,
          email: orderDetails.email,
          phone: orderDetails.phone
        },
        address: orderDetails.address
      };

      // Process payment based on selected method
      const paymentResult = await paymentService.initializePayment(
        paymentData, 
        orderDetails.paymentMethod
      );

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment processing failed');
      }

      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          menuItem: item._id || item.id,
          quantity: item.quantity,
          price: item.price,
          // Include customizations if they exist
          customizations: item.customizations ? {
            specialInstructions: item.customizations.specialInstructions,
            specialItems: item.customizations.specialItems
          } : undefined
        })),
        totalAmount: total,
        deliveryAddress: orderDetails.address,
        paymentMethod: orderDetails.paymentMethod,
        paymentStatus: paymentResult.status,
        transactionId: paymentResult.transactionId
      };

      // Place the order
      const newOrder = await orderService.createOrder(orderData);
      
      // Store a client-friendly copy for guest order history
      const clientOrder = {
        _id: newOrder._id,
        createdAt: newOrder.createdAt || new Date().toISOString(),
        status: newOrder.status || 'pending',
        totalAmount: newOrder.totalAmount,
        items: cartItems.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
      };
      try { localStorage.setItem('lastOrder', JSON.stringify(clientOrder)); } catch (_) {}

      // Dispatch a custom event to notify other components (like Profile) that a new order was placed
      window.dispatchEvent(new CustomEvent('orderPlaced', { detail: newOrder }));
      
      // Clear cart and show confirmation
      clearCart();
      addToast('Order placed successfully!', 'success');
      navigate('/orders');
    } catch (error) {
      console.error('Order placement error:', error);
      addToast(`Error placing order: ${error.message}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <h1>Checkout</h1>
        <div className="empty-cart-message">
          <p>Your cart is empty.</p>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/menu')}
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
      </div>

      <div className="checkout-grid">
        <div className="card">
          <h2 className="section-title">Billing Information</h2>
          <form onSubmit={handlePlaceOrder}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" value={orderDetails.name} onChange={handleInputChange} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={orderDetails.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" value={orderDetails.phone} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address.street">Street Address</label>
              <input type="text" id="address.street" name="address.street" value={orderDetails.address.street} onChange={handleInputChange} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address.city">City</label>
                <input type="text" id="address.city" name="address.city" value={orderDetails.address.city} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="address.state">State</label>
                <input type="text" id="address.state" name="address.state" value={orderDetails.address.state} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address.zipCode">ZIP Code</label>
                <input type="text" id="address.zipCode" name="address.zipCode" value={orderDetails.address.zipCode} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="address.country">Country</label>
                <input type="text" id="address.country" name="address.country" value={orderDetails.address.country} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <div className="payment-options">
                <div className={`payment-option ${orderDetails.paymentMethod === 'credit-card' ? 'selected' : ''}`} onClick={() => handlePaymentMethodChange('credit-card')}>
                  <label className="payment-option-label">
                    <span className="payment-option-icon">💳</span>
                    <div className="payment-option-text">
                      <div>Credit Card</div>
                      <div className="payment-option-description">Pay with Visa, Mastercard, or American Express</div>
                    </div>
                  </label>
                  <input type="radio" name="paymentMethod" value="credit-card" checked={orderDetails.paymentMethod === 'credit-card'} onChange={() => handlePaymentMethodChange('credit-card')} />
                </div>

                <div className={`payment-option ${orderDetails.paymentMethod === 'paypal' ? 'selected' : ''}`} onClick={() => handlePaymentMethodChange('paypal')}>
                  <label className="payment-option-label">
                    <span className="payment-option-icon">🅿</span>
                    <div className="payment-option-text">
                      <div>PayPal</div>
                      <div className="payment-option-description">Pay with your PayPal account</div>
                    </div>
                  </label>
                  <input type="radio" name="paymentMethod" value="paypal" checked={orderDetails.paymentMethod === 'paypal'} onChange={() => handlePaymentMethodChange('paypal')} />
                </div>

                <div className={`payment-option ${orderDetails.paymentMethod === 'cash-on-delivery' ? 'selected' : ''}`} onClick={() => handlePaymentMethodChange('cash-on-delivery')}>
                  <label className="payment-option-label">
                    <span className="payment-option-icon">💵</span>
                    <div className="payment-option-text">
                      <div>Cash on Delivery</div>
                      <div className="payment-option-description">Pay in cash when your order is delivered</div>
                    </div>
                  </label>
                  <input type="radio" name="paymentMethod" value="cash-on-delivery" checked={orderDetails.paymentMethod === 'cash-on-delivery'} onChange={() => handlePaymentMethodChange('cash-on-delivery')} />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className="card order-summary">
          <h2 className="section-title">Order Summary</h2>
          <div className="summary-list">
            {cartItems.map(item => (
              <div key={item._id || item.id} className="summary-row">
                <span>{item.name} x {item.quantity}</span>
                <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-list" style={{ marginTop: 12 }}>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs {subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>Rs {tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>Rs {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;