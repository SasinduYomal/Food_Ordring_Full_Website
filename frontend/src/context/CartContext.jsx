import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Function to generate a unique key for cart items based on customizations
  const getCartItemKey = (item) => {
    const baseKey = item._id;
    if (item.customizations) {
      const customizations = item.customizations;
      const sizePart = customizations.size ? `size:${customizations.size}` : '';
      const instructionsPart = customizations.specialInstructions ? `instructions:${customizations.specialInstructions}` : '';
      const specialItemsPart = customizations.specialItems ? `specialItems:${customizations.specialItems.join(',')}` : '';
      return `${baseKey}_${sizePart}_${instructionsPart}_${specialItemsPart}`;
    }
    return baseKey;
  };

  // Function to calculate item price including special items cost
  const calculateItemPrice = (item) => {
    let price = item.price;
    
    // Add Rs.100 for each special item selected
    // Only for Kottu and Pesta items
    if (item.customizations && item.customizations.specialItems && 
        (item.subCategory === 'kottu' || item.subCategory === 'pesta')) {
      const specialItemsCost = item.customizations.specialItems.length * 100;
      price += specialItemsCost;
    }
    
    return price;
  };

  const addToCart = (item) => {
    setCartItems(prevItems => {
      // Generate a unique key for this item with its customizations
      const itemKey = getCartItemKey(item);
      
      // Check if an identical customized item already exists
      const existingItemIndex = prevItems.findIndex(cartItem => 
        cartItem.cartKey === itemKey
      );
      
      if (existingItemIndex !== -1) {
        // If exists, increase quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        // If not exists, add as new item with cartKey
        // Calculate the price including special items cost
        const priceWithFee = calculateItemPrice(item);
        
        return [
          ...prevItems,
          { 
            ...item, 
            price: priceWithFee,
            quantity: 1,
            cartKey: itemKey
          }
        ];
      }
    });
  };

  const removeFromCart = (cartKey) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartKey !== cartKey));
  };

  const updateQuantity = (cartKey, quantity) => {
    if (quantity < 1) {
      removeFromCart(cartKey);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartKey === cartKey ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};