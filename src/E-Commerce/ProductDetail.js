import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Slider from "react-slick";
import { Container, Row, Col, Modal, Form, Button } from "react-bootstrap";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import Pagetitle from "../patients/Pagetitle";
import { MdArrowForwardIos } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/style.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import Cookies from "js-cookie";
import LoginComponent from "../Components/loginComponent";
import { useCartContext } from "../Components/MyContext";


// Configure toast notifications
// toast.configure();

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [IsLoggedIn, setIsLoggedIn] = useState(false);
  const [productID, setProductID] = useState("");

  const navigate = useNavigate();
  const userName = Cookies.get("usermail"); // Retrieves the value of 'usermail' cookie
  Cookies.get("username"); // Retrieves the value of 'username' cookie
  Cookies.get("Password"); // Retrieves the value of 'username' cookie
  const [products, setProducts] = useState([]);
   const [lessThen, setLessThen] = useState(false)
   const [temp , setshowModalappoitment] = useState(false)
   const {fetchCartData} = useCartContext()

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/product/${id}`
        );
        setProduct(response.data);
        setMainImage(response.data.imageGallery[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);


   useEffect(() => {
    const fetchProducts = async () => {
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
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleImageClick = (image) => {
    setMainImage(image);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setZoomVisible(true);
  };

  const handleMouseLeave = () => {
    setZoomVisible(false);
  };

  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(1, Math.min(product.Units, e.target.value));
    setQuantity(newQuantity);
  };

  const addToCart = async (productId) => {
    setProductID("");
    const customerId = Cookies.get("CustomerId");
    const userEmail = Cookies.get("username");

    // Check if user is already logged in by checking the cookies

    
    if (customerId && userEmail ) {
      console.log(
        "User is already logged in. Proceeding to add item to cart.",
        customerId,
        userEmail,
        productId
      );
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/customer/addtocart/${customerId}`,
          {
            // customerId,
            quantity,
            productId,
          }
        );

        console.log("add to cart res0", response);
        fetchCartData()

        if (response.status === 200 && response.data.success) {

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
      }
    } else {
      // If cookies don't exist, prompt login
      console.log("User not logged in. Showing login modal.");

      setShowLoginModal(true);
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const zoomStyle = {
    backgroundSize: "200%",
    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
  };

   const handleAddToCartClick = (productId) => {
    console.log("111111111111111111")
    const customerId = Cookies.get("CustomerId");
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>",customerId)
    if (!customerId) {
      // If user is not logged in, show login modal
      setShowLoginModal(true);
      setProductID(productId); // Store the product ID to add to cart after login
    } else {
      // If user is logged in, directly add to cart
      addToCart(productId);
    }
  };



  return (
    <>
      {/* Header Area */}
      <div
        className="copyright-area-home"
        style={{ backgroundColor: "#eb268f" }}
      >
        <Container>
          <Row className="align-items-center">
            <Col
              lg={4}
              md={12}
              sm={12}
              xs={12}
              xl={4}
               className="d-flex align-items-center gap-3"
            >
              <a
                href="tel:+919313803441"
                className="d-flex align-items-center text-white text-decoration-none"
              >
                <p className="mb-0 ms-2 text-white">+91&nbsp;93138&nbsp;03441</p>
              </a>
              <a
                href="mailto:bharat.gracemedicalservices@gmail.com"
                className="d-flex align-items-center text-white text-decoration-none"
              >
                <p className="mb-0 ms-2 text-white">bharat.gracemedicalservices@gmail.com</p>
              </a>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Navigation Bar */}

      <Modalnavigationbar />

      {/* <div className="welcome-message text-end">
        {userName ? (
          <p>
            Welcome, <strong>{userName}</strong>
          </p>
        ) : (
          <p>Welcome, Guest</p>
        )}
      </div> */}
      {/* Page Title */}
      <div className="page-title-area">
        <Pagetitle
          heading="Product Details"
          pagetitlelink="/"
          title1="Home"
          title2="Product Details"
          IconComponent={MdArrowForwardIos}
        />
      </div>

      {/* Product Details Section */}
      <section className="product-details-area ptb-120">
        <Container>
          <Row>
            <Col lg={4} md={12}>
              {/* Main Product Image with Zoom Effect */}
              <div
                className="main-image-container"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  position: "relative",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={`${process.env.REACT_APP_API_URL_GRACELAB}/${mainImage}`}
                  alt="Main Product"
                  style={{ width: "100%", borderRadius: "8px",height:'430px' }}
                />
                {zoomVisible && (
                  <div
                    className="zoomed-image"
                    style={{
                      backgroundImage: `url(${process.env.REACT_APP_API_URL_GRACELAB}/${mainImage})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "200%",
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      position: "absolute",
                      top: 0,
                      left: "105%",
                      width: "400px",
                      height: "400px",
                      border: "1px solid #ddd",
                      backgroundColor: "white",
                      zIndex: 10,
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    }}
                  />
                )}
              </div>
            </Col>

            <Col lg={6} md={12}>
              {/* Product Info */}
              <div
                className="product-info product-details-css"
                style={{
                  padding: "20px",
                  // boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  textAlign: "left",
                }}
              >
                <h2
                  style={{
                    marginBottom: "20px",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  {product?.name}
                </h2>

                <p style={{ fontSize: "16px" }}>
                  <strong className="product-details-css">SKU:</strong>{" "}
                  {product?.sku}
                </p>
                <p style={{ fontSize: "16px" }}>
                  <strong className="product-details-css">HSN Code:</strong>{" "}
                  {product?.hsnCode}
                </p>

                <p style={{ fontSize: "16px" }}>
                  <strong className="product-details-css">Category:</strong>{" "}
                  {product?.category?.Speciality}
                </p>
                <p style={{ fontSize: "16px" }}>
                  <strong className="product-details-css">Vendor:</strong>{" "}
                  {product?.vendor?.VendorName}
                </p>
                <p
                  className="product-price"
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  <strong className="product-details-css"></strong> ₹
                  {product?.discountedPrice}{" "}
                  {product?.originalPrice !== product?.discountedPrice && (
                    <span
                      className="product-original-price"
                      style={{ textDecoration: "line-through" }}
                    >
                      ₹{product?.originalPrice}
                    </span>
                  )}
                </p>
                
                <p
                  dangerouslySetInnerHTML={{ __html: product?.description }}
                  style={{ fontSize: "16px" }}
                ></p>

                <div
                  className="add-to-cart-section"
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="number"
                    value={quantity}
                    min="1"
                    max="10" // Set max to any desired number (like 5, 6, etc.)
                    onChange={handleQuantityChange}
                    className="quantity-input"
                    style={{
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      marginRight: "10px",
                      width: "80px",
                    }}
                  />

                  <button
                    className="btn btn-primary btn-login"
                  // className="add-to-cart-btn btn-login"
              onClick={() => handleAddToCartClick(product._id)}
              disabled={loading[product._id]} // Disable button while loading
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
             <Col lg={8} >
             {/* Image Carousel */}
             <Slider {...sliderSettings} className="product-image-carousel">
                {product.imageGallery.map((image, index) => (
                  <div
                    key={index}
                    className="image-thumbnail"
                    onClick={() => handleImageClick(image)}
                  >
                    <img
                      src={`${process.env.REACT_APP_API_URL_GRACELAB}/${image}`}
                      alt={`Product Thumbnail ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100px",
                        objectFit: "cover",
                        cursor: "pointer",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    />
                  </div>
                ))}
              </Slider></Col>
          </Row>
        </Container>
      </section>

      {/* Login Modal */}
      <LoginComponent setShowLoginModal={setShowLoginModal} showLoginModal={showLoginModal} setshowModalappoitment={setshowModalappoitment}/>
  
    </>
  );
};

export default ProductDetails;
