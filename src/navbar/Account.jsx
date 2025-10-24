import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2"; // Assuming SweetAlert2 is used for alerts
import { useCustomerId } from "../Components/MyContext";

const Account = () => {
  const [cartData, setCartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // const customerId = Cookies.get("CustomerId");
  const username = Cookies.get("PatientName");
  const { customerId, FetchCustomer } = useCustomerId();

  useEffect(() => {
    FetchCustomer();
  }, []);

  const fetchCartData = async () => {
    setIsLoading(true);
    try {
      if (customerId) {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/customer/getcart/${customerId}`
        );
        setCartData(response.data.cart);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    const updatedCart = Cookies.get("updatedCart");

    // Clear user-related cookies
    Cookies.remove("CustomerId");
    Cookies.remove("PatientName");
    Cookies.remove("username");
    Cookies.remove("Password");
    if (updatedCart) {
      Cookies.remove("updatedCart");
    }

    // Show logout success alert
    Swal.fire({
      title: "Logged out successfully!",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      // Redirect to home or login page
      window.location.href = "/";
    });
  };
  const firstLetter = username ? username.charAt(0).toUpperCase() : "";
  useEffect(() => {
    const handleMouseEnter = () => {
      fetchCartData();
    };

    const cartButton = document.querySelector(".cart-btn");
    if (cartButton) {
      cartButton.addEventListener("mouseenter", handleMouseEnter);
    }

    return () => {
      if (cartButton) {
        cartButton.removeEventListener("mouseenter", handleMouseEnter);
      }
    };
  }, [firstLetter]);

  // Get the first letter of the username and make it uppercase

  return (
    <div className="cart-container">
      <a className="cart-btn">
        {/* Conditionally render user icon or first letter */}
        {customerId ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: "#ed268e",
              color: "white",
              fontWeight: "bold",
              fontSize: "14px",
              marginRight: "5px",
            }}
          >
            {firstLetter}
          </div>
        ) : (
          <FaUser />
        )}
        <div className="cart-dropdown">
          <ul className="cart-items">
            <li className="nav-item">
              <Link to="/my-account" className="nav-link">
                My Account
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/my-account" state={"myOrders"} className="nav-link">
                My Orders
              </Link>
            </li>
            <li className="nav-item">
              <a href="https://patient.gracemedicalservices.in/home/login" target="_blank" state={"myOrders"} className="nav-link">
                My Panel
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#signout"
                className="nav-link"
                onClick={handleLogout} // Attach the logout handler
              >
                Sign Out
              </a>
            </li>
          </ul>
        </div>
      </a>
    </div>
  );
};

export default Account;
