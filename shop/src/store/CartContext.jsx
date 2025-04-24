import React, { createContext, useState, useContext } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [quickCheckoutProduct, setQuickCheckoutProduct] = useState({})


  const addQuickCheckoutProduct = (product) => {
    setQuickCheckoutProduct(product)
  }

  const addToCart = (product) => {
    setCart([...cart, product]);
    toast.success("Product added in cart")
  };

  const removeFromCart = (productId) => {
    console.log(productId)
    setCart(cart.filter((item,index) => index !== productId));
  };

  const removeAllProductsFromCart = () => {
    setCart([])
  }

  const updateQuantity = (productId, quantity) => {
    setCart(
      cart.map((item,index) =>
        index === productId ? { ...item, quantity: quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.salePrice * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, removeAllProductsFromCart, calculateTotal, addQuickCheckoutProduct, quickCheckoutProduct }}>
      {children}
    </CartContext.Provider>
  );
};
