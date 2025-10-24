import React from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Pagetitle from '../patients/Pagetitle';
import { MdArrowForwardIos } from "react-icons/md";
import Modalnavigationbar from '../navbar/Modalnavigationbar';

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  ownername: Yup.string().required('Owner Name is required'),
  email: Yup.string()
  .matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    'Invalid email address'
  )
  .required('Email is required'),
  contact: Yup.string()
    .matches(/^\d+$/, 'Contact No. must contain only digits')
    .length(10, 'Contact No. must be exactly 10 digits')
    .required('Contact No. is required'),
  password: Yup.string().required('Password is required'),
  confirmpass: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
  licenceno: Yup.string().required('License No. is required'),
  licencedate: Yup.date().required('License Date is required'),
  pincode: Yup.string().required('Pincode is required'),
  address: Yup.string().required('Address is required'),
});

function Registration() {
  return (
<>
<Modalnavigationbar  navigatelink=""/>

<div className="page-title-area">
    <Pagetitle 
    heading="Registration"
    pagetitlelink="/"
    title1="Home"
    title2="Registration"
    IconComponent={MdArrowForwardIos}
    />
</div>


<section className="services-area ptb-70 pb-5">
      <Container>
        <Row  id="signupPanel">
<Col md={12} lg={12}>
      <div className="wrap d-md-flex">
        {/* <div className="img" style={{ backgroundImage: `url(${props.signupimage})` }}></div> */}
        <div className="registration-login-wrap p-4 p-md-5">
          <div className="d-block">
            <div className="w-100 text-center">
              <h3 className="mb-4 h5 fw-bold">Please sign up to your account</h3>
              {/* <p className="mb-4">Please sign up to your account</p> */}
            </div>
          </div>
          <Formik
            initialValues={{
              name: '',
              ownername: '',
              email: '',
              contact: '',
              password: '',
              confirmpass: '',
              licenceno: '',
              licencedate: '',
              pincode: '',
              address: '',
            }}
            validationSchema={SignupSchema}
            onSubmit={values => {
              console.log(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <Form className="signin-form row" onSubmit={handleSubmit}>
                <div className="step-1 d-block">
                  <Row className="justify-content-center">
                    <Col lg={6} className="form-group mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder='Enter Name'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                        isInvalid={touched.name && errors.name}
                      />
                      <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Col>
                    {/* <Col lg={6} className="form-group mb-3">
                      <Form.Label>{props.ownername}</Form.Label>
                      <Form.Control
                        type="text"
                        name="ownername"
                        placeholder="Owner Name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.ownername}
                        isInvalid={touched.ownername && errors.ownername}
                      />
                      <Form.Control.Feedback type="invalid">{errors.ownername}</Form.Control.Feedback>
                    </Col> */}
                    <Col lg={6} className="form-group mb-3">
                      <Form.Label>Email id </Form.Label>
                      <Form.Control
                        type="text"
                        name="email"
                        placeholder="Email Address"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        isInvalid={touched.email && errors.email}
                      />
                      <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Col>
                    <Col lg={6} className="form-group mb-3">
                      <Form.Label>Contact No.</Form.Label>
                      <Form.Control
                        type="text"
                        name="contact"
                        placeholder="Contact No."
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.contact}
                        isInvalid={touched.contact && errors.contact}
                      />
                      <Form.Control.Feedback type="invalid">{errors.contact}</Form.Control.Feedback>
                    </Col>
                    <Col lg={6} className="form-group mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        isInvalid={touched.password && errors.password}
                      />
                      <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    </Col>
                    <Col lg={6} className="form-group mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmpass"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.confirmpass}
                        isInvalid={touched.confirmpass && errors.confirmpass}
                      />
                      <Form.Control.Feedback type="invalid">{errors.confirmpass}</Form.Control.Feedback>
                    </Col>
                    {/* <Col lg={6} className="form-group mb-3">
                      <Form.Label>{props.licenceno}</Form.Label>
                      <Form.Control
                        type="text"
                        name="licenceno"
                        placeholder={props.licencep}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.licenceno}
                        isInvalid={touched.licenceno && errors.licenceno}
                      />
                      <Form.Control.Feedback type="invalid">{errors.licenceno}</Form.Control.Feedback>
                    </Col> */}
                    {/* <Col lg={6} className="form-group mb-3">
                      <Form.Label>{props.licencedate}</Form.Label>
                      <Form.Control
                        type="date"
                        name="licencedate"
                        placeholder="Hospital License Date"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.licencedate}
                        isInvalid={touched.licencedate && errors.licencedate}
               
                        />
                      <Form.Control.Feedback type="invalid">{errors.licencedate}</Form.Control.Feedback>
                    </Col> */}
                    <Col lg={6} className="form-group mb-3">
                      <Form.Label>Pin code </Form.Label>
                      <Form.Control
                        type="text"
                        name="pincode"
                        placeholder="Pincode"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.pincode}
                        isInvalid={touched.pincode && errors.pincode}
                      />
                      <Form.Control.Feedback type="invalid">{errors.pincode}</Form.Control.Feedback>
                    </Col>
                    <Col lg={12} className="form-group mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        placeholder="Address"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.address}
                        isInvalid={touched.address && errors.address}
                      />
                      <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                    </Col>
                    <Col lg={12} className="form-group d-md-flex mb-4">
                      <div className="w-100 text-start">
                      <label class="checkbox-wrap checkbox-primary mb-0">
                                                        <input type="checkbox" />
                                                        <span class="checkmark"></span> I agree all statements in <a href="#" class="d-inline-block">Terms of service</a>
                                                    </label>
                      </div>
                    </Col>
                    <Col lg={6} className="form-group">
                      <Button type="submit" className="form-control btn btn-sign-in rounded submit px-3 btn btn-primary">Submit Now</Button>
                    </Col>
                  </Row>
                </div>
              </Form>
            )}
          </Formik>
          <p className="text-center">Already have an account? <Link to='/sign-up' className="d-inline-block">Sign In</Link></p>
        </div>
      </div>
    </Col>
    </Row>
    </Container>
    </section>

</>


    
    
  );
}

export default Registration;
