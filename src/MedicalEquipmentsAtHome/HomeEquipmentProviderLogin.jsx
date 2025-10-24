import axios from "axios";
import { Formik } from "formik";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { RxSlash } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import * as Yup from "yup";
import pharmacylogin from "../img/pharmacy-login2.jpg";
import CommonSec from "../navbar/CommonSec";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import Pagetitle from "../patients/Pagetitle";
const validationSchema = Yup.object({
  password: Yup.string().required("Password is required"),
  email: Yup.string().email("Invalid Email").required("Shop Email is required"),
});

function HomeEquipmentProviderLogin() {
  const navigate = useNavigate();

  const initialValues = {
    password: "",
    email: "",
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit2 = async (values) => {
    try {
      console.log("nn", values);
      setIsLoading(true);
      await axios
        .post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/login/equipment-provider`,
          values
        )
        .then((res) => {
          console.log(">> login", res);
          setIsLoading(false);
          if (res.data.isOk === false) {
            toast.error(res.data.message);
            return;
          } else if (res.status === 200) {
            Cookies.set("homeEquipmentProviderId", res.data.data._id, {
              expires: 7,
            });
            Swal.fire({
              title: "Success!",
              text: "Equipment Provider Login successfully",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              navigate(
                `/medical-equipments/equipment-provider/${res.data.data._id}`
              );
            });
          }
        });
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to create",
        icon: "error",
        confirmButtonText: "OK",
      });
      //   setSubmitting(false); // Reset form submission state
    }
  };

  return (
    <>
      <CommonSec />
      <Modalnavigationbar />
      <ToastContainer />

      <div className="page-title-area">
        <Pagetitle
          heading="Medical Equipments On Rent"
          pagetitlelink=">"
          title1="Login"
          title2="Equipment Provider"
          IconComponent={RxSlash}
        />
      </div>

      <section className="equipments-area ptb-70 pb-5">
        <Container>
          <Row className="justify-content-center" id="signupPanel">
            <div className="wrap d-md-flex">
              <div
                className="img"
                style={{ backgroundImage: `url(${pharmacylogin})` }}
              ></div>
              <div className="login-wrap p-4 p-md-5">
                <div className="d-block">
                  <div className="w-100 text-center">
                    <h3 className="mb-4 h5 fw-bold">
                      Equipment Provider Login
                    </h3>
                    {/* <p className="mb-4">Please sign up to your account</p> */}
                  </div>
                </div>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit2}
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
                    <Form className="signin-form row">
                      <div className="step-1 d-block">
                        <Row className="justify-content-center">
                          <Row className="justify-content-center">
                            <Col lg={8} className="form-group mb-3">
                              <Form.Label>
                                Email <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              <Form.Control
                                type="email"
                                name="email"
                                placeholder=" Email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                isInvalid={touched.email && errors.email}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.email}
                              </Form.Control.Feedback>
                            </Col>
                          </Row>

                          <Row className="justify-content-center">
                            <Col lg={8} className="form-group mb-3">
                              <Form.Label>
                                Password <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              <Form.Control
                                type="password"
                                name="password"
                                placeholder="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                                isInvalid={touched.password && errors.password}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.password}
                              </Form.Control.Feedback>
                            </Col>
                          </Row>

                          <Col lg={8}>
                            <Button
                              type="button"
                              className="form-control btn btn-sign-in rounded submit px-3"
                              disabled={isLoading}
                              onClick={(e) => {
                                e.preventDefault();
                                handleSubmit2(values);
                              }}
                            >
                              {isLoading ? "Submitting..." : "Login"}
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </Form>
                  )}
                </Formik>

                <div className="w-100 text-center mt-4">
                  <p className="text-center">
                    Don't have an account?
                    <Link
                      to="/medical-equipments/equipment-provider-register"
                      className="d-inline-block"
                    >
                      Register
                    </Link>
                  </p>
                </div>

                {/* <div className="w-100 text-center mt-4">
                  <p className="text-center">
                    Forgot Password?{" "}
                    <Link to="/vendor-signup" className="d-inline-block">
                      Request Password
                    </Link>
                  </p>
                </div> */}
              </div>
            </div>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default HomeEquipmentProviderLogin;
