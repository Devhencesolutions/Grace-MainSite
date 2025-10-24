import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCartShopping } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { Modal, Button, Form } from "react-bootstrap"; // Make sure to import Modal and Button
import Swal from "sweetalert2";
import LoginComponent from "../Components/loginComponent";
import { useCartContext } from "../Components/MyContext";

const Addtocart = () => {
  const [showLoginModal, setShowLoginModal] = useState(false); // State for modal visibility
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" }); // State for login details

  const CartCountDisplay = ({ cartCount }) => {
    return <div className="cart-count">{cartCount}</div>;
  };

  const {isLoading,
    setIsLoading,
    cartCount,
    setCartCount,
    cartData,
    setCartData,
    fetchCartData} = useCartContext()


  // Function to remove item from cart
  const handleRemoveItem = async (productId) => {
    const customerId = Cookies.get("CustomerId");
    if (!customerId) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/customer/removefromcart/${customerId}`,
        {
          data: { productId },
        }
      );
      fetchCartData(); // Refresh cart after removing product
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  // Fetch cart data when the component mounts
  useEffect(() => {
    fetchCartData(); // Ensure the cart data is fetched on load

    // Optionally keep the hover functionality if needed
    const cartButton = document.querySelector(".cart-btn");
    const handleMouseEnter = () => fetchCartData();

    if (cartButton) {
      cartButton.addEventListener("mouseenter", handleMouseEnter);
    }

    return () => {
      if (cartButton) {
        cartButton.removeEventListener("mouseenter", handleMouseEnter);
      }
    };
  }, []); // Empty dependency array ensures this runs only once on component mount

  const getTotalPrice = () => {
    if (!cartData?.products) return 0;
    return cartData.products.reduce((total, product) => {
      // Safeguard against null or missing product or discountedPrice
      const discountedPrice = product?.product?.discountedPrice || 0;
      const count = product?.count || 0;
      return total + discountedPrice * count;
    }, 0);
  };

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/userLoginPatient`,
        loginDetails
      );

      if (response.status === 200 && response.data.isOk) {
        const userData = response.data.data;
        Cookies.set("CustomerId", userData._id, { expires: 7 });
        Cookies.set("PatientName", userData.PatientName, { expires: 7 });
        Cookies.set("username", userData.Email, { expires: 7 });

        // Close the login modal and refresh cart data
        setShowLoginModal(false);
        fetchCartData();
      } else {
        Swal.fire({
          title: "Login Failed",
          text: response.data.message || "Invalid credentials",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred during login. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const [show, setshowModalappoitment]= useState(false)

  return (
    <div className="cart-container pe-3">
      <a
        className="cart-btn"
        onClick={() => !Cookies.get("CustomerId") && setShowLoginModal(true)}
      >
        <FaCartShopping />
        <CartCountDisplay cartCount={cartCount} />
        <div className="cart-dropdown">
          {!Cookies.get("CustomerId") ? (
            <p
              className="login-message"
              onClick={() => setShowLoginModal(true)}
            >
              Please log in first
            </p>
          ) : (
            cartData &&
            (cartData.products && cartData.products.length > 0 ? (
              <>
                <p>Total: Rs.{getTotalPrice()}</p>
                <ul className="cart-items">
                  {cartData.products.map((item) => (
                    <li key={item._id} className="cart-item">
                      <img
                        src={`${process.env.REACT_APP_API_URL_GRACELAB}/${item.product?.imageGallery[0]}`}
                        alt={item.product?.name}
                        width="50"
                        height="50"
                        className="product-image"
                      />
                      <div className="item-details">
                        <h4>{item.product?.name}</h4>
                        <p>Quantity: {item.count}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.product?._id)}
                        className="cancel-btn"
                      >
                        <FaTimes />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="button-container">
                  <Link
                    to="/view-cart"
                    className="btn btn-primary btn-view-cart"
                  >
                    View Cart
                  </Link>
                  <Link to="/payment" className="btn btn-primary btn-checkout">
                    Checkout
                  </Link>
                </div>
              </>
            ) : (
              <p className="empty-cart-message mb-0">Your cart is empty</p>
            ))
          )}
        </div>
      </a>

      <LoginComponent setShowLoginModal={setShowLoginModal} showLoginModal={showLoginModal} setshowModalappoitment={setshowModalappoitment}/>
  
      {/* Login Modal */}
      {/* <Modal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body className="product-login-modal">
          <Form>
            <Form.Group controlId="loginEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={loginDetails.email}
                onChange={handleLoginInputChange}
              />
            </Form.Group>

            <Form.Group controlId="loginPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={loginDetails.password}
                onChange={handleLoginInputChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <p>
                <Link
                  to="/patient-signup"
                  onClick={() => setShowLoginModal(false)}
                >
                  Click here to register
                </Link>
              </p>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleLogin}>
            Login
          </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
};

export default Addtocart;
