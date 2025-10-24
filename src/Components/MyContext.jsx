import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const CustomerContext = createContext();
const CartContext = createContext()

export const useCustomerId = () => useContext(CustomerContext);
export const useCartContext = () => useContext(CartContext)

export const CustomerProvider = ({ children }) => {
  const [customerId, setCustomerId] = useState(null);
  const [cartData, setCartData] = useState(null);
  const [cartCount, setCartCount] = useState(0); // Cart count state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    FetchCustomer()
  }, []);

  const FetchCustomer = () => {
    const id = Cookies.get("CustomerId");
    setCustomerId(id);
    // console.log(id)
  }

  const fetchCartData = async () => {
    const customerId = Cookies.get("CustomerId");
    if (!customerId) return; // Early return if no customerId

    setIsLoading(true);
    try {
      // console.log("customerId", customerId);

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/customer/getcart/${customerId}`
      );
      // console.log("<<<<<<<<<<<<<<<<<<<<<<<<");
      setCartData(response.data.cart);
      setCartCount(response.data.cart?.products?.length || 0); // Update cart count
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomerContext.Provider value={{
      customerId,
      FetchCustomer,
    }}>
      <CartContext.Provider value={{
        isLoading,
        setIsLoading,
        cartCount,
        setCartCount,
        cartData,
        setCartData,
        fetchCartData
      }}>
        {children}
      </CartContext.Provider>
    </CustomerContext.Provider>

  );
};


