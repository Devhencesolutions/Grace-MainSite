import React, { useState } from "react";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import Pagetitle from "../patients/Pagetitle";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import Login from "../hospital/Login";
import pharmacy from "../img/pharmacy-login.jpg";
import { RxSlash } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CommonSec from "../navbar/CommonSec";
import ScrollToTop from "../scrolltop/Scrolltop";

function Pharmacylogin() {
  // const [email, setemail] = useState('');
  // const [password, setPassword] = useState('');
  // const [error, setError] = useState('');
  // const [loading, setLoading] = useState(false);

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError('');

  //   try {
  //     const response = await axios.post(`${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/userLoginPharmacy`,

  //       {
  //       email,
  //       password,
  //     });

  //     const result = response.data;
  //     //console.log('login data :',result)

  //     if (result.isOk) {
  //       // Handle successful login (e.g., save user data, redirect to dashboard)
  //       window.open('http://PharmacyGracelab.barodaweb.in','_blank');
  //     } else {
  //       setError(result.message);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setError('An error occurred while logging in.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleRedirect = () => {
    window.open("https://pharmacy.gracemedicalservices.in/home/login", "_blank");
  };

  return (
    <>
      <CommonSec />
      <ScrollToTop />
      <Modalnavigationbar navigatelink="" />
      <div className="page-title-area">
        <Pagetitle
          heading="JOIN OUR PHARMACY NETWORK"
          pagetitlelink="/"
          title1="Login"
          title2="Signup"
          IconComponent={RxSlash}
        />
      </div>
      <section class="services-area ptb-70 pb-5">
        <Container>
          <Row className="justify-content-center" id="loginPanel">
            <Col md={12} lg={10}>
              <div className="wrap d-md-flex">
                {/* Image Section */}
                <div
                  className="img"
                  style={{ backgroundImage: `url(${pharmacy})` }}
                ></div>
                {/* Login Form Section */}
                <div className="login-wrap p-4 p-md-5">
                  <div className="d-block">
                    <div className="w-100 text-center">
                      <h3 className="mb-2 h5 fw-bold">
                        We are The Grace Lab Team
                      </h3>
                      <p className="mb-4">Please login to your account</p>
                    </div>
                  </div>

                  {/* <Form className="signin-form"> */}
                  {/* Username / Email Address */}
                  {/* <Form.Group className="mb-3">
                  <Form.Label className="label">Username</Form.Label>
                  <Form.Control type="text"
                   placeholder="Username"
                    required 
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    />
                </Form.Group> */}
                  {/* Password */}
                  {/* <Form.Group className="mb-3">
                  <Form.Label className="label">Password</Form.Label>
                  <Form.Control type="password" 
                  placeholder="Password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                   />
                </Form.Group> */}

                  {/* Remember Me Checkbox and Forgot Password Link */}
                  {/* <div className="d-md-flex my-4">
                  <div className="w-50 text-start">
                  <label class="checkbox-wrap checkbox-primary mb-0">
                                                <input type="checkbox" />
                                                <span class="checkmark"></span> Remember Me
                                            </label>
                  </div>
                  <div className="w-50 text-end forgotpassword">
                    <Link to=''>Forgot Password?</Link>
                  </div>
                </div> */}

                  {/* Sign In Button */}
                  <Button
                    type="submit"
                    onClick={handleRedirect}
                    className="form-control btn btn-sign-in rounded submit px-3"
                  >
                    Sign In
                  </Button>
                  {/* </Form> */}

                  {/* Register Link */}
                  <p className="text-center hospitallogin">
                    Don't have an account?{" "}
                    <Link
                      to="/pharmacy-signup"
                      className="d-inline-block register-here"
                    >
                      Register here
                    </Link>
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Pharmacylogin;
