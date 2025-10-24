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
import Cookies from "js-cookie";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import placeholder from "../img/placeholder-banner-panel.png";
import { useNavigate } from "react-router-dom";

const LoginComponent = ({
  showLoginModal,
  setShowLoginModal,
  setshowModalappoitment,
}) => {
  const [loginError, setLoginError] = useState("");
  const [loginValues, setLoginValues] = useState({
    patientName: "",
    password: "",
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (loginDetails) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/userLoginAssociate`,
        loginDetails
      );

      if (response.data.isOk == true) {
        const userId = response.data.data._id;
        const userName = response.data.data.doctorFirstName;
        const userEmail = response.data.data.email;

        Cookies.set("associateId", userId, { expires: 1 });
        Cookies.set("associateName", userName, { expires: 1 });
        Cookies.set("associateEmail", userEmail, { expires: 1 });

        setShowLoginModal(false);
        if (window.location.pathname === "/associates-login") {
          navigate("/associates-list");
          window.location.reload();
        }
        setshowModalappoitment(true);
      } else {
        setLoginError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoginError("Something went wrong. Please try again.");
    }
  };

  // 2. Add forgot password handler function:
  const handleForgotPassword = async (email) => {
    try {
      setForgotPasswordError("");
      setForgotPasswordSuccess("");

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/forgotPassword`,
        { email }
      );

      if (response.data.isOk === true) {
        setForgotPasswordSuccess("Password reset link sent to your email!");
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotPasswordSuccess("");
        }, 2000);
      } else {
        setForgotPasswordError(
          "Email not found. Please check your email address."
        );
      }
    } catch (error) {
      console.error("Error during forgot password:", error);
      setForgotPasswordError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
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

                <div className="d-flex justify-content-between">
                  <p>
                    <span
                      style={{
                        color: "#007bff",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => {
                        setShowForgotPassword(true);
                        setShowLoginModal(false);
                      }}
                    >
                      Forgot Password?
                    </span>
                  </p>
                  <p>
                    <Link
                      to="/associates-signup"
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
      
      {/* Forgot Password Modal */}
      <Modal
        show={showForgotPassword}
        onHide={() => {
          setShowForgotPassword(false);
          setForgotPasswordError("");
          setForgotPasswordSuccess("");
        }}
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("Invalid email format")
                .required("Email is required"),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await handleForgotPassword(values.email);
              } catch (error) {
                console.error("Error in forgot password:", error);
              }
              setSubmitting(false);
            }}
          >
            {({
              handleSubmit,
              handleChange,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <FormikForm noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formForgotEmail">
                  <Form.Label>Enter your email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={touched.email && errors.email}
                    placeholder="Enter your registered email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>

                {forgotPasswordError && (
                  <div className="text-danger mb-3">{forgotPasswordError}</div>
                )}

                {forgotPasswordSuccess && (
                  <div className="text-success mb-3">
                    {forgotPasswordSuccess}
                  </div>
                )}

                <ModalFooter>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotPasswordError("");
                      setForgotPasswordSuccess("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </ModalFooter>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoginComponent;
