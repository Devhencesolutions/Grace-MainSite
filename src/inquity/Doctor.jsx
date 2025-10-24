import React, { useState } from "react";
import bg1 from "../img/logo.jpg";
import bg2 from "../img/logo.jpg";
import { Link, useNavigate } from "react-router-dom";
// import Footer from '../Components/Footer';
// import Navbar from '../Components/Navbar';
import { Input, Button, Label, Row, Col } from "reactstrap";
import logo from "../img/logo.jpg";
import Image from "react-bootstrap/Image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ThankYouModal from "./ThankYouModal";
const DoctorInquiry = () => {
  //   const [formData, setFormData] = useState({
  //     name: '',
  //     email: '',
  //     password: '',
  //   });

  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    MiddleName: Yup.string().required("Middle Name is required"),
   Age: Yup.number()
    .typeError('Age must be a number')
    .required('Age is required'),
    
    Gender: Yup.string().required("Gender is required"),
    Branch: Yup.string().required("Branch is required"),
    Experience: Yup.string().required("Experience is required"),
    Country: Yup.string().required("Country is required"),
    State: Yup.string().required("State is required"),
    City: Yup.string().required("City is required"),
    Area: Yup.string().required("Area is required"),

    email: Yup.string()
      .required("Email is required")
      .matches(/\S+@\S+\.\S+/, "Invalid email address"),
    // password: Yup.string().required('Password is required'),
    Remark: Yup.string().required("Remark is required"),
    Address: Yup.string().required("Address is required"),
    Phone: Yup.string()
      .required("Mobile number is required")
      .matches(/^\d{10}$/, "Mobile number must be 10 digits"),

    // hospitalphoto: Yup.string().required('hospitalphoto is required'),
    // certificate: Yup.string().required('certificate is required'), // Add validation for Course
    // degreePhoto: Yup.string().required('degreePhoto is required'), // Add validation for Course
  });
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    Age: "",
    Gender: "",
    Branch: "",
    Experience: "",
    Country: "",
    State: "",
    City: "",
    Area: "",
    VideoUrl: "",
    Phone: "",
    Address: "",
    hospitalphoto: "",
    certificate: "",
    degreePhoto: "",
    Remark: "",
    IsActive: true,
    // agree: false, // Add the agree field with initial value as false
  };

  const handleCheckbox = (e) => {
    console.log(e.target);
    // setCheckbox(e.target.value)
  };
  const handleRegister = async (values) => {
    try {
      console.log(values.degreePhoto);
      const formdata = new FormData();

      formdata.append("Remark", values.Remark);
      formdata.append("hospitalphoto", values.hospitalphoto);
      formdata.append("certificate", values.certificate);
      formdata.append("degreePhoto", values.degreePhoto);
      formdata.append("Address", values.Address);
      formdata.append("firstName", values.firstName);
      formdata.append("lastName", values.lastName);
      formdata.append("IsActive", values.IsActive);
      formdata.append("email", values.email);
      formdata.append("Phone", values.Phone);
      formdata.append("MiddleName", values.MiddleName);
      formdata.append("Age", values.Age);
      formdata.append("Experience", values.Experience);
      formdata.append("Gender", values.Gender);
      formdata.append("Branch", values.Branch);
      formdata.append("Country", values.Country);
      formdata.append("State", values.State);
      formdata.append("City", values.City);
      formdata.append("Area", values.Area);
      formdata.append("VideoUrl", values.VideoUrl);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/create/Doctor`,
        formdata
      );
      console.log(response);
      if (response) {
        alert("Inquiry Successfull");
        // navigate('/login');
      } else {
        alert("Request failed. Please try again.");
      }
    } catch (error) {
      console.error("Some error:", error);
      alert("Request failed. Please try again.");
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div>
        <section className="container mb-5">
          <div className="auto-container">
            <div className="content-box p_relative d_block b_shadow_6 b_radius_5 pt_60 pr_50 pb_70 pl_50">
              <div className="shape">
                <div
                  style={{ background: "#f7f7f7" }}
                  className="shape-1 p_absolute w_170 h_170 b_radius_50 "
                />
                <div
                  style={{ background: "#f7f7f7" }}
                  className="shape-2 b_140 p_absolute w_170 h_170 b_radius_50 "
                />
                <div
                  className="shape-3 p_absolute t_45 float-bob-y"
                  style={{ backgroundImage: `url(${bg1})` }}
                />
                <div
                  className="shape-4 p_absolute w_95 h_95 b_50 float-bob-y"
                  style={{ backgroundImage: `url(${bg2})` }}
                />
              </div>
              <div
                style={{
                  height: "130px",
                  margin: "40px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Image src={logo} className="h-100" style={{minWidth:200}} fluid />
              </div>
              <div className="text p_relative d_block mb_25 mb-3">
                <h3
                  className="d_block fs_30 lh_40 fw_bold mb_5"
                  style={{ textAlign: "center" }}
                >
                  Registration Form For doctor
                </h3>
                {/* <p className="d_block fs_16 color_black font_family_poppins">Already have an account? <Link to="/login" style={{color:'#fec20e'}}>Sign in</Link></p> */}
              </div>
              <div className="form-inner">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={(values, { setSubmitting }) => {
                    // const isCheckboxChecked = values.agree;

                    // If checkbox is checked and there are no validation errors, proceed with form submission
                    // if (isCheckboxChecked) {
                    //   handleRegister(values);
                    // } else {
                    //   // If checkbox is not checked, display an error message or handle it as needed
                    //   alert('Please agree to the Terms & Conditions');
                    // }
                    console.log(values);
                    handleRegister(values);
                    setSubmitting(false);
                  }}
                >
                  {({
                    isSubmitting,
                    errors,
                    touched,
                    setFieldValue,
                    values,
                  }) => (
                    <Form className="default-form">
                      <Row>
                        <Col lg={6} md={6}>
                        <div
                        className={`form-outline mb-4 ${
                          errors.firstName && touched.firstName
                            ? "has-danger"
                            : ""
                        }`}
                       
                      >
                        <div className="col-4">
                          <Label>First Name:</Label>
                        </div>
                        <Field
                          type="text"
                          className={`form-control form-control-lg ${
                            errors.firstName && touched.firstName
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="First Name"
                          name="firstName"
                        />
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                        </Col>
                        <Col lg={6}md={6}>
                        <div
                        className={`form-outline mb-4 ${
                          errors.MiddleName && touched.MiddleName
                            ? "has-danger"
                            : ""
                        }`}
                       
                      >
                        <div className="col-4">
                          <Label>Middle Name:</Label>
                        </div>
                        <Field
                          type="text"
                          className={`form-control form-control-lg ${
                            errors.MiddleName && touched.MiddleName
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Middle Name"
                          name="MiddleName"
                        />
                        <ErrorMessage
                          name="MiddleName"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                        </Col>
                        <Col lg={6} md={6}>

                        <div
                        className={`form-outline mb-4 ${
                          errors.lastName && touched.lastName
                            ? "has-danger"
                            : ""
                        }`}
                        
                      >
                        <div className="col-4">
                          <Label>Last Name:</Label>
                        </div>
                        <Field
                          type="text"
                          className={`form-control form-control-lg ${
                            errors.firstName && touched.firstName
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Last Name"
                          name="lastName"
                        />
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                        </Col>
                        <Col lg={6} md={6}>
                        <div
                        className={`form-outline mb-4 ${
                          errors.Age && touched.Age ? "has-danger" : ""
                        }`}
                       
                      >
                        <div className="col-4">
                          <Label>Age:</Label>
                        </div>
                        <Field
                          type="text"
                          className={`form-control form-control-lg ${
                            errors.Age && touched.Age ? "is-invalid" : ""
                          }`}
                          placeholder="Age"
                          name="Age"
                        />
                        <ErrorMessage
                          name="Age"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                        </Col>
                        <Col lg={6} md={6}>
                        <div
                        className={`form-outline mb-4 ${
                          errors.Gender && touched.Gender ? "has-danger" : ""
                        }`}
                       
                      >
                        <div className="col-4">
                          <Label>Gender:</Label>
                        </div>
                        <Field
                          type="text"
                          className={`form-control form-control-lg ${
                            errors.Gender && touched.Gender ? "is-invalid" : ""
                          }`}
                          placeholder="Gender"
                          name="Gender"
                        />
                        <ErrorMessage
                          name="Gender"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                        </Col>
                        <Col lg={6} md={6}>
                        <div
                        className={`form-outline mb-4 ${
                          errors.email && touched.email ? "has-danger" : ""
                        }`}
                   
                      >
                        <div className="col-4">
                          <Label>Email:</Label>
                        </div>
                        <Field
                          type="text"
                          className={`form-control form-control-lg ${
                            errors.email && touched.email ? "is-invalid" : ""
                          }`}
                          placeholder="Email"
                          name="email"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                        </Col>
                        <Col lg={6}md={6}>

                        <div
                        className={`form-outline mb-4 ${
                          errors.Branch && touched.Branch ? "has-danger" : ""
                        }`}
                       
                      >
                        <div className="col-4">
                          <Label>Branch:</Label>
                        </div>
                        <Field
                          type="text"
                          className={`form-control form-control-lg ${
                            errors.Branch && touched.Branch ? "is-invalid" : ""
                          }`}
                          placeholder="Branch"
                          name="Branch"
                        />
                        <ErrorMessage
                          name="Branch"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                        </Col>
                        <Col lg={6}md={6}>
                        <div
                        className={`form-outline mb-4 ${
                          errors.Experience && touched.Experience
                            ? "has-danger"
                            : ""
                        }`}
                     
                      >
                        <div className="col-4">
                          <Label>Experience:</Label>
                        </div>
                        <Field
                          type="text"
                          className={`form-control form-control-lg ${
                            errors.Experience && touched.Experience
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Experience"
                          name="Experience"
                        />
                        <ErrorMessage
                          name="Experience"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                        </Col>
                        <Col lg={6} md={6}>

                        <div
                        className={`form-outline mb-4 ${
                          errors.Country && touched.Country ? "has-danger" : ""
                        }`}
                       
                      >
                        <div className="col-4">
                          <Label>Country:</Label>
                        </div>
                        <Field
                          type="text"
                          className={`form-control form-control-lg ${
                            errors.Country && touched.Country
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Country"
                          name="Country"
                        />
                        <ErrorMessage
                          name="Country"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                        </Col>
                        <Col lg={6} md={6}>

                        <div
                        className={`form-outline mb-4 ${
                          errors.State && touched.State ? "has-danger" : ""
                        }`}
                        
                      >
                        <div className="col-4">
                          <Label>State:</Label>
                        </div>
                        <Field
                          type="text"
                          className={`form-control form-control-lg ${
                            errors.State && touched.State ? "is-invalid" : ""
                          }`}
                          placeholder="State"
                          name="State"
                        />
                        <ErrorMessage
                          name="State"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                        </Col>
                        <Col lg={6} md={6}>
                        <div
                        className={`form-outline mb-4 ${
                          errors.City && touched.City ? "has-danger" : ""
                        }`}
                       
                      >
                        <div className="col-4">
                          <Label>City:</Label>
                        </div>
                        <Field
                          type="text"
                          className={`form-control form-control-lg ${
                            errors.City && touched.City ? "is-invalid" : ""
                          }`}
                          placeholder="City"
                          name="City"
                        />
                        <ErrorMessage
                          name="City"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                        </Col>
                        <Col lg={6} md={6}>
                        <div
                        className={`form-outline mb-4 ${
                          errors.Area && touched.Area ? "has-danger" : ""
                        }`}
                  
                      >
                        <div className="col-4">
                          <Label>Area:</Label>
                        </div>
                        <Field
                          type="text"
                          className={`form-control form-control-lg ${
                            errors.Area && touched.Area ? "is-invalid" : ""
                          }`}
                          placeholder="Area"
                          name="Area"
                        />
                        <ErrorMessage
                          name="Area"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                        </Col>
                        <Col lg={6} md={6}>
                        <div
                        className={`form-outline mb-4 ${
                          errors.Address && touched.Address ? "has-danger" : ""
                        }`}
                      
                      >
                        <div className="col-4">
                          <Label>Address</Label>
                        </div>
                        <Field
                          type="text"
                          className={`form-control form-control-lg ${
                            errors.Address && touched.Address
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Address"
                          name="Address"
                        />
                        <ErrorMessage
                          name="Address"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                        </Col>
                        <Col lg={6} md={6}>
  
                        <div
                        className={`form-outline mb-4 ${
                          errors.Phone && touched.Phone ? "has-danger" : ""
                        }`}
                      
                      >
                        <div className="col-4">
                          <Label>Phone No:</Label>
                        </div>
                        <Field
                          type="text"
                          className={`form-control form-control-lg ${
                            errors.Phone && touched.Phone ? "is-invalid" : ""
                          }`}
                          placeholder="Phone"
                          name="Phone"
                        />
                        <ErrorMessage
                          name="Phone"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                        </Col>
                        <Col lg={6} md={6}>
                        <div
                        className={`form-outline mb-4 ${
                          errors.Remark && touched.Remark ? "has-danger" : ""
                        }`}
                       
                      >
                        <div className="col-4">
                          <Label>Any Remark:</Label>
                        </div>
                        <Field
                          type="Remark"
                          className={`form-control form-control-lg ${
                            errors.Remark && touched.Remark ? "is-invalid" : ""
                          }`}
                          placeholder="Remark"
                          name="Remark"
                        />
                        <ErrorMessage
                          name="Phone"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                        </Col>
                        <Col lg={6} md={6}>
                        <div
                        className={`form-outline mb-4 ${
                          errors.degreePhoto && touched.degreePhoto
                            ? "has-danger"
                            : ""
                        }`}
                       
                      >
                        <div className="col-4">
                          <Label>Degree Photo:</Label>
                        </div>{" "}
                        <input
                          id="file"
                          name="degreePhoto"
                          type="file"
                          // className={`form-control form-control-lg ${errors.degreePhoto && touched.degreePhoto ? 'is-invalid' : ''}`}

                          onChange={(event) => {
                            setFieldValue(
                              "degreePhoto",
                              event.currentTarget.files[0]
                            );
                          }}
                        />
                        {/* <ErrorMessage name="degreePhoto" component="div" className="invalid-feedback" /> */}
                      </div>
                        </Col>
                        <Col lg={6} md={6}>
                        <div
                        className={`form-outline mb-4 ${
                          errors.certificate && touched.certificate
                            ? "has-danger"
                            : ""
                        }`}
                      
                      >
                        <div className="col-4">
                          <Label>Cretificate:</Label>
                        </div>
                        <input
                          id="file"
                          name="certificate"
                          type="file"
                          // className={`form-control form-control-lg ${errors.degreePhoto && touched.degreePhoto ? 'is-invalid' : ''}`}

                          onChange={(event) => {
                            setFieldValue(
                              "certificate",
                              event.currentTarget.files[0]
                            );
                          }}
                        />
                        {/* <ErrorMessage name="degreePhoto" component="div" className="invalid-feedback" /> */}
                      </div>
                          </Col>
                          <Col lg={6} md={6} >
     
                          <div
                        className={`form-outline mb-4 ${
                          errors.hospitalphoto && touched.hospitalphoto
                            ? "has-danger"
                            : ""
                        }`}
                     
                      >
                        <div className="col-4">
                          <Label>Hospital Photo:</Label>
                        </div>
                        <input
                          id="file"
                          name="hospitalphoto"
                          type="file"
                          // className={`form-control form-control-lg ${errors.degreePhoto && touched.degreePhoto ? 'is-invalid' : ''}`}

                          onChange={(event) => {
                            setFieldValue(
                              "hospitalphoto",
                              event.currentTarget.files[0]
                            );
                          }}
                        />
                        {/* <ErrorMessage name="degreePhoto" component="div" className="invalid-feedback" /> */}
                      </div>
                          </Col>
                          <Col lg={6} md={6}>
                          <div
                        className={`form-outline mb-4 ${
                          errors.VideoUrl && touched.VideoUrl
                            ? "has-danger"
                            : ""
                        }`}
                     
                      >
                        <div className="col-4">
                          <Label>Video Url:</Label>
                        </div>
                        <input
                          id="file"
                          name="certificate"
                          type="file"
                          accept=".mp4 , .mkv"
                          // className={`form-control form-control-lg ${errors.degreePhoto && touched.degreePhoto ? 'is-invalid' : ''}`}

                          onChange={(event) => {
                            setFieldValue(
                              "VideoUrl",
                              event.currentTarget.files[0]
                            );
                          }}
                        />
                        {/* <ErrorMessage name="degreePhoto" component="div" className="invalid-feedback" /> */}
                      </div>
                          </Col>
                      </Row>


                      <div className="form-group message-btn">
                        <Button
                          type="submit"
                        //   style={{ backgroundColor: "#ea2691" }}
                          className="theme-btn theme-btn-five"
                        >
                          Submit Inquiry <i className="icon-4" />
                        </Button>
                      </div>
                      {/* <ThankYouModal /> */}
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </section>
      
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default DoctorInquiry;
