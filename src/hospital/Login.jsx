import React from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Login(props) {
  return (
    <>
      <Col md={12} lg={10}>
          <div className="wrap d-md-flex">
            {/* Image Section */}
            <div className="img" style={{backgroundImage:`url(${props.loginimage})`}}>
            </div>
            {/* Login Form Section */}
            <div className="login-wrap p-4 p-md-5">
              <div className="d-block">
                <div className="w-100 text-center">
                  <h3 className="mb-2 h5 fw-bold">We are The Grace Lab Team</h3>
                  <p className="mb-4">Please login to your account</p>
                </div>
              </div>
              <Form className="signin-form">
                {/* Username / Email Address */}
                <Form.Group className="mb-3">
                  <Form.Label className="label">{props.username}</Form.Label>
                  <Form.Control type="text" placeholder="Username" required />
                </Form.Group>
                {/* Password */}
                <Form.Group className="mb-3">
                  <Form.Label className="label">{props.password}</Form.Label>
                  <Form.Control type="password" placeholder="Password" required />
                </Form.Group>

                {/* Remember Me Checkbox and Forgot Password Link */}
                <div className="d-md-flex my-4">
                  <div className="w-50 text-start">
                  <label class="checkbox-wrap checkbox-primary mb-0">
                                                <input type="checkbox" />
                                                <span class="checkmark"></span> Remember Me
                                            </label>
                  </div>
                  <div className="w-50 text-end forgotpassword">
                    <Link to={props.forgetpassword}>Forgot Password?</Link>
                  </div>
                </div>

                {/* Sign In Button */}
                <Button type="submit" className="form-control btn btn-sign-in rounded submit px-3">Sign In</Button>
              </Form>

              {/* Register Link */}
              <p className="text-center hospitallogin">Don't have an account? <Link to={props.register} className="d-inline-block">Register here</Link></p>
            </div>
          </div>
        </Col>
    
    </>
  )
}

export default Login