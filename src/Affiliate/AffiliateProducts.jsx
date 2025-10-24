import React, { useState, useEffect } from "react";
import axios from "axios";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import Pagetitle from "../patients/Pagetitle";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import pharmacylogin from "../img/pharmacy-login2.jpg";
import { RxSlash } from "react-icons/rx";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Link, useNavigate, useParams } from "react-router-dom";
import CommonSec from "../navbar/CommonSec";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";

const validationSchema = Yup.object({
  VendorName: Yup.string().required("Vendor Name is required"),
  VendorReferenceNo: Yup.string().required("Reference Number is required"),
  VendorRegistrationDate: Yup.date().required("Registration Date is required"),
  Password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  ConfirmPassword: Yup.string()
    .oneOf([Yup.ref("Password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  ShopName: Yup.string().required("Shop Name is required"),
  VendorLicenseNumber: Yup.string().required("License Number is required"),
  VendorLicenseDate: Yup.date().required("License Date is required"),
  mobileNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Invalid Mobile Number")
    .required("Mobile Number is required"),
  EmailPersonal: Yup.string()
    .email("Invalid Email")
    .required("Personal Email is required"),
  EmailShop: Yup.string()
    .email("Invalid Email")
    .required("Shop Email is required"),
  Speciality: Yup.string().required("Category is required"),
  area: Yup.string().required("Area is required"),
  city: Yup.string().required("City is required"),
  address: Yup.string().required("Address is required"),
  photo: Yup.string().required("Photo is required"),
  IsActive: Yup.boolean(),
});

function AffiliateProducts() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [initialValues, setInitialValue] = useState({
    VendorName: "",
    VendorReferenceNo: "",
    VendorRegistrationDate: "",
    Password: "",
    // confirmpass: "",
    ShopName: "",
    VendorLicenseNumber: "",
    VendorLicenseDate: "",
    mobileNumber: "",
    EmailPersonal: "",
    EmailShop: "",
    Speciality: "",
    area: "",
    city: "",
    address: "",
    photo: null,
    UploadFile: null,
    IsActive: false,
  });

  const pharmacytermsandcondition = async () => {
    try {
      let network = "Pharmacy";
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/termsandconditionbynetwork/${network}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching days data:", error);
      return [];
    }
  };

  useEffect(() => {
    pharmacytermsandcondition();
  }, []);

  const [toggle, setToggle] = useState(false);
  const [isLoadToggle, setIsLoadToggle] = useState(false);
  const [toggleAddProduct, setToggleAddProduct] = useState(false);

  const [products, setProducts] = useState([]);
  //    const [currentPage, setCurrentPage] = useState(1);
  //       const itemsPerPage = 12;

  //       // Calculate the total number of pages
  //       const totalPages = Math.ceil(products.length / itemsPerPage);

  //       // Get the products for the current page
  //       const currentProducts = products.slice(
  //           (currentPage - 1) * itemsPerPage,
  //           currentPage * itemsPerPage
  //       );

  useEffect(() => {
    const fetchProducts = async () => {
      console.log("first");
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/affiliates-product/${id}`
        );
        // const data = await res.json();
        setProducts(res.data);
        // setNonFilteredProducts(res.data)

        // if (res.data.length < 3) {
        //     setLessThen(true)
        // }

        console.log("product list", res);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();

    // const fetchCartData = async () => {
    //     const customerId = Cookies.get("CustomerId");
    //     if (!customerId) return; // Early return if no customerId

    //     try {
    //         console.log("customerId", customerId);

    //         const response = await axios.get(
    //             `${process.env.REACT_APP_API_URL_GRACELAB}/api/customer/getcart/${customerId}`
    //         );
    //         console.log("<<<<<<<<<<<<<<<<<<<<<<<<");
    //         setCartCount(response.data.cart?.products?.length || 0); // Update cart count
    //     } catch (error) {
    //         console.error("Error fetching cart data:", error);
    //     } finally {

    //     }
    // };

    // fetchCartData();
  }, [id]);

  return (
    <>
      <CommonSec />
      <Modalnavigationbar />
      <ToastContainer />

      <div className="page-title-area">
        <Pagetitle
          heading="Affiliate"
          pagetitlelink=">"
          title1="Affiliate"
          title2="Product Details"
          IconComponent={RxSlash}
        />
      </div>

      <section className="services-area ptb-70 pb-5">
        <Container>
          {/* <Row className="justify-content-center" id="signupPanel"> */}
          {/* <div>
              <div className="text-end">
                <Button
                  className="mt-3 m-2"
                  onClick={() => {
                    setToggleAddProduct(!toggleAddProduct);
                    setToggle(false);
                  }}
                >
                  Add Product
                </Button>
                <Button
                  className="mt-3 m-2"
                //   onClick={getProfile}
                  disabled={isLoadToggle}
                >
                  {isLoadToggle ? (
                    <span>Loading...</span>
                  ) : (
                    <span>Edit Profile</span>
                  )}
                </Button>
              </div>
            </div> */}

          {/* products */}
          <div className="justify-content-center wrap d-md-flex">
            <div className="product-slider">
              <Row className="product-list">
                {products.map((product) => (
                  <Col lg={3} md={6} sm={6} className="p-3" key={product._id}>
                    <div className="product-item">
                      <Link
                          to="#"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="product-img-wrap">
                          <img
                            className="product-img"
                            src={`${process.env.REACT_APP_API_URL_GRACELAB}/${product?.imageGallery[0]}`}
                            alt={product?.name}
                            onError={(e) => {
                              e.target.src =
                                "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
                            }}
                          />
                          {/* Overlay */}
                          <div className="product-overlay">{product?.info}</div>
                        </div>
                        <div className="product-info">
                          <h3 className="product-title product-details-css">
                            {product?.name}
                          </h3>
                          <p className="product-category product-details-css">
                            <p
                              dangerouslySetInnerHTML={{
                                __html: product?.description,
                              }}
                              style={{ fontSize: "16px" }}
                            ></p>
                          </p>
                          <div className="product-price-wrapper">
                            <p className="product-price product-details-css">
                              ₹{product?.discountedPrice}
                            </p>
                            {product?.discountedPrice !==
                              product?.originalPrice && (
                              <p className="product-original-price product-details-css">
                                ₹{product?.originalPrice}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                      {/* <button
                          className="add-to-cart-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            handleEditProduct(product._id);
                          }}
                          // disabled={loading[product._id]}
                        >
                          Edit
                        </button> */}
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
          {/* </Row> */}
        </Container>
      </section>
    </>
  );
}

export default AffiliateProducts;
