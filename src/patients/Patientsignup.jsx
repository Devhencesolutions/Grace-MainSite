import React, { useState, useSyncExternalStore, useEffect } from "react";
import Pagetitle from "./Pagetitle";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import network from "../img/network.jpg";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import { RxSlash } from "react-icons/rx";
import { Formik } from "formik";
import Swal from "sweetalert2";
import axios from "axios";
import * as Yup from "yup";
import CommonSec from "../navbar/CommonSec";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";

function Patientsignup() {
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
    password: Yup.string().required("Password is required"),
    // PatientRegistrationDate validation removed - automatically set in form submission
    area: Yup.string().required("area is required"),
    // panCard: Yup.string()
    // .required('PAN card is required')
    // .matches(
    //   /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    //   'PAN card must be in the format ABCDE1234F'
    // ),
    // aadharCard: Yup.string()
    // .required('Aadhar card is required')
    // .matches(/^\d{12}$/, 'Aadhar card must be exactly 12 digits'),
    city: Yup.string().required("city is required"),
    ReferralCode: Yup.string(),
  });

  const [showModal, setShowModal] = useState(false);
  const [loc, setLoc] = useState([]);
  const handleClose = () => setShowModal(false);
  const handleShow = (event) => {
    event.preventDefault();
    setShowModal(true);
  };

  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.currentTarget.files[0]);
  };
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

  const generateUniqueReferenceNo = async () => {
    try {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // JS months are 0-based
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");

      // Fetch the count of entries in the database
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/getPatientCount`
      );
      const count = response.data.count;

      const sequenceNumber = String(count + 1).padStart(6, "0"); // Add 1 to the count to get the next sequence number

      return `PAT${year}${month}${day}${hours}${sequenceNumber}`;
    } catch (error) {
      console.error("Error fetching lab count:", error);
      // Handle error appropriately, e.g., throw an error or return a default value
      throw new Error("Failed to generate unique reference number");
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("PatientName", values.name);
      formData.append("personalEmail", values.email);
      formData.append("mobileNumber", values.contact);
      formData.append("Password", values.password);
      formData.append(
        "PatientRegistrationDate",
        new Date().toISOString().split('T')[0] // Automatically set current date
      );
      formData.append("area", values.area);
      formData.append("city", values.city);

      // Optional Referral Code
      if (values.ReferralCode) {
        formData.append("ReferralCode", values.ReferralCode);
      }

      formData.append("isActive", true);
      formData.append("photo", file);

      // Generate unique reference number
      const uniqueReferenceNo = await generateUniqueReferenceNo();
      formData.append("PatientReferenceNo", uniqueReferenceNo);

      // API call
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/createPatient`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.isOk) {
        // const { PatientName, _id } = response.data.data;

        // Store PatientName and _id in cookies
        // const oneMinuteFromNow = new Date(new Date().getTime() + 1 * 60 * 1000); // 1 minute in milliseconds

        // Cookies.set("PatientName", PatientName, { expires: oneMinuteFromNow });
        // Cookies.set("_id", _id, { expires: oneMinuteFromNow });

        Swal.fire({
          title: "Success!",
          text: "Member registered successfully",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/patient-login"); // Navigate to the patient login page
        });
      } else {
        console.log(response);

        if (response.data && response.data.alreadyExist) {
          toast.error(response.data.message);
          return;
        }
        throw new Error(response.data.message || "Failed to create Member");
      }

      setSubmitting(false); // Reset form submission state
    } catch (error) {
      console.error("Error creating Member:", error);

      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to create Member",
        icon: "error",
        confirmButtonText: "OK",
      });

      setSubmitting(false); // Reset form submission state
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
  

  return (
    <>
      <CommonSec />
      <Modalnavigationbar />
      <ToastContainer />

      <div className="page-title-area">
        <Pagetitle
          heading="MEMBERS"
          pagetitlelink="/"
          title1="Home"
          title2="Network"
          IconComponent={RxSlash}
        />
      </div>

      <section className="services-area ptb-70 pb-5">
        <Container>
          <Row className="justify-content-center" id="loginPanel">
            <Col md={12} lg={10}>
              <div className="wrap d-md-flex">
                <div className="login-wrap p-4 p-md-5">
                  <div className="d-block">
                    <div className="w-100 text-center">
                      <h3 className="mb-2 h5 fw-bold">
                        We are The Grace Lab Team
                      </h3>
                      <p className="mb-4">Please sign up to your account</p>
                    </div>
                  </div>
                  <Formik
                    initialValues={{
                      name: "",
                      email: "",
                      contact: "",
                      password: "",
                      ReferralCode: "",
                      PatientRegistrationDate: "",
                      area: "",

                      city: "",
                    }}
                    validationSchema={SignupSchema}
                    onSubmit={handleSubmit}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      setFieldValue,
                      handleSubmit,
                      isSubmitting,
                    }) => (
                      <Form className="signin-form" onSubmit={handleSubmit}>
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
                            Email id/username{" "}
                            <span style={{ color: "red" }}>*</span>
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

                        <Form.Group className="mb-3" controlId="formEmail">
                          <Form.Label>
                            Area<span style={{ color: "red" }}>*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="area"
                            placeholder="Area"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.area}
                            isInvalid={touched.area && !!errors.area}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.area}
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

                        <Form.Group className="mb-3" controlId="formPassword">
                          <Form.Label>
                            Password <span style={{ color: "red" }}>*</span>
                          </Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            isInvalid={touched.password && !!errors.password}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.password}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formFile">
                          <Form.Label>Upload Profile Image</Form.Label>
                          <Form.Control
                            type="file"
                            name="photo"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            isInvalid={touched.photo && !!errors.photo}
                          />
                          {/* <Form.Control.Feedback type="invalid">
                            {errors.photo}
                          </Form.Control.Feedback> */}
                        </Form.Group>

                        <Col lg={12} className="form-group d-md-flex mb-4">
                          <div className="w-100 text-start">
                            <label className="checkbox-wrap checkbox-primary mb-0">
                              <input type="checkbox" />
                              <span className="checkmark"></span> I agree to all
                              statements in{" "}
                              <Link
                                to="/terms-condition"
                                className="d-inline-block"
                              >
                                Terms condition
                              </Link>
                            </label>
                          </div>
                        </Col>

                        <Form.Group className="mb-3">
                          <Form.Label>
                            Any Referral code ? (optional)
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="ReferralCode"
                            placeholder="Referral Code"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.ReferralCode}
                            isInvalid={
                              touched.ReferralCode && !!errors.ReferralCode
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.ReferralCode}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Button
                          type="submit"
                          className="form-control btn btn-sign-in rounded submit px-3"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "Submit Now"}
                        </Button>
                      </Form>
                    )}
                  </Formik>

                  <p className="text-center accounttop">
                    Already have an account?{" "}
                    <Link to="/patient-login" className="d-inline-block">
                      Sign In
                    </Link>
                  </p>
                  <p className="text-center fw-bold">
                    <Link
                      to="#"
                      onClick={handleShow}
                      style={{ color: "#eb268f" }}
                    >
                      Why Register with us
                    </Link>
                  </p>
                </div>
                <div
                  className="img"
                  style={{ backgroundImage: `url(${network})` }}
                ></div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Why Register with us</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Accurate Diagnosis:</strong> Laboratory tests provide
            precise results that help in diagnosing various medical conditions
            accurately. This allows healthcare providers to initiate appropriate
            treatment plans promptly.
          </p>
          <p>
            <strong>Early Detection:</strong> Many diseases can be detected
            early through laboratory tests, even before symptoms manifest. Early
            detection facilitates timely intervention, potentially improving
            patient outcomes.
          </p>
          <p>
            <strong>Monitoring Treatment Progress:</strong> Laboratory tests
            enable healthcare providers to monitor the effectiveness of
            treatments over time. By tracking changes in biomarkers or other
            indicators, they can adjust treatment plans as necessary.
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Patientsignup;
