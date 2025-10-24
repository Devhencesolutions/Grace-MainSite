import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(50); // You can adjust the default value
  const [total, setTotal] = useState(0);

  const calculateTotals = (updatedCart) => {
    const newSubtotal = updatedCart.reduce((acc, item) => acc + item.product.originalPrice * item.count, 0);
    setSubtotal(newSubtotal);
    setTotal(newSubtotal + shippingCost);
  };

  const handleIncrement = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].count += 1;
    setCart(updatedCart);
    calculateTotals(updatedCart);
  };

  const handleDecrement = (index) => {
    const updatedCart = [...cart];
    if (updatedCart[index].count > 1) {
      updatedCart[index].count -= 1;
      setCart(updatedCart);
      calculateTotals(updatedCart);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        subtotal,
        shippingCost,
        total,
        handleIncrement,
        handleDecrement,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
