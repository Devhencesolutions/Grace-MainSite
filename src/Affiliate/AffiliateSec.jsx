import axios from "axios";
import { ErrorMessage, Field, Formik } from "formik";
import Cookies from "js-cookie"; // You can use js-cookie library for managing cookies
import { useState } from "react";
import { Button, Card, Col, Form, Image, Modal, Row } from "react-bootstrap";
import { FaMapMarker, FaPhoneAlt } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import ReactStars from "react-rating-stars-component";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import LoginComponent from "../Components/loginComponent";
import pharmacyplaceholder from "../img/pharmacyplaceholder.jpeg";

function AffiliateSec(props) {
  const navigate = useNavigate();

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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
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
    Description: Yup.string().required("Description is required"),
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
      formDataToSend.append("Description", values.Description);
      if (values.myFile) {
        formDataToSend.append("myFile", values.myFile);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/create/Contactpharmacy/${props.Labid}`,
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
      console.log(values);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/create/ContactRating`,
        {
          name: values.name,
          rating: rating,
          Pharmacy: props.Labid,
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
  const getCookie = (name) => {
    return Cookies.get(name);
  };
  const isClosed = dayName2 === "Sat(closed)" || dayName2 === "Sun(closed)";
  const [showModalappoitment, setshowModalappoitment] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handlerateUsRequestClick = () => {
    const storedPatientName = getCookie("PatientName");

    if (storedPatientName) {
      setRatingShowModal(true); // Show collection request modal if patientName exists in cookies
    } else {
      setShowLoginModal(true); // Show login modal if patientName does not exist
    }
  };

  const handleOpenAffiliate = (id) => {
    navigate(`/affiliate-products/${id}`);
  };

  return (
    <>
      <Card
        className="single-research-box"
        onClick={() => handleOpenAffiliate(props.affiliateId)}
      >
        <Row>
          <Col lg={6} md={6} sm={12}>
            <div className="research-image image-size-fix">
              <Link target="_blank" className="image-size-fix">
                <Image
                  src={props.bannerImage}
                  alt="Affiliate Image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = pharmacyplaceholder;
                  }}
                  className="affiliate-image-size-fix"
                />
              </Link>
            </div>
          </Col>
          <Col lg={6} md={6} sm={12}>
            <Card.Body className="research-content">
              <h3>
                <Link className="heading-change capitalize-text">
                  {props?.mainheading} ({props?.buisnessCategoryDetails?.Name})
                </Link>
              </h3>

              {/* {props?.discount && <p className="mt-2">GET {props?.discount/2}% discount + {props?.discount/2}% off on loyalty points</p> = Total {props?.discount}% benefits to customer.  } */}
              {(Number(props?.discount) > 0 || Number(props?.points) > 0) && (
                <p className="mt-2">
                  <b>
                    <span className="blink">
                      {Number(props.discount) > 0 &&
                        `GET ${props.discount}% discount`}
                      {Number(props.discount) > 0 &&
                        Number(props.points) > 0 &&
                        " + "}
                      {Number(props.points) > 0 &&
                        `REDEEM ${props.points}% loyalty points`}
                      {Number(props.discount) > 0 &&
                        Number(props.points) > 0 &&
                        ` = Total ${
                          Number(props.discount || 0) +
                          Number(props.points || 0)
                        }% benefits to grace member.`}
                    </span>
                  </b>
                </p>
              )}

              <div className="location-marker-section">
                <Link>
                  <h5 className="mt-3 d-inline-block me-2">
                    <div className="heading-container">
                      <FaMapMarker className="map-color" />
                      <div className="heading-text capitalize-text">
                        {props?.headings}
                      </div>
                    </div>
                  </h5>
                </Link>
              </div>
              <div className="location-marker-section">
                <Link>
                  <h5 className="mt-3 d-inline-block me-2">
                    <div className="heading-container">
                      <FaPhoneAlt className="map-color" />
                      <div className="heading-text capitalize-text">
                        {props.contact}
                      </div>
                    </div>
                  </h5>
                </Link>
              </div>
              <div className="location-marker-section">
                <Link>
                  <h5 className="mt-3 d-inline-block me-2">
                    <div className="heading-container">
                      <MdOutlineMail className="map-color fs-5" />
                      <div className="heading-text capitalize-text">
                        {props.email}
                      </div>
                    </div>
                  </h5>
                </Link>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>

      {/* order Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title-centered">
            Order {props.mainheading}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              name: "",
              email: "",
              contactNumber: "",
              Description: "",
              myFile: null,
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
                    isInvalid={touched.myFile && !!errors.myFile}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.myFile}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDescription">
                  <Form.Label>
                    Description <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Enter your Description"
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
      <LoginComponent
        setShowLoginModal={setShowLoginModal}
        showLoginModal={showLoginModal}
        setshowModalappoitment={setshowModalappoitment}
      />
    </>
  );
}

export default AffiliateSec;
