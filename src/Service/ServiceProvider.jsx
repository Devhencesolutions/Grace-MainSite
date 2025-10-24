import React, { useEffect, useState } from "react";
import CommonSec from "../navbar/CommonSec";
import { RxSlash } from "react-icons/rx";
import Pagetitle from "../patients/Pagetitle";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import { Modal, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import LoginComponent from "../Components/loginComponent";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { IoSearch } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdArrowForwardIos } from "react-icons/md";
import { useParams } from "react-router-dom";

function ServiceProvider() {
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [servicesData, setServicesData] = useState([]);
  const [showModalappoitment, setshowModalappoitment] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [expandedService, setExpandedService] = useState(null);

  const {id} = useParams();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Fixed number of records per page
  const [totalLength, setTotalLength] = useState(0);

  // Fetch services using currentPage and searchInput
  const fetchServices = async () => {
    const skip = (currentPage - 1) * itemsPerPage;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/more-services-request/provider/${id}`
      );

      setServicesData(response?.data);
      setTotalLength(response?.data.length);
    } catch (error) {
      console.log(error);
    }
  };

  // Call fetchServices when searchInput or currentPage changes
  useEffect(() => {
    fetchServices();
  }, [searchInput, currentPage]);

  // Modal handling functions
  const handleShowModal = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  // Pagination calculation
  const totalPages = Math.ceil(totalLength / itemsPerPage);

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
      handlePayService(data);
      setshowModalappoitment(true); // Show collection request modal if logged in
    } else {
      setShowLoginModal(true); // Show login modal if not logged in
    }
  };

  // Service payment function
  const handlePayService = async (data) => {
    console.log("Service data:", data);
    try {
      const storedPatientName = getCookie("CustomerId");
      const body = {
        patientName: storedPatientName,
        totalAmount: data.Price,
        ServiceName: data._id,
        paymentMethod: "billdesk",
        isPaid: false,
      };
      console.log("Request body:", body);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/create/ServiceOrder`,
        body
      );
      console.log("Payment response:", res);
      if (res.data.isOk) {
        Swal.fire({
          title: "Success!",
          text: "Service submitted successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "An error occurred during order. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred during order. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error(error);
    }
  };

  return (
    <>
      <CommonSec />
      <Modalnavigationbar />

      <div className="page-title-area">
        <Pagetitle
          heading="Service Provider"
          pagetitlelink="/"
          title1="Home"
          title2="Services"
          IconComponent={MdArrowForwardIos}
        />
      </div>
      <div className="service-content container ptb-100">
        <div className="services-list text-center">
          {/* <Row>
                        <div className="widget-area">
                            <div className="widget widget_search">
                                <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                                    <label>
                                        <span className="screen-reader-text"></span>
                                        <input
                                            type="search"
                                            value={searchInput}
                                            className="search-field"
                                            placeholder="Search Service..."
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <button type="submit">
                                        <IoSearch />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </Row> */}
          <Row>
            {servicesData?.map((service) => (
              <Col md={3} sm={6} xs={12} key={service._id}>
                <div className="product-item mt-5" style={{ height: "auto" }}>
                  {/* <img
                                        className='w-100 img-fluid'
                                        style={{
                                            height: "200px",
                                            objectFit: "cover",
                                            borderRadius: "10px",
                                            marginBottom: "5px",
                                        }}
                                        src={`${process.env.REACT_APP_API_URL_GRACELAB}/${service.imageGallery[0]}`}
                                        alt={service.ServiceName}
                                    /> */}
                  <h3
                    style={{
                      marginTop: "0px",
                      fontWeight: 600,
                      textAlign: "center",
                      color: "#eb268f",
                    }}
                  >
                    {service.ServiceName?.ServiceName}
                  </h3>
                 
                  <hr/>
                  <p className="mb-0 pb-0">
                    <strong>Customer Name :</strong>{" "}
                    {service.patientName?.PatientName}
                  </p>
                  <p className="mb-0 pb-0">
                    <strong>Email :</strong> {service.email}
                  </p>
                  <p className="mb-0 pb-0">
                    <strong>Contact No :</strong> {service.contact}
                  </p>
                  <p className="mt-0 pt-0">
                    <strong>City :</strong> {service.city?.Name}
                  </p>
                  <p className="mt-0 pt-0">
                    <strong>Remarks :</strong> {service.remarks}
                  </p>
                  <p className="mt-0 pt-0">
                    <strong>Requested On :</strong>{" "}
                    {new Date(service.createdAt).toLocaleDateString("en-GB")}
                  </p>
                  {/* <p className="service-description">
                                        {expandedService === service._id
                                            ? service.Description
                                            : truncateDescription(service.Description, 30)}
                                        {service.Description.split(" ").length > 30 && (
                                            <button
                                                style={{ color: "#eb268f" }}
                                                className="border-0 bg-transparent"
                                                onClick={() =>
                                                    setExpandedService(expandedService === service._id ? null : service._id)
                                                }
                                            >
                                                {expandedService === service._id ? "Read Less" : "Read More"}
                                            </button>
                                        )}
                                    </p> */}

                  <button
                    className="add-to-cart-btn"
                    onClick={() => handlePayRequestClick(service)}
                  >
                    Upload Bill
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
              {selectedService?.ServiceName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{selectedService?.Description}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
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
    </>
  );
}

export default ServiceProvider;
