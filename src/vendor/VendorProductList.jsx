import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { Button, Modal, Form, Container, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaCartShopping } from "react-icons/fa6";
import { useCartContext } from "../Components/MyContext";
import { IoCheckmarkDoneSharp, IoLocationSharp, IoCall } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import Pagetitle from "../patients/Pagetitle";
// import Modalnavigationbar from "../navbar/Modalnavigationbar";
import { MdArrowForwardIos } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import { IoSearch } from "react-icons/io5";
import "./Product.css"

export const VendorProductList = ({vendorId, toggleAddProduct, setToggleAddProduct, setSelectedProductId}) => {
    const [products, setProducts] = useState([]);
    const [nonFilteredProduct, setNonFilteredProducts] = useState([])
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
                    `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/vendor-product/${vendorId}`
                );
                // const data = await res.json();
                setProducts(res.data);
                setNonFilteredProducts(res.data)

                if (res.data.length < 3) {
                    setLessThen(true)
                }

                console.log("product list", res);

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
    const { fetchCartData } = useCartContext()
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



    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Calculate the total number of pages
    const totalPages = Math.ceil(products.length / itemsPerPage);

    // Get the products for the current page
    const currentProducts = products.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Pagination handlers
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const handlePageClick = (page) => {
        setCurrentPage(page);
    };


    const [searchQuery, setSearchQuery] = useState("");
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const [doctorSearchQuery, setDoctorSearchQuery] = useState(""); // Search query state

    const handleSearch = async(search) => {
        try{
            const res = await axios.post(`${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/products/SearchProducts`,
                {IsActive:true,match:search})
            console.log(res)
            // if(res.statusText==="OK")
                // {
                    setProducts(res.data)
                // }
        }

        catch(error)
        {
            console.log(error)
        }
    };

    const handleEditProduct = (id) => {
        setToggleAddProduct(true);
        setSelectedProductId(id);
    }

    return (
        <>
          

            {/* section start */}

            {/* <section className="services-details-area ptb-50 main-laboratory-section"> */}
                {/* <Container> */}
                    <div className="product-slider">
                        {/* <div className="all-labs">
                            <div className="widget-area">
                                <div className="widget widget_search">
                                    <form
                                        className="search-form"
                                        onSubmit={(e) => e.preventDefault()}
                                    >
                                        <label>
                                            <span className="screen-reader-text"></span>
                                            <input
                                                type="search"
                                                className="search-field"
                                                placeholder="Search Product..."
                                                value={doctorSearchQuery}
                                                onChange={(e) =>{
                                                    setDoctorSearchQuery(e.target.value)
                                                    handleSearch(e.target.value)}
                                                }
                                            />
                                        </label>
                                        <button type="submit" onClick={()=>handleSearch(doctorSearchQuery)}>
                                            <IoSearch />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div> */}

                        <Row className="product-list">
                            {currentProducts.map((product) => (
                                <Col lg={3} md={6} sm={6} className="p-3" key={product._id}>
                                <div className="product-item">
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
                                                        'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
                                                }}
                                            />
                                            {/* Overlay */}
                                            <div className="product-overlay">
                                                {/* Some hover text here
                                                Some hover text here
                                                Some hover text here
                                                Some hover text here
                                                Some hover text here
                                                Some hover text here
                                                Some hover text here
                                                Some hover text here */}
                                                    {product.info}
                                            </div>
                                        </div>
                                        <div className="product-info">
                                            <h3 className="product-title product-details-css">
                                                {product.name}
                                            </h3>
                                            <p className="product-category product-details-css">
                                                {product.category?.Speciality}
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
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleEditProduct(product._id)
                                        }}
                                        // disabled={loading[product._id]}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </Col>
                            ))}
                        </Row>

                        {/* <div className="pagination">
                            <button
                                className="page-arrow"
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1} 
                            >
                                <IoIosArrowBack /> 
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    className={`page-button ${currentPage === index + 1 ? "active" : ""
                                        }`}
                                    onClick={() => handlePageClick(index + 1)}

                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="page-arrow"
                            >
                                <IoIosArrowForward /> 

                            </button>
                        </div> */}


                      
                    </div>
                {/* </Container> */}
            {/* </section> */}
        </>

    );
}