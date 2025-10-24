import React, { useState, useEffect } from "react";
import { FaMapMarker } from "react-icons/fa";
import { IoMdTimer } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  Col,
  Image,
  Row,
  Button,
  Modal,
  Form,
  ModalFooter,
  Spinner,
} from "react-bootstrap";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import ReactStars from "react-rating-stars-component";
import doctorplaceholder from "../img/doctorplaceholder.png";
import Cookies from "js-cookie"; // You can use js-cookie library for managing cookies
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import placeholder from "../img/placeholder-banner-panel.png";
import LoginComponent from "../Components/loginComponent";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  contactNumber: Yup.string()
    .matches(/^\d+$/, "Contact No. must contain only digits")
    .length(10, "Contact No. must be exactly 10 digits")
    .required("Contact No. is required"),
  description: Yup.string().required("Description is required"),
  file: Yup.mixed().required("File is required"),
});

const ratingValidationSchema = Yup.object().shape({
  name: Yup.string().required("required"),
});

// apooitment modal validation

const validationSchemaappoitment = Yup.object().shape({
  disease: Yup.string().required("Disease is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  date: Yup.date().required("Date is required"),
  time: Yup.string().required("Time is required"),
});

const Doctordes = (props) => {
  const [dayName, setDayName] = useState("");
  const [dayName2, setDayName2] = useState("");
  const [dayName3, setDayName3] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [ratingShowModal, setRatingShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [times, settimes] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [doctorData, setDoctorData] = useState(null); // Store fetched data
  const [docotorshowModal, setdocotorshowModal] = useState(false); // Handle modal display
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error handling
  const [data, setData] = useState([]);
  const [loadingap, setloadingap] = useState(false); // Add this state to your component
  const [loginValues, setLoginValues] = useState({
    patientName: "",
    password: "",
  });
  const [showModalappoitment, setshowModalappoitment] = useState(false);
  const CustomerId = Cookies.get("CustomerId") || "";
  // const { _ID } = useParams();
  const doctorId = localStorage.getItem("_id");

  const [symptomwise, setsymptomwise] = useState([]);

  const Doctorsymtoms = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/DiseasesSymptoms`
      );
      const activeSymptoms = response.data.filter(
        (symptom) => symptom.IsActive
      );
      console.log("doctor symtoms", response);

      setsymptomwise(activeSymptoms);
    } catch (error) {
      console.log("doctor symptoms:", error);
    }
  };

  useEffect(() => {
    Doctorsymtoms();
  }, []);

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

  useEffect(() => {
    setRating(props.averageRating);
  }, [props.averageRating]);

  useEffect(() => {
    const fetchDayNames = async () => {
      try {
        const response1 = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/Days/${props.dayslab1}`
        );
        setDayName(response1.data.Days);

        const response2 = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/Days/${props.dayslab2}`
        );
        setDayName2(response2.data.Days);

        const response3 = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/Days/${props.dayslab3}`
        );
        setDayName3(response3.data.Days);
      } catch (error) {
        console.error("Error fetching day names:", error);
      }
    };
    fetchDayNames();
  }, [props.dayslab1, props.dayslab2, props.dayslab3]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("contactNumber", values.contactNumber);
      formData.append("Description", values.description);
      formData.append("myFile", values.file);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/create/Contactdoctor/${props.Labid}`,
        formData
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
          Doctor: props.Labid,
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
    setRatingShowModal(false);
  };

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/getDoctorDetails/${props.Labid}`
      );
      console.log("doctor data ", response.data);

      setDoctorData(response.data); // Store fetched data
      setdocotorshowModal(true); // Open modal
    } catch (err) {
      setError("Failed to fetch doctor details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // appoitment
  const handleSubmitAppointment = async (values, { resetForm }) => {
    console.log("tenp");
    setloadingap(true);
    try {
      const formData = new FormData();
      formData.append("patientName", CustomerId); // Assuming PatientName comes from cookies
      formData.append("disease", values.disease);
      formData.append("phoneNumber", values.phone);

      formData.append("symptoms", values.symptoms);
      formData.append("email", values.email || ""); // Optional email field

      // Append files
      if (values.prescription) {
        formData.append("prescriptionUpload", values.prescription);
      }
      if (values.testReport) {
        formData.append("testReportUpload", values.testReport);
      }
      if (values.xrayReport) {
        formData.append("xrayReportUpload", values.xrayReport);
      }

      formData.append("appointmentDate", values.date);
      formData.append("appointmentTime", values.time);
      formData.append("doctorId", props.Labid); // Pass doctor ID correctly

      // Make the API call
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/appointments`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } } // Ensure correct headers for file upload
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
      setloadingap(false); // Stop the loader after API call completes
    }
  };

  // appoitment time slote

  const fetchDoctorData = async (selectedDate) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/getDoctorDetails/${props.Labid}`
      );
      console.log("doctor data", response.data);
      setData(response.data);

      // Get the day of the week based on the selected date (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      const currentDay = new Date(selectedDate).getDay();

      // let startTime, endTime;
      let startTimeSlot1;
      let endTimeSlot1;

      let startTimeSlot2;
      let endTimeSlot2;

      let startTimeSlot3;
      let endTimeSlot3;

      // Set OPD time slots based on the day of the week
      if (currentDay >= 1 && currentDay <= 5) {
        // Monday to Friday
        startTimeSlot1 = response.data.OPD1StartTime;
        endTimeSlot1 = response.data.OPD1EndTime;

        startTimeSlot2 = response.data.OPD1Slot2StartTime;
        endTimeSlot2 = response.data.OPD1Slot2EndTime;

        startTimeSlot3 = response.data.OPD1Slot3StartTime;
        endTimeSlot3 = response.data.OPD1Slot3EndTime;
      } else if (currentDay === 6) {
        // Saturday
        startTimeSlot1 = response.data.OPD2StartTime;
        endTimeSlot1 = response.data.OPD2EndTime;

        startTimeSlot2 = response.data.OPD2Slot2StartTime;
        endTimeSlot2 = response.data.OPD2Slot2EndTime;

        startTimeSlot3 = response.data.OPD2Slot3StartTime;
        endTimeSlot3 = response.data.OPD2Slot3EndTime;
      } else if (currentDay === 0) {
        // Sunday
        startTimeSlot1 = response.data.OPD3StartTime;
        endTimeSlot1 = response.data.OPD3EndTime;

        startTimeSlot2 = response.data.OPD3Slot2StartTime;
        endTimeSlot2 = response.data.OPD3Slot2EndTime;

        startTimeSlot3 = response.data.OPD3Slot3StartTime;
        endTimeSlot3 = response.data.OPD3Slot3EndTime;

        console.log("lll", startTimeSlot1, endTimeSlot1);
      }

      // Generate time slots based on the selected date’s time range
      // settimes(generateTimeSlots(startTime, endTime));

      const allSlots = [
        ...generateTimeSlots(startTimeSlot1, endTimeSlot1),
        ...generateTimeSlots(startTimeSlot2, endTimeSlot2),
        ...generateTimeSlots(startTimeSlot3, endTimeSlot3),
      ];

      // Set the combined slots
      settimes(allSlots);
      // console.log("Generated time slots", times);

      // Show the modal
      setshowModalappoitment(true);
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      // Handle the error, e.g., show an alert or message to the user
    }
  };

  const getCookie = (name) => {
    return Cookies.get(name);
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
        // const userPassword = response.data.data.Password;

        // Debug: Logging before setting cookies
        console.log("Setting cookies...", { userId, userName, userEmail });

        // Store data in cookies instead of localStorage
        Cookies.set("CustomerId", userId, { expires: 7 });
        Cookies.set("PatientName", userName, { expires: 7 }); // Make sure to store the PatientName as well

        Cookies.set("username", userEmail, { expires: 7 });
        // Cookies.set("Password", userPassword, { expires: 7 });

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

  const handleCollectionRequestClick = () => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>");
    const storedPatientName = getCookie("PatientName");
    console.log(storedPatientName);
    if (storedPatientName) {
      fetchDoctorData(true);
      setshowModalappoitment(true); // Show collection request modal if patientName exists in cookies
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

  return (
    <>
      <Card className="single-research-box">
        <Row>
          <Col lg={6} md={6} sm={12}>
            <div className="research-image network image-size-fix">
              <Link
                to={props.imagelink}
                target="_blank"
                className="image-size-fix"
              >
                <Image
                  src={props.hospitalimage}
                  alt="Doctor Image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = doctorplaceholder;
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
                  {props.mainheading} ({props.DoctorSpeciality})
                </Link>
              </h3>
              <div>
                <ReactStars
                  count={5}
                  size={24}
                  activeColor="#ffd700"
                  value={
                    props.averageRating ? parseFloat(props.averageRating) : 0
                  }
                  edit={false}
                />
              </div>
              <div className="">
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

              <div className="location-marker-section-doctor">
                <div className="time-box">
                  <table className="time-table">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Slot 1</th>
                        <th>Slot 2</th>
                        <th>Slot 3</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{dayName}</td>
                        <td>
                          {props.slot1start1}-{props.slot1end1}
                        </td>
                        <td>
                          {props.slot2start1}-{props.slot2end1}
                        </td>
                        <td>
                          {props.slot3start1}-{props.slot3end1}
                        </td>
                      </tr>
                      <tr>
                        <td>{dayName2}</td>
                        <td>
                          {props.slot1start2}-{props.slot1end2}
                        </td>
                        <td>
                          {props.slot2start2}-{props.slot2end2}
                        </td>
                        <td>
                          {props.slot3start2}-{props.slot3end2}
                        </td>
                      </tr>
                      <tr>
                        <td>{dayName3}</td>
                        <td>
                          {props.slot1start3}-{props.slot1end3}
                        </td>
                        <td>
                          {props.slot2start3}-{props.slot2end3}
                        </td>
                        <td>
                          {props.slot3start3}-{props.slot3end3}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* <Button
                variant="primary"
                className="mt-3 float-end contact-sec inner-btn"
                style={{ borderRadius: 10 }}
                onClick={() => setShowModal(true)}
              >
                Contact
              </Button> */}
              <Button
                variant="primary"
                className="mt-3 ml-3 float-end contact-sec inner-btn"
                style={{ borderRadius: 10 }}
                onClick={handleCollectionRequestClick}
              >
                Appointment
              </Button>

              <Button
                variant="primary"
                className="mt-3 ml-3 float-end contact-sec inner-btn"
                style={{ borderRadius: 10 }}
                onClick={fetchDoctorDetails}
                disabled={loading} // Disable button while loading
              >
                {loading ? "Loading..." : "Profile"}
              </Button>
              <Button
                className="mt-3 ml-3 float-end contact-sec inner-btn"
                style={{ borderRadius: 10 }}
                onClick={() => handlerateUsRequestClick()}
              >
                Rate us
              </Button>
              <Button
                className="mt-3 ml-3 float-end contact-sec inner-btn blink-btn"
                style={{
                  borderRadius: 10,
                  backgroundColor: "white",
                  color: "#eb268f",
                  cursor: "default",
                  animation: "blink 1s infinite", // Add the blinking animation
                }}
              >
                ₹ {props.fee}
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
              description: "",
              file: null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, errors, touched }) => (
              <FormikForm>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>
                    Name <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Field
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    className={`form-control ${
                      errors.name && touched.name ? "is-invalid" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="invalid-feedback"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>
                    Email address <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className={`form-control ${
                      errors.email && touched.email ? "is-invalid" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="invalid-feedback"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formContactNumber">
                  <Form.Label>
                    Contact Number <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Field
                    name="contactNumber"
                    type="text"
                    placeholder="Enter your contact number"
                    className={`form-control ${
                      errors.contactNumber && touched.contactNumber
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="contactNumber"
                    component="div"
                    className="invalid-feedback"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formFile">
                  <Form.Label>
                    Upload File <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <input
                    name="file"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className={`form-control ${
                      errors.file && touched.file ? "is-invalid" : ""
                    }`}
                    onChange={(event) => {
                      setFieldValue("file", event.currentTarget.files[0]);
                    }}
                  />
                  <ErrorMessage
                    name="file"
                    component="div"
                    className="invalid-feedback"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDescription">
                  <Form.Label>
                    Description <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Field
                    name="description"
                    type="text"
                    placeholder="Enter your Description"
                    className={`form-control ${
                      errors.description && touched.description
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="invalid-feedback"
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Rating Modal */}
      <Modal show={ratingShowModal} onHide={() => setRatingShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title-centered">
            Rating {props.mainheading}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              name: "",
            }}
            validationSchema={ratingValidationSchema}
            onSubmit={handleRatingSubmit}
          >
            {({ setFieldValue, errors, touched }) => (
              <FormikForm>
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
                      onChange={handleRatingChange}
                      value={rating}
                    />
                  </div>
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="invalid-feedback"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Description</Form.Label>
                  <Field
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    className={`form-control ${
                      errors.name && touched.name ? "is-invalid" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="invalid-feedback"
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* profile modal */}

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
                src={`${process.env.REACT_APP_API_URL_GRACELAB}/${doctorData.Doctorphoto}`}
                alt={doctorData.DoctorName}
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
                  <h5>{doctorData.DoctorName}</h5>
                  <p>
                    <span className="profile-show">Clinic Name:</span>{" "}
                    {doctorData.ClinicName}
                  </p>
                  <p>
                    <span className="profile-show">Doctor License Number:</span>{" "}
                    {doctorData.DoctorLicenseNumber}
                  </p>
                  <p>
                    <span className="profile-show">Contact:</span>{" "}
                    {doctorData.mobileNumber}
                  </p>
                </div>
                <div className="col-6">
                  <p>
                    <span className="profile-show">City:</span>{" "}
                    {doctorData.city?.Name || "N/A"}
                  </p>
                  <p>
                    <span className="profile-show">Address:</span>{" "}
                    {doctorData.address}
                  </p>
                  <p>
                    <span className="profile-show">Speciality:</span>{" "}
                    {doctorData?.Speciality?.Speciality || "N/A"}
                  </p>
                </div>
              </div>

              {/* OPD Times in Table Format */}
              <div className="opd-times mt-3">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Days</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctorData.OPD1StartTime && (
                      <tr>
                        <td>{doctorData.DaysDoctor1?.Days || "N/A"}</td>
                        <td>{doctorData.OPD1StartTime}</td>
                        <td>{doctorData.OPD1EndTime}</td>
                      </tr>
                    )}
                    {doctorData.OPD2StartTime && (
                      <tr>
                        <td>{doctorData.DaysDoctor2?.Days || "N/A"}</td>
                        <td>{doctorData.OPD2StartTime}</td>
                        <td>{doctorData.OPD2EndTime}</td>
                      </tr>
                    )}
                    {doctorData.OPD3StartTime && (
                      <tr>
                        <td>{doctorData.DaysDoctor3?.Days || "N/A"}</td>
                        <td>{doctorData.OPD3StartTime}</td>
                        <td>{doctorData.OPD3EndTime}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
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

      {/* apooitment modal */}
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
              patientName: Cookies.get("PatientName") || "", // Assuming patient name is stored in cookies
              disease: "",
              phone: "",

              email: "",
              prescription: null, // First report field for prescription
              testReport: null, // Second report field for test report
              xrayReport: null, // Third report field for x-ray report
              date: "",
              time: "",
            }}
            validationSchema={validationSchemaappoitment}
            onSubmit={handleSubmitAppointment}
          >
            {({ setFieldValue, errors, touched }) => (
              <FormikForm>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formPatientName">
                      <Form.Label>Member Name *</Form.Label>
                      <Field
                        name="patientName"
                        type="text"
                        readOnly
                        placeholder="Enter Member name"
                        className={`form-control ${
                          errors.patientName && touched.patientName
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      <ErrorMessage
                        name="patientName"
                        component="div"
                        className="invalid-feedback"
                      />
                    </Form.Group>
                  </Col>

                  {/* Disease Field */}
                  <Col md={6}>
                    <Form.Group controlId="formDisease">
                      <Form.Label>Disease *</Form.Label>
                      <Field
                        as="select"
                        name="disease"
                        className={`form-control ${
                          errors.disease && touched.disease ? "is-invalid" : ""
                        }`}
                      >
                        <option value="" label="Select disease" />
                        {symptomwise.map((Symptom) => (
                          <option key={Symptom._id} value={Symptom._id}>
                            {Symptom.Symptom}
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
                    <Form.Group controlId="formEmail">
                      <Form.Label>Email (Optional)</Form.Label>
                      <Field
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className={`form-control ${
                          errors.email && touched.email ? "is-invalid" : ""
                        }`}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="invalid-feedback"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Row>
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
                          onChange={(e) => {
                            // Set the selected date in Formik
                            setFieldValue("date", e.target.value);

                            // Fetch doctor data and generate time slots for the selected date
                            fetchDoctorData(e.target.value);
                          }}
                        />
                        <ErrorMessage
                          name="date"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Form.Group>
                    </Col>

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
                  </Row>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group controlId="formPrescription">
                      <Form.Label>Upload Prescription</Form.Label>
                      <input
                        name="prescription"
                        type="file"
                        className="form-control"
                        onChange={(event) =>
                          setFieldValue(
                            "prescription",
                            event.currentTarget.files[0]
                          )
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group controlId="formTestReport">
                      <Form.Label>Upload Report</Form.Label>
                      <input
                        name="testReport"
                        type="file"
                        className="form-control"
                        onChange={(event) =>
                          setFieldValue(
                            "testReport",
                            event.currentTarget.files[0]
                          )
                        }
                      />
                      {errors.testReport && touched.testReport && (
                        <div className="invalid-feedback d-block">
                          {errors.testReport}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="formXrayReport">
                      <Form.Label>Upload other reports</Form.Label>
                      <input
                        name="xrayReport"
                        type="file"
                        className="form-control"
                        onChange={(event) =>
                          setFieldValue(
                            "xrayReport",
                            event.currentTarget.files[0]
                          )
                        }
                      />
                      {errors.xrayReport && touched.xrayReport && (
                        <div className="invalid-feedback d-block">
                          {errors.xrayReport}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" type="submit" disabled={loadingap}>
                  {loadingap ? "Submitting..." : "Submit"}
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
        setshowModalappoitment={setshowModalappoitment}
      />
    </>
  );
};

export default Doctordes;
