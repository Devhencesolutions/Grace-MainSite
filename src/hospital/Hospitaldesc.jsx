import React, { useState, useEffect } from "react";
import { FaMapMarker } from "react-icons/fa";
import { IoMdTimer } from "react-icons/io";
import { Link } from "react-router-dom";
import { Card, Col, Image, Row, Button, Modal, Form, Tooltip, OverlayTrigger } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReactStars from "react-rating-stars-component";
import hospitalplaceholder from "../img/Hospitalplaceholder.jpg";
import Cookies from "js-cookie"; // You can use js-cookie library for managing cookies
import placeholder from "../img/placeholder-banner-panel.png";
import LoginComponent from "../Components/loginComponent";

function Hospitaldesc(props) {
  const [dayName, setDayName] = useState("");
  const [dayName2, setDayName2] = useState("");
  const [dayName3, setDayName3] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    Description: "",
    file: null,
  });
  const [rating, setRating] = useState(0);
  const [ratingshowModal, setRatingShowModal] = useState(false);

  const [doctorData, setDoctorData] = useState(null); // Store fetched data
  const [docotorshowModal, setdocotorshowModal] = useState(false); // Handle modal display
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error handling
  const [loginValues, setLoginValues] = useState({
    patientName: "",
    password: "",
  });
  const [showModalappoitment, setshowModalappoitment] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [doctorspecialist, setdoctorspecialist] = useState(null);
  const [times, settimes] = useState([]);
  const [data, setData] = useState([]);
  const CustomerId = Cookies.get("CustomerId") || "";

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const isClosed = dayName2 === "Sat(closed)" || dayName2 === "Sun(closed)";

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

    fetchDayName();

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

    fetchDayName2();

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

    fetchDayName3();
  }, [props.dayslab1, props.dayslab2, props.dayslab3]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    contactNumber: Yup.string()
      .matches(/^\d+$/, "Contact No. must contain only digits")
      .length(10, "Contact No. must be exactly 10 digits")
      .required("Contact No. is required"),
    Description: Yup.string().required("Description is required"),
    file: Yup.mixed().required("File is required"),
  });

  const validationSchemaRating = Yup.object().shape({
    name: Yup.string().required("Name is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", values.name);
      formDataToSend.append("email", values.email);
      formDataToSend.append("contactNumber", values.contactNumber);
      formDataToSend.append("Description", values.Description);
      formDataToSend.append("myFile", values.file);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/create/Contacthospital/${props.Labid}`,
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
          Hospital: props.Labid,
          Patient:Cookies.get("CustomerId") || ""
        }
      );

      if(response.data.isOk)
        {
          Swal.fire({
            icon: "success",
            title: "Rating Submitted!",
            text: "Your rating has been submitted successfully.",
            confirmButtonText: "Ok",
          }).then(() => {
            resetForm();
            setRatingShowModal(false);
          });
        }
        else if(response.data.isOk === false)
        {
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

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/getHospitalUser/${props.Labid}`
      );
      console.log("hospital data ", response.data);

      setDoctorData(response.data); // Store fetched data
      setdocotorshowModal(true); // Open modal
    } catch (err) {
      setError("Failed to fetch doctor details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAppointment = async (values, { resetForm }) => {
    setLoading(true); // Set loading to true when submission starts
    try {
      const formData = new FormData();
      formData.append("patientName", Cookies.get("PatientName") || ""); // Assuming PatientName comes from cookies
      formData.append("disease", values.disease);
      formData.append("phone", values.phone);
      formData.append("symptoms", values.symptoms);
      formData.append("email", values.email || ""); // Optional email field
      values.reports.forEach((file) => {
        formData.append("prescriptionUpload", file); // Handle multiple files upload
      });
      formData.append("appointmentDate", values.date);
      formData.append("appointmentTime", values.time);
      formData.append("doctorId", props.Labid); // Make sure Labid is passed as props correctly

      // Make the API call
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/appointments`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } } // Set correct headers for file upload
      );

      // Success handling
      Swal.fire({
        icon: "success",
        title: "Appointment booked!",
        text: "Your appointment has been successfully booked.",
        confirmButtonText: "Ok",
      });

      setshowModalappoitment(false); // Hide modal after submission
      resetForm(); // Reset the form
    } catch (error) {
      console.error("Error submitting appointment:", error);

      // Error handling
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again.",
        confirmButtonText: "Ok",
      });
    } finally {
      setLoading(false); // Reset loading state in finally block
    }
  };

  const getCookie = (name) => {
    return Cookies.get(name);
  };
  const handleCollectionRequestClick = () => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>");
    const storedPatientName = getCookie("PatientName");

    if (storedPatientName) {
      setshowModalappoitment(true); // Show collection request modal if patientName exists in cookies
      fetchhospitaldata();
    } else {
      setShowLoginModal(true); // Show login modal if patientName does not exist
    }
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
        setshowModalappoitment(true); // Show collection request modal after successful login
      } else {
        setLoginError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error); // Catching and logging the error
      setLoginError("Something went wrong. Please try again.");
    }
  };

  const generateTimeSlots = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const slots = [];

    while (start <= end) {
      const timeString = start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      slots.push(timeString);
      start.setMinutes(start.getMinutes() + 30); // Increment by 30 minutes
    }

    return slots;
  };

  const fetchhospitaldata = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/getHospitalUser/${props.Labid}`
      );
      console.log("doctor data", response.data);
      setData(response.data);

      // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      const currentDay = new Date().getDay();

      let startTime, endTime;

      // Set OPD time slots based on the day of the week
      if (currentDay >= 1 && currentDay <= 5) {
        // Monday to Friday
        startTime = response.data.OPD1StartTime;
        endTime = response.data.OPD1EndTime;
      } else if (currentDay === 6) {
        // Saturday
        startTime = response.data.OPD2StartTime;
        endTime = response.data.OPD2EndTime;
      } else if (currentDay === 0) {
        // Sunday
        startTime = response.data.OPD3StartTime;
        endTime = response.data.OPD3EndTime;
      }

      // Generate time slots based on the selected day’s time range
      settimes(generateTimeSlots(startTime, endTime));
      console.log("Generated time slots", times);

      // Show the modal
      setshowModalappoitment(true);
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      // Handle the error, e.g., show an alert or message to the user
    }
  };

  const Hospitalspecilist = async () => {
    try {
      const SpecilityHoapital = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/HospitalSpeciality`
      );

      const specilityisactive = SpecilityHoapital.data.filter(
        (specialityisactive) => specialityisactive.IsActive
      );
      setdoctorspecialist(specilityisactive);
    } catch (error) {
      console.log("Hospital Speciality error  :", error);
    }
  };

  useEffect(() => {
    Hospitalspecilist();
  }, []);


  const handlerateUsRequestClick = () => {
    const storedPatientName = getCookie("PatientName");

    if (storedPatientName) {
      setRatingShowModal(true); // Show collection request modal if patientName exists in cookies
    } else {
      setShowLoginModal(true); // Show login modal if patientName does not exist
    }
  };

  return (
    <>
      <Card className="single-research-box">
        <Row>
          <Col lg={6} md={6} sm={12}>
            <div className="research-image network image-size-fix">
              <Link
              style={{cursor: "auto"}}
                className="image-size-fix"
              >
                <Image
                  src={props.hospitalimage}
                  alt="Hospital Image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = hospitalplaceholder;
                  }}
                  className="image-size-fix"
                />
              </Link>
            </div>
          </Col>
          <Col lg={6} md={6} sm={12}>
            <Card.Body className="research-content">
              <h3>
                <Link
                 to={(props.imagelink && props.imagelink !== null && props.imagelink !== undefined && props.imagelink !== "undefined" && props.imagelink.trim() !== "") ? props.imagelink : "" }
                 target={(props.imagelink && props.imagelink !== null && props.imagelink !== undefined && props.imagelink !== "undefined" && props.imagelink.trim() !== "") && "_blank"}
                 className="heading-change capitalize-text">
                  {props.mainheading}
                </Link>
              </h3>
              <div className="location-marker-section">
                <Link to={(props.locationmap && props.locationmap !== null && props.locationmap !== undefined && props.locationmap !== "undefined" && props.locationmap.trim() !== "") ? props.locationmap : ""} target={(props.locationmap && props.locationmap !== null && props.locationmap !== undefined && props.locationmap !== "undefined" && props.locationmap.trim() !== "")&&"_blank"}>
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
              {props.discInfo && props.discInfo != 0 ? <p><b><span class="blink">{props.discInfo} </span></b></p> : null}
              <div className="location-marker-section">
                {props.SpecialityDetails && props.SpecialityDetails.length > 0 ? (
                  <h5 className="mt-3 d-inline-block me-2">
                    Hospital Speciality:
                  <span>
                  { 
                        props.SpecialityDetails?.map((speciality, index) => (
                          <>{index !== 0 && ", " }{speciality.Speciality}</>
                        ))
                      }
                      
                  </span>
                  </h5>) : null}
                  {/* <IoMdTimer className="map-color" /> {props.starttime1} -{" "}
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
                  } */}
              </div>
              <div>
                <ReactStars
                  count={5}
                  size={24}
                  activeColor="#ffd700"
                  value={props.averageRating ? props.averageRating : 0}
                  edit={false}
                />
              </div>
              <OverlayTrigger
                 placement="top" // Position of the tooltip (top, right, bottom, left)
                 overlay={<Tooltip id="button-tooltip">For Hospitalization</Tooltip>}
              >
              <Button
                variant="primary"
                className="mtb-3 float-end contact-sec inner-btn"
                style={{ borderRadius: 10 }}
                onClick={() => setShowModal(true)}
              >
                Book & Connect
                </Button>
              </OverlayTrigger>
              {/* <Button
                variant="primary"
                className="mtb-3 ml-3 float-end contact-sec inner-btn"
                style={{ borderRadius: 10 }}
                onClick={handleCollectionRequestClick}
              >
                Appoitment
              </Button> */}
              <Button
                variant="primary"
                className="mtb-3 ml-3 float-end contact-sec inner-btn"
                style={{ borderRadius: 10 }}
                onClick={fetchDoctorDetails}
                disabled={loading} // Disable button while loading
              >
                {loading ? "Loading..." : "Profile"}
              </Button>
              <Button
                className="mtb-3 ml-3 float-end contact-sec inner-btn"
                style={{ borderRadius: 10 }}
                onClick={() => handlerateUsRequestClick()}
              >
                Rate us
              </Button>
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
              Description: "",
              file: null,
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
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={touched.name && !!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>
                    Email address <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={touched.email && !!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formContactNumber">
                  <Form.Label>
                    Contact Number <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your contact number"
                    name="contactNumber"
                    value={values.contactNumber}
                    onChange={handleChange}
                    isInvalid={touched.contactNumber && !!errors.contactNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.contactNumber}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>
                    Upload File <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => {
                      setFieldValue("file", e.currentTarget.files[0]);
                    }}
                    isInvalid={touched.file && !!errors.file}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.file}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDescription">
                  <Form.Label>
                    Description <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter your message"
                    name="Description"
                    value={values.Description}
                    onChange={handleChange}
                    isInvalid={touched.Description && !!errors.Description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.Description}
                  </Form.Control.Feedback>
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
            {({ handleSubmit, handleChange, values, errors, touched }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formRating">
                  <Form.Label className="modal-title-centered ">
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
                </Form.Group>
                <Form.Group className="mb-3" controlId="formRatingName">
                  <Form.Label>Description</Form.Label>
                  <Field
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    className="form-control"
                    isInvalid={touched.name && !!errors.name}
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

      {/* hospital profile shown  */}

      <Modal
        show={docotorshowModal}
        size="lg"
        onHide={() => setdocotorshowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Profile {props.mainheading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {doctorData ? (
            <div>
              <img
                src={`${process.env.REACT_APP_API_URL_GRACELAB}/${doctorData.Hospitalphoto}`}
                alt={doctorData.HospitalName}
                style={{
                  width: "159px",
                  height: "122px",
                  borderRadius: "22px",
                  marginBottom: "20px", // Space below the image
                }}
                onError={(e) => {
                  e.target.src = placeholder; // Set the fallback image in case of an error
                }}
              />
              <div className="row">
                <div className="col-6">
                  <h5>{doctorData.HospitalName}</h5>
                  <p>
                    <span className="profile-show">Clinic Name:</span>{" "}
                    {doctorData.ClinicName}
                  </p>
                  <p>
                    <span className="profile-show">Email Hospital:</span>{" "}
                    {doctorData.EmailHospital}
                  </p>
                  <p>
                    <span className="profile-show">Contact:</span>{" "}
                    {doctorData.mobileNumber}
                  </p>
                  <p>
                    <span className="profile-show">OPD1 end time:</span>{" "}
                    {doctorData.OPD1EndTime}-{doctorData.DaysHospital1.Days}
                  </p>

                  <p>
                    <span className="profile-show"> OPD2 start time:</span>{" "}
                    {doctorData.OPD2StartTime}-{doctorData.DaysHospital2.Days}
                  </p>

                  <p>
                    <span className="profile-show">OPD3 start time:</span>{" "}
                    {doctorData.OPD3StartTime}-{doctorData.DaysHospital3.Days}
                  </p>
                </div>
                <div className="col-6">
                  <p>
                    <span className="profile-show">City:</span>{" "}
                    {doctorData.city.Name}
                  </p>
                  <p>
                    <span className="profile-show">Address:</span>{" "}
                    {doctorData.address}
                  </p>
                  {/* <p>Speciality ID: {doctorData.Speciality}</p> */}
                  <p>
                    <span className="profile-show">Speciality:</span>{" "}
                    {doctorData.Speciality.Speciality}
                  </p>
                  {/* <p>Loyalty Points: {doctorData.LoyaltyPoints}</p> */}
                  <p>
                    <span className="profile-show">OPD1 start time:</span>{" "}
                    {doctorData.OPD1StartTime}-{doctorData.DaysHospital1.Days}
                  </p>
                  <p>
                    <span className="profile-show">OPD2 end time:</span>{" "}
                    {doctorData.OPD2EndTime}-{doctorData.DaysHospital2.Days}
                  </p>
                  <p>
                    <span className="profile-show">OPD3 end time:</span>{" "}
                    {doctorData.OPD3EndTime}-{doctorData.DaysHospital3.Days}
                  </p>
                  <p>
                    <span className="profile-show">Area:</span>{" "}
                    {doctorData.area}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p>No data available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setdocotorshowModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* hospital appoitment modal */}

      <Modal
        size="lg"
        show={showModalappoitment}
        onHide={() => setshowModalappoitment(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Book an Appointment with {props.mainheading}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              PatientName: Cookies.get("PatientName") || "",
              disease: "",
              phone: "",
              symptoms: "",
              email: "",
              reports: [],
              date: "",
              time: "",
            }}
            onSubmit={handleSubmitAppointment}
          >
            {({ setFieldValue, errors, touched }) => (
              <FormikForm>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formName">
                      <Form.Label>Member Name *</Form.Label>
                      <Field
                        name="PatientName"
                        type="text"
                        readOnly
                        placeholder="Enter Member name"
                        className={`form-control ${
                          errors.PatientName && touched.PatientName
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      <ErrorMessage
                        name="PatientName"
                        component="div"
                        className="invalid-feedback"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formDisease">
                      <Form.Label>Speciality *</Form.Label>
                      <Field
                        as="select"
                        name="disease"
                        className={`form-control ${
                          errors.disease && touched.disease ? "is-invalid" : ""
                        }`}
                      >
                        <option value="" label="Select disease" />
                        {doctorspecialist.map((Symptom) => (
                          <option key={Symptom._id} value={Symptom._id}>
                            {Symptom.Speciality}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="disease"
                        component="div"
                        className="invalid-feedback"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formPhone">
                      <Form.Label>Phone Number *</Form.Label>
                      <Field
                        name="phone"
                        type="text"
                        placeholder="Enter phone number"
                        className={`form-control ${
                          errors.phone && touched.phone ? "is-invalid" : ""
                        }`}
                      />
                      <ErrorMessage
                        name="phone"
                        component="div"
                        className="invalid-feedback"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formSymptoms">
                      <Form.Label>Symptoms *</Form.Label>
                      <Field
                        name="symptoms"
                        type="text"
                        placeholder="Enter symptoms"
                        className={`form-control ${
                          errors.symptoms && touched.symptoms
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      <ErrorMessage
                        name="symptoms"
                        component="div"
                        className="invalid-feedback"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formEmail">
                      <Form.Label>Email (Optional)</Form.Label>
                      <Field
                        name="email"
                        type="email"
                        placeholder="Enter email"
                        className="form-control"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formDate">
                      <Form.Label>Appointment Date *</Form.Label>
                      <Field
                        name="date"
                        type="date"
                        className={`form-control ${
                          errors.date && touched.date ? "is-invalid" : ""
                        }`}
                        min={new Date().toISOString().split("T")[0]} // Set minimum date to today
                      />
                      <ErrorMessage
                        name="date"
                        component="div"
                        className="invalid-feedback"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formTime">
                      <Form.Label>Appointment Time *</Form.Label>
                      <Field
                        as="select"
                        name="time"
                        className={`form-control ${
                          errors.time && touched.time ? "is-invalid" : ""
                        }`}
                      >
                        <option value="" label="Select time" />
                        {times.map((time, index) => (
                          <option key={index} value={time}>
                            {time}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="time"
                        component="div"
                        className="invalid-feedback"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formReports">
                      <Form.Label>Upload Reports *</Form.Label>
                      <input
                        name="reports"
                        type="file"
                        multiple
                        className="form-control"
                        onChange={(event) =>
                          setFieldValue(
                            "reports",
                            Array.from(event.currentTarget.files)
                          )
                        }
                      />
                      {errors.reports && touched.reports && (
                        <div className="invalid-feedback d-block">
                          {errors.reports}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Button
                  variant="primary"
                  type="submit"
                  className="mt-3"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}{" "}
                  {/* Change button text based on loading state */}
                </Button>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* patient login modal */}
      <LoginComponent setShowLoginModal={setShowLoginModal} showLoginModal={showLoginModal} setshowModalappoitment={setshowModalappoitment}/>
  

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

export default Hospitaldesc;
