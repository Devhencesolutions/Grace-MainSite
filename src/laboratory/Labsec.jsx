import axios from "axios";
import { ErrorMessage, Field, Formik, Form as FormikForm } from "formik";
import Cookies from "js-cookie"; // You can use js-cookie library for managing cookies
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Image, Modal, Row } from "react-bootstrap";
import { FaMapMarker } from "react-icons/fa";
import { IoMdTimer } from "react-icons/io";
import ReactStars from "react-rating-stars-component";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import LoginComponent from "../Components/loginComponent";
import labplaceholder from "../img/labplaceholder.jpg";

function Labsec(props) {
  const [dayName, setDayName] = useState("");
  const [dayName2, setDayName2] = useState("");
  const [dayName3, setDayName3] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [ratingshowModal, setRatingShowModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    Description: "",
    myFile: null,
  });
  const [rating, setRating] = useState(0);

  const [doctors, setDoctors] = useState([]);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginValues, setLoginValues] = useState({
    patientName: "",
    password: "",
  });

  const PatientName = Cookies.get("PatientName") || "";
  const CustomerId = Cookies.get("CustomerId") || "";

  // Utility to get cookies
  const getCookie = (name) => {
    return Cookies.get(name);
  };

  // Utility to set cookies
  const setCookie = (name, value) => {
    Cookies.set(name, value, { expires: 7 }); // Set cookie to expire in 7 days
  };

  // Function to handle Collection Request button click
  const handleCollectionRequestClick = () => {
    const storedPatientName = getCookie("PatientName");

    if (storedPatientName) {
      setShowCollectionModal(true); // Show collection request modal if patientName exists in cookies
    } else {
      setShowLoginModal(true); // Show login modal if patientName does not exist
    }
  };

  const handlerateUsRequestClick = () => {
    const storedPatientName = getCookie("PatientName");

    if (storedPatientName) {
      setRatingShowModal(true); // Show collection request modal if patientName exists in cookies
    } else {
      setShowLoginModal(true); // Show login modal if patientName does not exist
    }
  };

  // Fetch doctors when the modal opens
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/listDoctors`
        );
        setDoctors(response.data); // Adjust based on your API response structure
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    if (showCollectionModal) {
      fetchDoctors();
    }
  }, [showCollectionModal]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDayName = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/Days/${props.dayslab1}`
        );
        setDayName(response.data.Days);
      } catch (error) {
        console.error("Error fetching day name:", error);
      }
    };

    const fetchDayName2 = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/Days/${props.dayslab2}`
        );
        setDayName2(response.data.Days);
      } catch (error) {
        console.error("Error fetching day name:", error);
      }
    };

    const fetchDayName3 = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/Days/${props.dayslab3}`
        );
        setDayName3(response.data.Days);
      } catch (error) {
        console.error("Error fetching day name:", error);
      }
    };

    fetchDayName();
    fetchDayName2();
    fetchDayName3();
  }, [props.dayslab1, props.dayslab2, props.dayslab3]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (file && validTypes.includes(file.type)) {
      setFormData({ ...formData, myFile: file });
    } else {
      // Provide feedback if the file type is not supported
      alert("Only JPG, JPEG, and PNG files are supported.");
      e.target.value = null; // Clear the input
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    contactNumber: Yup.string()
      .matches(/^\d+$/, "Contact No. must contain only digits")
      .length(10, "Contact No. must be exactly 10 digits")
      .required("Contact No. is required"),
    myFile: Yup.mixed().required("File is required"),
    // Description: Yup.string().required("Description is required"),
  });

  const validationSchemaRating = Yup.object().shape({
    name: Yup.string().required("required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", values.name);
      formDataToSend.append("email", values.email);
      formDataToSend.append("contactNumber", values.contactNumber);
      formDataToSend.append("Description", values.Description || "");
      formDataToSend.append("myFile", values.myFile);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/create/Contactlaboratory/${props.Labid}`,
        formDataToSend
      );

      Swal.fire({
        icon: "success",
        title: "Form Submitted!",
        text: "Your form has been submitted successfully.",
        confirmButtonText: "Ok",
      }).then(() => {
        setShowModal(false);
        resetForm();
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again.",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleRatingSubmit = async (values, { resetForm }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/create/ContactRating`,
        {
          name: values.name,
          rating: rating,
          Laboratory: props.Labid,
          Patient: Cookies.get("CustomerId") || "",
        }
      );
      if (response.data.isOk) {
        Swal.fire({
          icon: "success",
          title: "Rating Submitted!",
          text: "Your rating has been submitted successfully.",
          confirmButtonText: "Ok",
        }).then(() => {
          resetForm();
          setRatingShowModal(false);
        });
      } else if (response.data.isOk === false) {
        Swal.fire({
          icon: "warning",
          title: "Rating Cannot be Submitted!",
          text: response.data.message,
          confirmButtonText: "Ok",
        }).then(() => {
          resetForm();
          setRatingShowModal(false);
        });
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again.",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleChat = () => {
    navigate(`/chat/${props.Labid}`);
  };

  const handleLogin = async (loginDetails) => {
    try {
      console.log("Sending login request...", loginDetails); // Debugging axios request

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/userLoginPatient`,
        loginDetails
      );

      console.log("Login response:", response.data); // Debugging response

      if (response.status === 200 && response.data.isOk) {
        const userId = response.data.data._id;
        const userName = response.data.data.PatientName;
        const userEmail = response.data.data.Email;
        const userPassword = response.data.data.Password;

        // Debug: Logging before setting cookies
        console.log("Setting cookies...", { userId, userName, userEmail });

        // Store data in cookies instead of localStorage
        Cookies.set("CustomerId", userId, { expires: 7 });
        Cookies.set("PatientName", userName, { expires: 7 }); // Make sure to store the PatientName as well

        Cookies.set("username", userEmail, { expires: 7 });
        Cookies.set("Password", userPassword, { expires: 7 });

        console.log("Cookies set successfully"); // Debugging after cookies are set

        setShowLoginModal(false);
        setShowCollectionModal(true); // Show collection request modal after successful login
      } else {
        setLoginError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error); // Catching and logging the error
      setLoginError("Something went wrong. Please try again.");
    }
  };

  const isClosed = dayName2 === "Sat(closed)" || dayName2 === "Sun(closed)";

  return (
    <>
      <Card className="single-research-box">
        <Row>
          <Col lg={6} md={6} sm={12}>
            <div className="research-image image-size-fix">
              <Link
                to={props.imagelink}
                target="_blank"
                className="image-size-fix"
              >
                <Image
                  src={props.hospitalimage}
                  alt="Laboratory Image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = labplaceholder;
                  }}
                  className="image-size-fix"
                />
              </Link>
            </div>
          </Col>
          <Col lg={6} md={6} sm={12}>
            <Card.Body className="research-content">
              <h3>
                <Link to="#" className="heading-change capitalize-text">
                  {props.mainheading}
                </Link>
              </h3>
              <div className="location-marker-section">
                <Link to={props.locationmap} target="_blank">
                  <h5 className="mt-3 d-inline-block me-2">
                    <div className="heading-container">
                      <FaMapMarker className="map-color" />
                      <div className="heading-text capitalize-text">
                        {props.headings}
                      </div>
                    </div>
                  </h5>
                </Link>
              </div>
              <div className="location-marker-section">
                <h5 className="mt-3 d-inline-block me-2">
                  <IoMdTimer className="map-color" /> {props.starttime1} -{" "}
                  {props.endtime1} - {dayName}
                  <br /> <br />
                  <IoMdTimer className="map-color" />
                  {
                    isClosed
                      ? `${dayName2}` // Only show the day name if it's closed
                      : `${props.starttime2} - ${props.endtime2} - ${dayName2}` // Show start time, end time, and day name
                  }
                  <br /> <br />
                  <IoMdTimer className="map-color" />
                  {
                    isClosed
                      ? `${dayName3}` // Only show the day name if it's closed
                      : `${props.starttime3} - ${props.endtime3} - ${dayName3}` // Show start time, end time, and day name
                  }
                </h5>
              </div>
              <ReactStars
                count={5}
                size={24}
                activeColor="#ffd700"
                value={
                  props.averageRating ? parseFloat(props.averageRating) : 0
                }
                edit={false}
                //  isHalf={true} // Enable half stars
              />
              <Button
                variant="primary"
                className="mt-3 float-end contact-sec inner-btn"
                style={{ borderRadius: 10 }}
                onClick={() => setShowModal(true)}
              >
                Contact
              </Button>
              <Button
                variant="primary"
                className="mt-3 float-end contact-sec inner-btn"
                style={{ borderRadius: 10 }}
                onClick={handleCollectionRequestClick}
              >
                Collection Request
              </Button>

              <Button
                className="mt-3 ml-3 float-end contact-sec inner-btn"
                style={{ borderRadius: 10 }}
                onClick={() => handlerateUsRequestClick()}
              >
                Rate us
              </Button>

              {/* <Button className="mt-3 float-end chat-sec" onClick={handleChat}>
                Chat
              </Button> */}
            </Card.Body>
          </Col>
        </Row>
      </Card>

      {/* Contact Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title-centered">
            Contact {props.mainheading}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              name: "",
              email: "",
              contactNumber: "",
              myFile: null,
              Description: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              setFieldValue,
              errors,
              touched,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>
                    Name <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Field
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    className={`form-control ${
                      touched.name && errors.name ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>
                    Email address <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Field
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    className={`form-control ${
                      touched.email && errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formContactNumber">
                  <Form.Label>
                    Contact Number <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Field
                    type="text"
                    name="contactNumber"
                    value={values.contactNumber}
                    onChange={handleChange}
                    className={`form-control ${
                      touched.contactNumber && errors.contactNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter your contact number"
                  />
                  <ErrorMessage
                    name="contactNumber"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formFile">
                  <Form.Label>
                    Upload File <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="myFile"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(event) => {
                      setFieldValue("myFile", event.currentTarget.files[0]);
                    }}
                    isInvalid={!!errors.myFile}
                  />
                  <ErrorMessage
                    name="myFile"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Field
                    type="text"
                    name="Description"
                    value={values.Description}
                    onChange={handleChange}
                    className="form-control"
                    // className={`form-control ${
                    //   touched.Description && errors.Description
                    //     ? "is-invalid"
                    //     : ""
                    // }`}
                    placeholder="Enter your Description"
                  />
                  {/* <ErrorMessage
                    name="Description"
                    component="div"
                    className="text-danger"
                  /> */}
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Rating Modal */}
      <Modal show={ratingshowModal} onHide={() => setRatingShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rating {props.mainheading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              name: "",
            }}
            validationSchema={validationSchemaRating}
            onSubmit={handleRatingSubmit}
          >
            {({ values, handleChange, handleSubmit, errors, touched }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formRating">
                  <Form.Label className="modal-title-centered">
                    Rate Us
                  </Form.Label>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ReactStars
                      count={5}
                      size={48}
                      activeColor="#ffd700"
                      value={rating}
                      onChange={handleRatingChange}
                    />
                  </div>
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formRatingDescription">
                  <Form.Label>Description</Form.Label>
                  <Field
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    className={`form-control ${
                      touched.name && errors.name ? "is-invalid" : ""
                    }`}
                    // placeholder="Enter your name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* collaction modal requste */}
      <Modal
        show={showCollectionModal}
        onHide={() => setShowCollectionModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Collection Request {props.mainheading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              PatientName: Cookies.get("PatientName") || "",
              CustomerId: Cookies.get("CustomerId") || "",
              doctorId: "", // Doctor ID instead of name
              phone: "",
              address: "",
              email: "",
              prescription: null, // File input
              remarks: "",
              collectionDate: "", // Collection Date
              collectionTime: "", // Collection Time
            }}
            validationSchema={Yup.object().shape({
              PatientName: Yup.string().required("PatientName is required"),
              // doctorId: Yup.string().required("Doctor is required"), // Validation for doctor ID
              phone: Yup.string()
                .matches(/^\d+$/, "Phone must contain only digits")
                .required("Phone is required"),
              address: Yup.string(),
              email: Yup.string().email("Invalid email").optional(),
              // prescription: Yup.mixed().required("Prescription is required"), // File validation
              remarks: Yup.string().optional(),
              collectionDate: Yup.date().required(
                "Collection Date is required"
              ), // Date validation
              collectionTime: Yup.string().required(
                "Collection Time is required"
              ), // Time validation
            })}
            onSubmit={async (values, { resetForm }) => {
              const formData = new FormData();
              formData.append("patientName", CustomerId);
              formData.append("DoctorId", values.doctorId); // Pass only doctor ID
              formData.append("phoneNumber", values.phone);
              formData.append("address", values.address);
              formData.append("email", values.email);
              formData.append("myFile", values.prescription); // Append file
              formData.append("remarks", values.remarks);
              formData.append("collectionDate", values.collectionDate); // Append date
              formData.append("collectionTime", values.collectionTime); // Append time
              formData.append("labId", props.Labid); // Append the labId passed via props

              try {
                // Submit form data to your API
                await axios.post(
                  `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/create/CollectionRequest`,
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  }
                );
                Swal.fire({
                  icon: "success",
                  title: "Request Submitted!",
                  text: "Your collection request has been submitted successfully.",
                  confirmButtonText: "Ok",
                }).then(() => {
                  setShowCollectionModal(false);
                  resetForm();
                });
              } catch (error) {
                console.error("Error submitting collection request:", error);
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Something went wrong! Please try again.",
                  confirmButtonText: "Ok",
                });
              }
            }}
          >
            {({
              handleSubmit,
              handleChange,
              setFieldValue,
              values,
              errors,
              touched,
            }) => (
              <FormikForm noValidate onSubmit={handleSubmit}>
                <Row>
                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="formPatientName">
                      <Form.Label>
                        Member Name <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="PatientName"
                        readOnly
                        value={values.PatientName}
                        onChange={handleChange}
                        isInvalid={touched.PatientName && errors.PatientName}
                        placeholder="Enter Member Name"
                      />
                      <ErrorMessage
                        name="PatientName"
                        component="div"
                        className="text-danger"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPhone">
                      <Form.Label>
                        Phone <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        isInvalid={touched.phone && errors.phone}
                        placeholder="Enter Phone"
                      />
                      <ErrorMessage
                        name="phone"
                        component="div"
                        className="text-danger"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formCollectionDate">
                      <Form.Label>
                        Collection Date <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="collectionDate"
                        value={values.collectionDate}
                        onChange={handleChange}
                        isInvalid={
                          touched.collectionDate && errors.collectionDate
                        }
                        min={new Date().toISOString().split("T")[0]} // Set min to today’s date
                      />
                      <ErrorMessage
                        name="collectionDate"
                        component="div"
                        className="text-danger"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formAddress">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        placeholder="Enter Address"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formRemarks">
                      <Form.Label>Remarks</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="remarks"
                        value={values.remarks}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Any remarks..."
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="formDoctorId">
                      <Form.Label>
                        Doctor Name<span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="doctorId"
                        value={values.doctorId} // Store only doctor ID
                        onChange={handleChange}
                        isInvalid={touched.doctorId && errors.doctorId}
                      >
                        <option value="">Select Doctor</option>
                        {doctors.map((doctor) => (
                          <option key={doctor._id} value={doctor._id}>
                            {doctor.DoctorName}
                          </option>
                        ))}
                      </Form.Control>
                      <ErrorMessage
                        name="doctorId"
                        component="div"
                        className="text-danger"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        placeholder="Enter Email"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formCollectionTime">
                      <Form.Label>
                        Collection Time <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="time"
                        name="collectionTime"
                        value={values.collectionTime}
                        onChange={handleChange}
                        isInvalid={
                          touched.collectionTime && errors.collectionTime
                        }
                      />
                      <ErrorMessage
                        name="collectionTime"
                        component="div"
                        className="text-danger"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPrescription">
                      <Form.Label>Prescription</Form.Label>
                      <Form.Control
                        type="file"
                        name="prescription"
                        onChange={(event) => {
                          setFieldValue(
                            "prescription",
                            event.currentTarget.files[0]
                          ); // Set file
                        }}
                        // isInvalid={touched.prescription && errors.prescription}
                      />
                      {/* <ErrorMessage
                        name="prescription"
                        component="div"
                        className="text-danger"
                      /> */}
                    </Form.Group>
                  </Col>
                </Row>
                <Button type="submit" variant="primary" className="text-end">
                  Submit
                </Button>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* patient login modal */}
      <LoginComponent
        setShowLoginModal={setShowLoginModal}
        showLoginModal={showLoginModal}
        setshowModalappoitment={setShowCollectionModal}
      />

      {/* <Modal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={loginValues}
            validationSchema={Yup.object().shape({
              email: Yup.string().required("email is required"),
              password: Yup.string().required("Password is required"),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await handleLogin(values);
              } catch (error) {
                console.error("Error logging in:", error);
                setLoginError("Something went wrong. Please try again.");
              }
              setSubmitting(false);
            }}
          >
            {({ handleSubmit, handleChange, values, errors, touched }) => (
              <FormikForm noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formPatientName">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={touched.email && errors.email}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={touched.password && errors.password}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>

                {loginError && (
                  <div className="text-danger mb-3">{loginError}</div>
                )}

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

                <Button type="submit" variant="primary">
                  Login
                </Button>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
      </Modal> */}
    </>
  );
}

export default Labsec;
