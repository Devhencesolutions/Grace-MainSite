import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaCartShopping } from "react-icons/fa6";
import { useCartContext } from "../Components/MyContext";
import { FaArrowRightLong } from "react-icons/fa6";


const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState({}); // Track loading state for each product
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [productID, setProductID] = useState(null); // Store productID for cart addition after login
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("CustomerId"));
    const [cartCount, setCartCount] = useState(0); // Cart count state


  const [lessThen, setLessThen] = useState(false)
  useEffect(() => {
    const fetchProducts = async () => {
      console.log("first")
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/products`
        );
        // const data = await res.json();
        setProducts(res.data);
        
        if(res.data.length<3)
        {
          setLessThen(true)
        }
        
        console.log("product list",res);
        
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();

    const fetchCartData = async () => {
    const customerId = Cookies.get("CustomerId");
    if (!customerId) return; // Early return if no customerId

 
    try {
      console.log("customerId", customerId);

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/customer/getcart/${customerId}`
      );
      console.log("<<<<<<<<<<<<<<<<<<<<<<<<");
      setCartCount(response.data.cart?.products?.length || 0); // Update cart count
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
     
    }
  };

  fetchCartData();
  }, [cartCount]);

  const handleAddToCartClick = (productId) => {
    const customerId = Cookies.get("CustomerId");
    if (!customerId) {
      // If user is not logged in, show login modal
      setShowLoginModal(true);
      setProductID(productId); // Store the product ID to add to cart after login
    } else {
      // If user is logged in, directly add to cart
      addToCart(productId);
    }
  };
  const {fetchCartData} = useCartContext()
  const addToCart = async (productId) => {
    const customerId = Cookies.get("CustomerId");

    if (customerId) {
      // Set loading to true for the specific product
      setLoading((prev) => ({ ...prev, [productId]: true }));

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/customer/addtocart/${customerId}`,
          {
            productId,
            quantity: 1, // You can change quantity as needed
          }
        );

        if (response.status === 200 && response.data.success) {
          fetchCartData()
          Swal.fire({
            title: "Success",
            text: "Item added to cart successfully!",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Failed to add item to cart. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error("Error adding item to cart:", error);
        Swal.fire({
          title: "Error",
          text: "An error occurred while adding the item to the cart.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        // Set loading to false after the process is completed
        setLoading((prev) => ({ ...prev, [productId]: false }));
      }
    }
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
        // Cookies.set("Password", userData.Password, { expires: 7 });

        setIsLoggedIn(true);
        setShowLoginModal(false);

        // Automatically add the product to the cart after login
        if (productID) {
          addToCart(productID);
          setProductID(null); // Reset the product ID
        }
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

const settings = {
  dots: false,
  infinite: products.length > 3, // Only enable infinite scrolling if more than 3 items
  speed: 500,
  slidesToShow: Math.min(products.length, 4), // Show the number of items if less than 4
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: Math.min(products.length, 3), // Adjust for 1024px breakpoint
        slidesToScroll: 1,
        infinite: products.length > 3, // Disable infinite scroll if fewer than 3 items
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: Math.min(products.length, 2), // Adjust for 768px breakpoint
        slidesToScroll: 1,
        infinite: products.length > 2, // Disable infinite scroll if fewer than 2 items
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: Math.min(products.length, 1), // Adjust for 480px breakpoint
        slidesToScroll: 1,
        infinite: products.length > 1, // Disable infinite scroll if fewer than 1 item
      },
    },
  ],
};

  return (
    <div className="product-slider">
      <div className="d-flex justify-content-between">
      <h5 style={{color:'#eb268f',fontWeight:"bolder"}}>Products</h5>
      <Link to = "/product-list"><p style={{color:"#eb268f", fontSize:'15px'}}> View All products <FaArrowRightLong /></p></Link>
      </div>
      <Slider {...settings}>
        {products.map((product) => (
          <div
            className="product-item"
            key={product._id}
            
          >
            <Link
              to={`/product-details/${product._id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="product-img-wrap">
                <img
                  className="product-img"
                  src={`${process.env.REACT_APP_API_URL_GRACELAB}/${product.imageGallery[0]}`}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src =
                      "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
                  }}
                />
              </div>
              <div className="product-info">
                <h3 className="product-title product-details-css">
                  {product?.name}
                </h3>
                <p className="product-category product-details-css">
                  {product?.category?.Speciality || "NA"}
                </p>
                <div className="product-price-wrapper">
                  <p className="product-price product-details-css">
                    ₹{product.discountedPrice}
                  </p>
                  {product.discountedPrice !== product.originalPrice && (
                    <p className="product-original-price product-details-css">
                      ₹{product.originalPrice}
                    </p>
                  )}
                </div>
              </div>
            </Link>
            <button
              className="add-to-cart-btn"
              onClick={() => handleAddToCartClick(product._id)}
              disabled={loading[product._id]} // Disable button while loading
            >
              Add to Cart
            </button>
          </div>
        ))}
      </Slider>

      {/* Login Modal */}
<Modal
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

      {/* Add "Click here to register" link below the password field */}
      <div className="d-flex justify-content-end">
        <p>
          <Link to="/patient-signup" onClick={() => setShowLoginModal(false)}>
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
</Modal>

    </div>
  );
};

export default ProductSlider;
