import axios from "axios";
import { Formik } from "formik";
import Cookies from "js-cookie"; // For managing cookies
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { MdArrowForwardIos } from "react-icons/md";
import Lottie from "react-lottie";
import Swal from "sweetalert2";
import * as Yup from "yup";
import LoginComponent from "../Components/loginComponent";
import logo from "../img/logo.jpg";
import CommonSec from "../navbar/CommonSec";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import Pagetitle from "../patients/Pagetitle";


import { useNavigate } from "react-router-dom";
import failureImg from "../img/Animation - 1727072299902.json";
import successImg from "../img/Animation - 1727074423053.json";
function HomeEquipment() {
  const navigate = useNavigate();

  // States for modal, equipment selection, search and login
  const [showModal, setShowModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [equipmentsData, setEquipmentsData] = useState([]);
  const [showModalappoitment, setshowModalappoitment] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [expandedEquipment, setExpandedEquipment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [val, setVal] = useState();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Fixed number of records per page
  const [totalLength, setTotalLength] = useState(0);
  const [sucessReceipt, setSuccessReceipt] = useState(false);
  const [failurReceipt, setFailurReceipt] = useState(false);
  const [receiptModal, setReceiptModal] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState({});
  const [advertisementImages, setAdvertisementImages] = useState([]);

  // Fetch equipments using currentPage and searchInput
  const fetchEquipments = async () => {
    const skip = (currentPage - 1) * itemsPerPage;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/equipment-master/listByParams`,
        {
          skip: skip,                 
          match: searchInput,
          IsActive: true,
          per_page: itemsPerPage,
        }
      );
      // Expecting response.data[0].data for records and response.data[0].count for total count
      console.log("data?>>", response);
        setEquipmentsData(response?.data[0]?.data);
      setTotalLength(response?.data[0]?.count);
    } catch (error) {
      console.log(error);
    }
  };

  // Call fetchEquipments when searchInput or currentPage changes
  useEffect(() => {
    fetchEquipments();
  }, [searchInput, currentPage]);

  // Modal handling functions
  const handleShowModal = (equipment) => {
    setSelectedEquipment(equipment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEquipment(null);
  };

  // Pagination calculation
  const totalPages = Math.ceil(totalLength / itemsPerPage);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const fetchAdsData = async (adType = "HomeEquipment") => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/customize-advertisement?type=${adType}`
      );
      const adsData = response.data.filter((item) => item.IsActive);
      if (adsData.length > 0) {
        console.log("Found ads:", adsData.length);
        const imageUrls = adsData.map(
          (ad) => `${process.env.REACT_APP_API_URL_GRACELAB}/${ad.CustomAdsImage}`
        );
        setAdvertisementImages(imageUrls);
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };
  useEffect(() => {
    fetchAdsData("HomeEquipment");
  }, []);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };



  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  // Function to truncate description to a limited number of words
  const truncateDescription = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Cookie getter
  const getCookie = (name) => {
    return Cookies.get(name);
  };

  // Payment request handler which checks for login
  const handlePayRequestClick = (data) => {
    console.log("Payment request data:", data);
    const storedPatientName = getCookie("CustomerId");
    console.log("Stored CustomerId:", storedPatientName);
    if (storedPatientName) {
      // handlePayEquipment(data);
      console.log("selected equipment", data);
      setSelectedEquipment(data);
      setshowModalappoitment(true); // Show collection request modal if logged in
    } else {
      setshowModalappoitment(false);
      setShowLoginModal(true); // Show login modal if not logged in
    }
  };

  // Equipment payment function
  const handleSubmit2 = async (data) => {
    console.log("Equipment data:", data);
    if (data.name && data.city && data.contact && data.email) {
      setIsLoading(true);
      try {
        const availabilityCheck = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/check-equipment-availability`,
          {
            equipmentId: selectedEquipment?._id,
            cityId: data.city,
          }
        );

        // console.log("???",availabilityCheck)

        if (!availabilityCheck.data.available) {
          setIsLoading(false);
          Swal.fire({
            title: "Equipment Not Available",
            text: "This equipment is not available in your selected city. Please try another city or equipment.",
            icon: "warning",
            confirmButtonText: "OK",
          });
          return;
        }

        const storedPatientName = getCookie("CustomerId");
        const body = {
          patientName: storedPatientName,
          deposit: selectedEquipment?.deposit,
          price : selectedEquipment?.Price,
          totalAmount: selectedEquipment?.Price * data.quantity + selectedEquipment?.deposit,
          EquipmentName: selectedEquipment?._id,
          paymentMethod: "billdesk",
          isPaid: false,
          city: data.city,
          name: data.name,
          contact: data.contact,
          email: data.email,
          remarks: data.remarks,
          quantity: data.quantity,
        };
        // console.log("Request body:", body);
        
        console.log("Payment response:", availabilityCheck);
        if (availabilityCheck.data.isOk) {
          // handleSDKLaunch(res);

          const res = await axios.post(
            `${process.env.REACT_APP_API_URL_GRACELAB}/api/create/EquipmentOrder`,
            body
          );

          console.log(">>.", res)

          if(res.data.isOk){

          setIsLoading(false);
          Swal.fire({
            title: "Success!",
            text: "Equipment order submitted successfully",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            setSelectedEquipment(null);
            setshowModalappoitment(false);
            navigate("/home-equipment");
          });
        }else{
          setIsLoading(false);
          Swal.fire({
            title: "Error",
            text: "An error occurred during order. Please try again later.",
            icon: "error",
            confirmButtonText: "OK",
          }).then(() => {
            setSelectedEquipment(null);
            setshowModalappoitment(false);
            // navigate("/Equipment");
          });
        }
        } else {
          setIsLoading(false);
          Swal.fire({
            title: "Error",
            text: "An error occurred during order. Please try again later.",
            icon: "error",
            confirmButtonText: "OK",
          }).then(() => {
            setSelectedEquipment(null);
            setshowModalappoitment(false);
            // navigate("/Equipment");
          });
        }
      } catch (error) {
        setIsLoading(false);
        Swal.fire({
          title: "Error",
          text: "An error occurred during order. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error(error);
      }
    } else {
      Swal.fire({
        title: "Error",
        text: "All fields are required!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const [order_id, setOrder_id] = useState("");

  const handleSDKLaunch = (response) => {
    var responseHandler = function (txn) {
      console.log(txn);
      console.log("callback received status:: ", txn.status);
      console.log("callback received response:: ", txn.response);
      setOrder_id(txn.txnResponse.orderid);
    };

    const config = {
      flowConfig: {
        // merchantId: "BDUATV2APT",
        merchantId: "HYDGMPLBAR",
        bdOrderId: response.data.decoded.bdorderid,
        authToken: response.data.decoded.links[1].headers.authorization,
        childWindow: true,
        // returnUrl: "http://localhost:8021/api/test",
        retryCount: 0,
        prefs: {
          payment_categories: [
            "card",
            "emi",
            "nb",
            "upi",
            "wallets",
            "qr",
            "gpay",
          ],
          allowed_bins: ["459150", "525211"],
        },
        netBanking: {
          showPopularBanks: "N",
          popularBanks: ["Kotak Bank", " AXIS Bank [Retail]"],
        },
      },
      responseHandler: responseHandler,
      flowType: "payments",
      merchantLogo: logo,
    };

    const retryInterval = setInterval(() => {
      if (typeof window.loadBillDeskSdk === "function") {
        clearInterval(retryInterval);
        window.loadBillDeskSdk(config);
      } else {
        console.warn("Retrying: BillDesk SDK is not yet loaded...");
      }
    }, 500); // Retry every 500ms
  };
  useEffect(() => {
    console.log(order_id);
    const fetchOrderByOrderId = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/EquipmentOrder-By_OrderId/${order_id}`
        );
        console.log(res);
        if (res.data.isOk) {
          setReceiptDetails(res.data.customer);
          // EmptyCart(res.data.customer.customer._id)
          //   setSuccessReceipt(true)
          //   setReceiptModal(true)
          if (res.data.customer.auth_status === "transaction is successful") {
            setSuccessReceipt(true);
            setReceiptModal(true);
          }
          if (res.data.customer.auth_status === "transaction failed") {
            setFailurReceipt(true);
            setReceiptModal(true);
          } else if (
            res.data.customer.auth_status ===
              "transaction is pending for authorization" ||
            res.data.customer.status === "pending"
          ) {
            // console.log(res.data.customer.auth_status)
            console.log(res.data.customer.status === "pending");
            handleRetriveTransaction(
              res.data.customer.orderId,
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrderByOrderId();
  }, [order_id]);

  const handleRetriveTransaction = async (orderId) => {
    console.log(orderId);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/retrive-transaction`,
        { orderId: orderId }
      );
      if (res.data.decoded) {
        if (res.data.decoded.auth_status == "0300") {
          setSuccessReceipt(true);
          setReceiptModal(true);

          try {
          const notifyRes = await axios.post(
            `${process.env.REACT_APP_API_URL_GRACELAB}/api/send-notification/${orderId}`,{
              name: val.name,
              contact: val.contact,
              email: val.email,
              totalAmount: val.totalAmount,
              remarks: val.remarks
            }
          );
          console.log("Notification sent:", notifyRes);
        } catch (notifyError) {
          console.error("Failed to send notification:", notifyError);
        }
        }
      } else {
        window.alert("something went wrong!");
      }
      console.log("retrive trans", res);
    } catch (error) {
      console.log(error);
    }
  };

  const [loc, setLoc] = useState([]);
  useEffect(() => {
    const labLocation = async () => {
      try {
        const labt = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/location/city`
        );
        setLoc(labt.data);
      } catch (error) {
        console.error("Error fetching laboratory list:", error);
      }
    };
    labLocation();
  }, []);

  const [newCity, setNewCity] = useState();
  const [isCityInputMode, setIsCityInputMode] = useState(false);

  const handleInputBlur = async (e, setFieldValue) => {
    const newCategory = e.target.value.trim();

    if (newCategory) {
      const createdCategory = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/create/City`,
        { Name: newCity, IsActive: true }
      );

      if (createdCategory) {
        const labt = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/location/city`
        );
        setLoc(labt.data);

        setFieldValue("city", createdCategory.data._id);

        setIsCityInputMode(false);
        setNewCity();
      }
    }
  };

  const SignupSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Invalid email address"
      )
      .required("Email is required"),
    contact: Yup.string()
      .matches(/^\d+$/, "Contact No. must contain only digits")
      .length(10, "Contact No. must be exactly 10 digits")
      .required("Contact No. is required"),

    city: Yup.string().required("city is required"),
  });
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData:
      (failurReceipt && failureImg) || (sucessReceipt && successImg),
    renderer: "svg",
  };
  return (
    <>
      <CommonSec />
      <Modalnavigationbar navigatelink="/medical-equipments/equipment-provider-login"/>

      <div className="page-title-area">
        <Pagetitle
          heading="Medical Equipments On Rent"
          pagetitlelink="/medical-equipments/equipment-provider-register"
          registrationTitle="Equipment Provider Registration"
          title1="Home"
          title2="Network"
          IconComponent={MdArrowForwardIos}
        />
      </div>
      {/* <section className="equipments-details-area ptb-50 main-laboratory-section">
        <Container>
          <Row>
            <Col lg={12} md={12} xs={12} className="mb-0">
              <div
                className="ad-image position-relative"
                style={{ paddingBottom: 40 }}
              >
                {advertisementImages.length > 0 ? (
                  <>
                     <Carousel
                      controls={advertisementImages.length > 1}
                      indicators={advertisementImages.length > 1}
                      interval={4000}
                      prevIcon={
                        advertisementImages.length > 1 && (
                          <FaChevronCircleLeft
                            className="custom-carousel-icon"
                            style={{ fontSize: "40px", color: "#EB268F" }}
                          />
                        )
                      }
                      nextIcon={
                        advertisementImages.length > 1 && (
                          <FaChevronCircleRight
                            className="custom-carousel-icon"
                            style={{ fontSize: "40px", color: "#EB268F" }}
                          />
                        )
                      }
                    >
                      {advertisementImages.map((imageUrl, index) => (
                        <Carousel.Item key={index}>
                          <Image
                            src={imageUrl}
                            onError={(e) => {
                              console.error(
                                `Image failed to load: ${imageUrl}`
                              );
                              e.target.src = placeholder;
                            }}
                            onLoad={() => {
                              console.log(
                                `Image loaded successfully: ${imageUrl}`
                              );
                            }}
                            fluid
                            className="d-block w-100"
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </>
                ) : (
                  <>
                    <Image src={placeholder} fluid className="d-block w-100" />
                  </>
                )}
                <div className="span-title">
                  <span>Ad</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section> */}

      <div className="equipment-content container ptb-100">
        <div className="equipments-list text-center">
          <Row>
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
                      value={searchInput}
                      className="search-field"
                      placeholder="Search Equipment..."
                      onChange={handleInputChange}
                    />
                  </label>
                  <button type="submit">
                    <IoSearch />
                  </button>
                </form>
              </div>
            </div>
          </Row>
          <Row>
            {equipmentsData?.map((equipment) => (
              <Col md={3} sm={6} xs={12} key={equipment.id || equipment._id}>
                <div className="product-item mt-5" style={{ height: "auto" }}>
                  <img
                    className="w-100 img-fluid"
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginBottom: "5px",
                    }}
                    src={`${process.env.REACT_APP_API_URL_GRACELAB}/${equipment.imageGallery[0]}`}
                    alt={equipment.EquipmentName}
                  />
                  <h3
                    style={{
                      marginTop: "0px",
                      fontWeight: 600,
                      textAlign: "center",
                      color: "#eb268f",
                    }}
                  >
                    {equipment.EquipmentName}
                  </h3>
                  {/* <p className='mb-0 pb-0'>
                                        <strong>Equipment Provider :</strong> {equipment.EquipmentProvider?.EquipmentProvider}
                                    </p> */}
                  {/* <p className='mt-0 pt-0'>
                                        <strong>Equipment Category :</strong> {equipment.EquipmentCategory?.Name}
                                    </p> */}
                  <p className="equipment-description">
                    {expandedEquipment === equipment._id
                      ? equipment.Description
                      : truncateDescription(equipment.Description, 30)}
                    {equipment.Description.split(" ").length > 30 && (
                      <button
                        style={{ color: "#eb268f" }}
                        className="border-0 bg-transparent"
                        onClick={() =>
                          setExpandedEquipment(
                            expandedEquipment === equipment._id ? null : equipment._id
                          )
                        }
                      >
                        {expandedEquipment === equipment._id
                          ? "Read Less"
                          : "Read More"}
                      </button>
                    )}
                  </p>
                  <p className="text-muted" > Deposit Amount : {equipment.deposit} </p>
                  <div className="product-price-wrapper">
                    <p className="product-price product-details-css">
                      ₹ {equipment.Price} / {equipment.PricePer == 0 ? "One Time" : equipment.PricePer == 1 ? "Per Hour" : "Per Day"}
                    </p>
                  </div>
                  <button
                    className="add-to-cart-btn"
                      onClick={() => handlePayRequestClick(equipment)}
                  >
                    Book Now
                  </button>
                </div>
              </Col>
            ))}
          </Row>
          <Row>
            <div className="pagination">
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
                  className={`page-button ${
                    currentPage === index + 1 ? "active" : ""
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
            </div>
          </Row>
        </div>

        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title
              style={{
                marginTop: "0px",
                fontWeight: 600,
                textAlign: "center",
                color: "#eb268f",
              }}
            >
                {selectedEquipment?.EquipmentName}
            </Modal.Title>
          </Modal.Header>       
          <Modal.Body>{selectedEquipment?.Description}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close 
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showModalappoitment}
          onHide={() => {
            setshowModalappoitment(false);
          }}
          size="md"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title
              style={{
                marginTop: "0px",
                fontWeight: 600,
                textAlign: "center",
                color: "#eb268f",
              }}
            >
              Fill Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{
                name: "",
                email: "",
                contact: "",
                city: "",
                quantity: 1,
                amount: 0,
              }}
              validationSchema={SignupSchema}
              onSubmit={handleSubmit2}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                setFieldValue,
                // handleSubmit2,
                isSubmitting,
              }) => (
                <Form className="signin-form">
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>
                      Name <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Member Name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      isInvalid={touched.name && !!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>
                      Email id/username <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      placeholder="Member Email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      isInvalid={touched.email && !!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formContact">
                    <Form.Label>
                      Contact no <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="contact"
                      placeholder="Member Contact"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.contact}
                      isInvalid={touched.contact && !!errors.contact}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.contact}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Col className="form-group mb-3">
                    <Form.Label>
                      City <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    {!isCityInputMode ? (
                      <Form.Control
                        as="select"
                        name="city"
                        onChange={(e) => {
                          if (e.target.value === "new-city-option-id") {
                            setIsCityInputMode(true); // Switch to input field
                          } else {
                            handleChange(e);
                          }
                        }}
                        onBlur={handleBlur}
                        value={values.city}
                        isInvalid={touched.city && errors.city}
                      >
                        <option value="">Select City</option>
                        {loc &&
                          loc.map((city) => (
                            <option key={city._id} value={city._id}>
                              {city.Name}
                            </option>
                          ))}
                        <option value="new-city-option-id">
                          Other (Add New City)
                        </option>
                      </Form.Control>
                    ) : (
                      <Form.Control
                        type="text"
                        name="newCity"
                        placeholder="Enter new city"
                        onChange={(e) => setNewCity(e.target.value)}
                        onBlur={(e) => handleInputBlur(e, setFieldValue)}
                        value={newCity}
                      />
                    )}
                    <Form.Control.Feedback type="invalid">
                      {errors.city}
                    </Form.Control.Feedback>
                  </Col>

                  <Row>
                    <Col lg={4}>
                      <Form.Group className="mb-3" controlId="formContact">
                        <Form.Label>
                        {selectedEquipment?.PricePer == 0 ? "One Time" : selectedEquipment?.PricePer == 1 ? "Per Hour" : "Per Day"}
                          <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="quantity"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.quantity}
                          isInvalid={touched.quantity && !!errors.quantity}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.quantity}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col lg={4}>
                      <Form.Group className="mb-3" controlId="formContact">
                        <Form.Label>
                          Deposit Amount ₹ <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="amount"
                          disabled
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={selectedEquipment?.deposit}
                        />
                      </Form.Group>
                    </Col>
                    <Col lg={4}>
                      <Form.Group className="mb-3" controlId="formContact">
                        <Form.Label>
                          Pay Amount ₹ <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="amount"
                          disabled
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={selectedEquipment?.Price * values.quantity}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="text-end" >
                    <h5>Total Amount : ₹{(selectedEquipment?.deposit) + (selectedEquipment?.Price * values.quantity)} </h5>
                  </Row>

                  <Form.Group className="mb-3" controlId="formContact">
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control
                      type="text"
                      name="remarks"
                      placeholder="remarks"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.remarks}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="form-control btn  rounded px-3 mt-3"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit2(values);
                      setVal(values);
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Submit Now"}
                  </Button>
                </Form>
              )}
            </Formik>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setshowModalappoitment(false);
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <LoginComponent
        setShowLoginModal={setShowLoginModal}
        showLoginModal={showLoginModal}
        setshowModalappoitment={setshowModalappoitment}
      />
      <Modal
        size="md"
        show={receiptModal}
        onHide={() => {
          setReceiptModal(false);
          setSuccessReceipt(false);
          setFailurReceipt(false);
        }}
      >
        <Modal.Header>
          <img
            src={logo}
            alt="Logo"
            style={{ width: "57px", height: "auto" }} // Adjust size as needed
          />
        </Modal.Header>
        <Modal.Body>
          <h6 className="text-center">
            {failurReceipt && "Your transaction has been failed"}
            {sucessReceipt &&
              "Your transaction has been successfully processed"}{" "}
          </h6>
          <div
            style={{ marginRight: "auto", marginLeft: "auto", width: "250px" }}
          >
            <Lottie options={defaultOptions} />
          </div>
          {receiptDetails.invoiceGenrationDate && (
            <div style={{ textTransform: "capitalize" }}>
              {/* <p><strong>Status Description :</strong>{receiptDetails && receiptDetails.auth_status}</p> */}
              <p>
                <strong>Payment Mode:</strong>Online
              </p>
              {/* <p><strong>Purpose of Payment:</strong>Product Purchase Payment</p> */}
              <p>
                <strong>Amount:</strong>
                {receiptDetails && receiptDetails.totalAmount}
              </p>
              {/* {failurReceipt &&  <p><strong>Error Description : </strong>{receiptDetails && receiptDetails.transaction_error_desc}</p>} */}

              <p>
                <strong>Date:</strong>{" "}
                {receiptDetails &&
                  new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }).format(new Date(receiptDetails.invoiceGenrationDate))}
              </p>
              {/* <p><strong>Transaction Id :</strong>{receiptDetails && receiptDetails.transactionid}</p> */}
              <p>
                <strong>Order Id :</strong>
                {receiptDetails && receiptDetails.orderId}
              </p>
            </div>
          )}

          <div className="w-100 d-flex justify-content-center">
            <button
              className="btn btn-md btn-success m-2"
              style={{ marginRight: "auto", marginLeft: "auto" }}
              onClick={() => navigate("/")}
            >
              OK
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default HomeEquipment;
