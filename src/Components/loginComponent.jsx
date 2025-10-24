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
import { useCustomerId } from "./MyContext";
import { useNavigate } from 'react-router-dom';
 

const LoginComponent = ({showLoginModal, setShowLoginModal ,setshowModalappoitment}) => {
  const [loginError, setLoginError] = useState("");
  const [loginValues, setLoginValues] = useState({
    mobileNumber: "",
    password: "",
  });
  const { customerId, FetchCustomer } = useCustomerId();

  useEffect(() => {
    FetchCustomer();
  }, []);

  // appoitment time slote
  const navigate = useNavigate();

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
        if (window.location.pathname === "/patient-login") {
          navigate("/");
        }
        setshowModalappoitment(true); // Show collection request modal after successful login
        FetchCustomer();
      } else {
        setLoginError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error); // Catching and logging the error
      setLoginError("Something went wrong. Please try again.");
    }
  };


  return (

     
      <Modal
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
              mobileNumber: Yup.string()
                .required("Mobile number is required")
                .matches(/^[0-9]+$/, "Must be only digits")
                .min(10, "Mobile number should be 10 digits")
                .max(10, "Mobile number should be 10 digits"),
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
                <Form.Group className="mb-3" controlId="formMobileNumber">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobileNumber"
                    value={values.mobileNumber}
                    onChange={handleChange}
                    isInvalid={touched.mobileNumber && errors.mobileNumber}
                  />
                  <ErrorMessage
                    name="mobileNumber"
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

                <ModalFooter>
                  <Button type="submit" variant="primary">
                    Login
                  </Button>
                </ModalFooter>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
 
  );
};

export default LoginComponent;
