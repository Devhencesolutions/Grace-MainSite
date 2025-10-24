import axios from "axios";
import { Formik } from "formik";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { OtpInput } from 'reactjs-otp-input';
import Swal from "sweetalert2";
import * as Yup from "yup";
import LoginComponent from "../Components/loginComponent";

const ServiceContent = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  // const [servicesData, setServicesData] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [serviceModal, setServiceModal] = useState(false);
  const [serviceCategory, setServiceCategory] = useState([]);
  const [selectedCategories, setSelectedCategory] = useState();
  const [service, setService] = useState();
  const [loc, setLoc] = useState([]);
  const [verified, setVerified] = useState(false);

  const [otp, setOtp] = useState('');

  const handleChangeOtp = (otp) => setOtp(otp);

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

  const fetchCategory = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/more-services-category`
      )
      .then((response) => {
        setServiceCategory(response.data);
        setServiceModal(true);
      });
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    const labLocation = async () => {
      try {
        const labt = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/location/city`
        );

        // const allLabListIsActive = labt.data.filter(
        //   (laboratoruisActive) => laboratoruisActive.isActive
        // );
        setLoc(labt.data);
      } catch (error) {
        console.error("Error fetching laboratory list:", error);
      }
    };
    labLocation();
  }, []);

  // const fetchServices = async () => {
  //   await axios.get(`${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/services`)
  //     .then(response => {
  //       setServicesData(response.data);
  //     }
  //   );
  // };
  // useEffect(() => {
  //   fetchServices();
  // }, []);
  const handleShowModal = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
    setOtp('');
    setVerified(false);
  };

  const handleSubmit = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/more-service-by-category/${selectedCategories}`
      )
      .then((response) => {
        setService(response.data);
        console.log(response.data);
        setServiceModal(false);
      });
  };

  const formatContent = (content) => {
    return `
    <style>
      .content-container {
        font-size: 16px; /* Base font size for all text */
        line-height: 1.6; /* Adjusted line-height for readability */
        color: black;
        margin-bottom: 20px; /* Minimal margin at the bottom */
      }
      .content-container h1, .content-container h2, .content-container h3, .content-container h4 {
        font-weight: bold;
        text-align: center;
        color: black;
        font-size: 20px; /* Single font size for all headings */
        margin-top: 20px; /* Minimal spacing above headings */
        margin-bottom: 10px; /* Minimal spacing below headings */
      }
      .content-container p {
        text-align: justify;
        margin-bottom: 15px; /* Reduced margin for paragraphs */
        color: black; /* Ensure text color is black */
      }
      .content-container img {
        display: block;
        margin: 20px auto; /* Reduced margin for uniform spacing */
        max-width: 100%;
        height: auto;
      }
      .content-container table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0; /* Reduced margin for tables */
      }
      .content-container table, .content-container th, .content-container td {
        border: 1px solid #ddd;
        padding: 10px; /* Reduced padding for tables */
      }
      .content-container th {
        text-align: center;
        background-color: #f2f2f2;
        font-weight: bold;
        font-size: 16px; /* Single font size for table headings */
        color: black; /* Ensure table header text color is black */
      }
      .content-container td {
        text-align: center;
        font-size: 16px; /* Single font size for table content */
        color: black; /* Ensure table content text color is black */
      }
      .content-container * {
        color: black !important; /* Force all text to be black */
      }
      .content-container p, .content-container li, .content-container tr td {
        font-size: 16px !important;
      }
    </style>
    <div class="content-container">
      ${content}
    </div>
  `;
  };

  const getCookie = (name) => {
    return Cookies.get(name);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);

  const handleSubmit2 = async (values) => {
    try {
      const storedPatientName = getCookie("CustomerId");

      if (storedPatientName) {
        setIsLoading(true);

        // First verify the OTP
        const verifyResponse = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/verify-otp`,
          {
            phoneNumber: values.contact,
            otp
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(verifyResponse);
        console.log("verifyResponse.data.isOk", verifyResponse.data.isOk);

        if (!verifyResponse.data.isOk) {

          console.log("verifyResponse.data.message",);
          Swal.fire({
            title: "Error!",
            text: verifyResponse.data.message || "Invalid OTP",
            icon: "error",
            confirmButtonText: "OK",
          });
          setIsLoading(false);
          return;
        }else{

          console.log("else");

        // If OTP verification is successful, submit the form
        const formData = {
          patientName: storedPatientName,
          ServiceName: service._id,
          ServiceProvider: "",
          city: values.city,
          name: values.name,
          contact: values.contact,
          email: values.email,
          remarks: values.remarks
        };

        // API call
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/more-services-request`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("response create service", response);

        if (response.data.isOk) {
          let provider = response.data.matchingProvider
          Swal.fire({
            title: "Service Provider Details",
            html: `
              <div style="text-align: left;">
                <p><strong>Service Provider:</strong> ${provider.ContactPersonName}</p>
                <p><strong>Contact Number:</strong> ${provider.ContactNo}</p>
                <p><strong>Email:</strong> ${provider.Email}</p>
              </div>
            `,
            icon: "success",
            confirmButtonText: "OK"
          }).then(() => {
            setShowModal(false)
            navigate("/Service");
            setOtp('');
            setVerified(false);
          });
        } else {
          console.log("response create service error", response);
          throw new Error(response.data.message || "Failed to create");
        }

        setIsLoading(false);
      }
      } else {
        setShowLoginModal(true);
      }
    } catch (error) {
      console.error("Error creating Member:", error);

      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to create",
        icon: "error",
        confirmButtonText: "OK",
      });

      setIsLoading(false);
    }
  };

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


  const validateForm = (values) => {
    let errors = {};
  

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(values.email)) {
      errors.email = "Invalid email format";
    }
  

    if (!values.name) {
      errors.name = "Name is required";
    }
  

    if (!values.contact) {
      errors.contact = "Phone number is required";
    } else if (!/^\d{10}$/.test(values.contact)) {
      errors.contact = "Invalid phone number (must be 10 digits without country code)";
    }
  

    if (!values.city) {
      errors.city = "City is required";
    }
  
    return errors;
  };

  const sendOTP = async (phoneNumber) => {
    setIsSendingOTP(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/send-otp-to-verify-service`,
        { phoneNumber },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.data.isOk) {
        Swal.fire({
          title: "Error!",
          text: response?.data?.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        setVerified(true);
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to send OTP. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSendingOTP(false);
    }
  };
  

  return (
    <div className="service-content container ptb-100">
      <div className="services-list text-center">
        {selectedCategories && !serviceModal && service ? (
          <Row>
            <Col md={4} sm={6} xs={12}>
              <div className="product-item mt-5">
                <img
                  className="w-100 img-fluid h-full"
                  style={{
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "5px",
                  }}
                  src={`${process.env.REACT_APP_API_URL_GRACELAB}/${service?.imageGallery[0]}`}
                  alt={service?.Name}
                />

                <h3
                  style={{
                    marginTop: "0px",
                    fontWeight: 600,
                    marginBottom: "30px",
                    textAlign: "center",
                    color: "#eb268f",
                  }}
                >
                  {service?.ServiceName}
                </h3>
              </div>
            </Col>
            <Col md={6} sm={6} xs={12}>
              <div key={service?.id} className="product-item mt-5">
                {/* <img className='w-100 img-fluid h-full'
                  style={{
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "5px",

                  }}
                  src={`${process.env.REACT_APP_API_URL_GRACELAB}/${service.Image}`} alt={service.Name} /> */}

                <div
                  style={{
                    margin: "20px",
                    maxHeight: "100%", // Limit height to prevent overflow
                    overflow: "auto", // Hide overflow
                    // textOverflow: "ellipsis",  // Show "..."
                    // display: "-webkit-box",
                    // WebkitLineClamp: 3,  // Limit to 3 lines
                    // WebkitBoxOrient: "vertical",
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatContent(service?.Description),
                    }}
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={() => {
                    const storedPatientName = getCookie("CustomerId");
                    if (storedPatientName) {
                      setShowModal(true);
                    } else {
                      setShowLoginModal(true);
                    }
                  }}
                >
                  Get More Details
                </Button>
              </div>
            </Col>
          </Row>
        ) :  <h4>No records found!</h4> }
      </div>

      <Modal show={serviceModal} onHide={() => setServiceModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {serviceCategory.map((category) => (
              <Form.Check
                key={category._id}
                type="radio"
                name="selectedCategories"
                label={category.Name}
                checked={selectedCategories === category._id}
                onChange={() => setSelectedCategory(category._id)}
              />
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button> */}
          <Button variant="primary" disabled={!selectedCategories} onClick={handleSubmit}>
            Find
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={handleCloseModal} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title
            style={{
              marginTop: "0px",
              fontWeight: 600,
              textAlign: "center",
              color: "#eb268f",
            }}
          >
            {service?.ServiceName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              patientName: "",
              ServiceName: "",
              ServiceProvider: "",
              name: "",
              email: "",
              contact: "",
              city: "",
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
                    Phone number <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="contact"
                    placeholder="10-digit phone number"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.contact}
                    isInvalid={touched.contact && !!errors.contact}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.contact}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Enter 10-digit number without country code
                  </Form.Text>
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

                <Form.Group className="mb-3" controlId="formContact">
                  <Form.Label>
                    Remarks
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="remarks"
                    placeholder="remarks"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.remarks}
                  />
                 
                </Form.Group>

                {verified &&
               <>
               <p style={{ color: "#eb268f"}}>Enter OTP sent to your phone</p>
               <div style={{display: "flex"}}>
                <OtpInput 
                value={otp} 
                onChange={handleChangeOtp} 
                numInputs={6} 
                separator={<span>-</span>}
                renderInput={(props) => <input {...props}/>}
                inputStyle={{
                  width: "40px",
                  height: "40px",
                  margin: "0 5px",
                  fontSize: "20px",
                  borderRadius: "5px",
                  border: "1px solid #eb268f",
                  textAlign: "center",
                }}
                isInputNum={true}
                />
                </div>
                </>}
                {verified ? 
                <Button
                 variant="primary"
                  type="submit"
                  className="form-control btn  rounded px-3 mt-3"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit2(values);
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit Now"}
                </Button> : 
                <button
                variant="primary"
                type="button"
                 className="form-control btn  rounded px-3 mt-3 custom-btn"
                 onClick={async () => {
                  const errors = await validateForm(values);
                  if (Object.keys(errors).length === 0) {
                    try {
                      const availabilityCheck = await axios.post(
                        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/check-more-service-availability`,
                        {
                          serviceId: service?._id,
                          cityId: values.city
                        }
                      );

                      if (!availabilityCheck.data.available) {
                        Swal.fire({
                          title: "Service Not Available",
                          text: "This service is not available in your selected city. Please try another city or service.",
                          icon: "warning",
                          confirmButtonText: "OK"
                        });
                        return;
                      }

                      // If service is available, proceed with OTP
                      sendOTP(values.contact); // Send OTP to phone number instead of email
                    } catch (error) {
                      console.error("Error checking service availability:", error);
                      Swal.fire({
                        title: "Error",
                        text: "Failed to check service availability. Please try again.",
                        icon: "error",
                        confirmButtonText: "OK"
                      });
                    }
                  }
                  else
                  {
                    Swal.fire({
                      title: "Error!",
                      text: "Please fill all the required fields",
                      icon: "error",
                      confirmButtonText: "OK",
                    });
                  }
                }}
                 disabled={isLoading || isSendingOTP}
               >
                 {isSendingOTP ? "Sending OTP..." : isLoading ? "Verifying..." : "Verify"}
               </button>}
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <LoginComponent
        setShowLoginModal={setShowLoginModal}
        showLoginModal={showLoginModal}
        setshowModalappoitment={setShowModal}
      />
    </div>
  );
};

export default ServiceContent;
