import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import logo from "../img/logo.jpg";
import axios from "axios";
import bg1 from "../img/logo.jpg";
import bg2 from "../img/logo.jpg";
import { Col, Label, Row } from "reactstrap";
import ThankYouModal from "./ThankYouModal";
import { useParams } from "react-router-dom";
import Select from "react-select"
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import CommonSec from "../navbar/CommonSec";

function Patinent() {
  // const { id } = useParams();
  // console.log("object",id)
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [showOtherMedical, setShowOtherMedical] = useState(false);

  const [submittedValues, setSubmittedValues] = useState({});
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [Venues, setVenue] = useState([]);
  const [mydata, setMyData] = useState("");
  const [mydate, setmydate] = useState("");
  console.log("preyashdate", mydate);

  const [myPaydata, setMyPayData] = useState(false);
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/MedicalCondition`
      )
      .then((res) => {
        setMedicalConditions(res.data);
        // console.log("newww", res.data);
      });
    axios
      .get(`${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/future-Camps`)
      .then((res) => {
        setVenue(res.data);
        // console.log("newww camp", res.data);
      });
  }, []);

  const fetchData = async (mydata2) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/getbyid/getCamp/${mydata2}`
      );
      console.log("mydata", response.data);
      setMyPayData(response.data);
      const formattedDate = new Date(response.data.Date)
        .toISOString()
        .split("T")[0];
      setmydate(formattedDate); // Update state with the formatted date
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //  useEffect(()=>{
  //   axios.get(`${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/getbyid/Society/${id}`).then((res)=>{

  //     console.log("mydata",res.data)
  //     setMyData(res.data)
  //     }
  //    );
  //  },[id])

  console.log(mydata);
  const initialValues = {
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    Phone: "",
    Gender: "",
    DOB: "",
    CampDate: "",
    Venue: "",
    Address: "",
    DocRef: "",
    Medical: [],
    Remark: "",
    Receivedid: Date.now(),
    ReceivedImage: "",
    IsActive: true,
    OtherMedicalCondition: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    middleName: Yup.string().required("Middle Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    Phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    Gender: Yup.string().required("Gender is required"),
    DOB: Yup.date().required("Date of Birth is required"),
    // CampDate: Yup.date().required("Camp Date is required"),
    Address: Yup.string().required("Your Address is required"),
    Venue: Yup.string().required("Camp Venue is required"),
    DocRef: Yup.string().required("Reference is required"),
    Medical: Yup.array()
    .min(1, "At least one medical condition is required")
    .required("Medical condition is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleRegister = async (values) => {
    try {
      setSubmittedValues(values);
      setShowThankYouModal(true);
    } catch (error) {
      console.error("Some error:", error);
      alert("Request failed. Please try again.");
    }
  };

  const handleFreeRegister = async (values) => {
    try {
      // Log the values to check if CampDate and other fields are correctly included
      console.log("Submitting values:", values);

      const formdata = new FormData();
      formdata.append("IsActive", values.IsActive);
      formdata.append("Remark", values.Remark);
      formdata.append("ReceivedImage", ""); // No image submitted, setting as empty string
      formdata.append("Medical", values.Medical);
      formdata.append("OtherMedicalCondition", values.OtherMedicalCondition);
      formdata.append("DocRef", values.DocRef);
      formdata.append("Address", values.Address);
      formdata.append("DOB", values.DOB);
      formdata.append("Venue", values.Venue);
      formdata.append("CampDate", mydate); // Ensure CampDate is formatted correctly
      formdata.append("Society", values.Society);
      formdata.append("Gender", values.Gender);
      formdata.append("Phone", values.Phone);
      formdata.append("email", values.email);
      formdata.append("middleName", values.middleName);
      formdata.append("firstName", values.firstName);
      formdata.append("lastName", values.lastName);
      formdata.append("Password", values.password); // Add the new password field

      // First API call (Patient Inquiry)
      const responseInquiry = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/create/PatientInquiryWithSociety`,
        formdata
      );

      console.log(responseInquiry);

      if (responseInquiry.data.isOk) {
        alert("Inquiry Successful");

        // Prepare data for the second API call (Patient Creation)
        const patientData = {
          IsActive: values.IsActive,
          Remark: values.Remark,
          Medical: values.Medical,
          OtherMedicalCondition: values.OtherMedicalCondition,
          DocRef: values.DocRef,
          Address: values.Address,
          DOB: values.DOB,
          Venue: values.Venue,
          CampDate: mydate,
          Society: values.Society,
          Gender: values.Gender,
          Phone: values.Phone,
          email: values.email,
          middleName: values.middleName,
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password, // Include password in the second API call
        };
        console.log("patient data", patientData);
        await createPatient(formdata);
        // Second API call (Patient Creation) - No image, so sending JSON instead of multipart/form-data
      } else {
        alert("Inquiry failed.");
      }
    } catch (error) {
      console.error("Some error:", error);
      alert("Request failed. Please try again.");
    }
  };

  const createPatient = async (formdata) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/create/patient-via-inquiry`,
        formdata
      );
      console.log(res);
    } catch (error) {
      console.error("Some error:", error);
    }
  };

  return (
    <>
      <CommonSec />
      <Modalnavigationbar />
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
                <Image
                  src={logo}
                  className="h-100"
                  style={{ minWidth: 200 }}
                  fluid
                />
              </div>
              <div className="text p_relative d_block mb_25 mb-3">
                <h3
                  className="d_block fs_30 lh_40 fw_bold mb_5"
                  style={{ textAlign: "center" }}
                >
                  Camp Registration cum Membership Form
                </h3>
              </div>
              <div className="form-inner">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    setShowOtherMedical(false);
                    setMyData("");
                    // console.log("clg", values.Medical);
                    if (myPaydata.pay === true) {
                      handleRegister(values);
                      setSubmitting(false);
                    } else {
                      handleFreeRegister(values);
                    }

                    resetForm();
                  }}
                >
                  {({
                    isSubmitting,
                    errors,
                    touched,
                    setFieldValue,
                    values,
                    resetForm,
                  }) => (
                    <>
                      <Form>
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
                                <Label
                                  htmlFor="firstName"
                                  className="form-Label"
                                >
                                  First Name:
                                </Label>
                                <span style={{ color: "red" }}>*</span>
                              </div>
                              <Field
                                type="text"
                                className={`form-control form-control-lg ${
                                  errors.firstName && touched.firstName
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="firstName"
                                name="firstName"
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
                                errors.middleName && touched.middleName
                                  ? "has-danger"
                                  : ""
                              }`}
                            >
                              <div className="col-4">
                                <Label
                                  htmlFor="middleName"
                                  className="form-Label"
                                >
                                  Middle Name:
                                </Label>
                                <span style={{ color: "red" }}>*</span>
                              </div>
                              <Field
                                type="text"
                                className={`form-control form-control-lg ${
                                  errors.middleName && touched.middleName
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="middleName"
                                name="middleName"
                              />
                              <ErrorMessage
                                name="middleName"
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
                                <Label
                                  htmlFor="lastName"
                                  className="form-Label"
                                >
                                  Last Name:
                                </Label>
                                <span style={{ color: "red" }}>*</span>
                              </div>
                              <Field
                                type="text"
                                className={`form-control form-control-lg ${
                                  errors.lastName && touched.lastName
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="lastName"
                                name="lastName"
                              />
                              <ErrorMessage
                                name="lastName"
                                component="div"
                                className="invalid-feedback"
                              />
                            </div>
                          </Col>
                          <Col lg={6} md={6}>
                            <div
                              className={`form-outline mb-4 ${
                                errors.email && touched.email
                                  ? "has-danger"
                                  : ""
                              }`}
                            >
                              <div className="col-4">
                                <Label>Email:</Label>
                                <span style={{ color: "red" }}>*</span>
                              </div>
                              <Field
                                type="email"
                                className={`form-control form-control-lg ${
                                  errors.email && touched.email
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="email"
                                name="email"
                              />
                              <ErrorMessage
                                name="email"
                                component="div"
                                className="invalid-feedback"
                              />
                            </div>
                          </Col>
                          <Col lg={6} md={6}>
                            <div
                              className={`form-outline mb-4 ${
                                errors.Phone && touched.Phone
                                  ? "has-danger"
                                  : ""
                              }`}
                            >
                              <div className="col-4">
                                <Label>Phone No:</Label>
                                <span style={{ color: "red" }}>*</span>
                              </div>
                              <Field
                                type="number"
                                className={`form-control form-control-lg ${
                                  errors.Phone && touched.Phone
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="Phone"
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
                                errors.Gender && touched.Gender
                                  ? "has-danger"
                                  : ""
                              }`}
                            >
                              <div className="col-4">
                                <Label>Gender:</Label>
                                <span style={{ color: "red" }}>*</span>
                              </div>
                              <Field
                                component="select"
                                className={`form-select ${
                                  errors.Gender && touched.Gender
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="Gender"
                                name="Gender"
                              >
                                <option value="" label="Select gender" />
                                <option value="male" label="Male" />
                                <option value="female" label="Female" />
                              </Field>
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
                                errors.DOB && touched.DOB ? "has-danger" : ""
                              }`}
                            >
                              <div className="col-4">
                                <Label>Date of Birth:</Label>
                                <span style={{ color: "red" }}>*</span>
                              </div>
                              <Field
                                type="date"
                                className={`form-control form-control-lg ${
                                  errors.DOB && touched.DOB ? "is-invalid" : ""
                                }`}
                                id="DOB"
                                name="DOB"
                              />
                              <ErrorMessage
                                name="DOB"
                                component="div"
                                className="invalid-feedback"
                              />
                            </div>
                          </Col>
                          <Col lg={6} md={6}>
                            <div
                              className={`form-outline mb-4 ${
                                errors.Address && touched.Address
                                  ? "has-danger"
                                  : ""
                              }`}
                            >
                              <div className="col-4">
                                <Label>Your Address:</Label>
                                <span style={{ color: "red" }}>*</span>
                              </div>
                              <Field
                                type="text"
                                className={`form-control form-control-lg ${
                                  errors.Address && touched.Address
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="Address"
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
                                errors.Venue && touched.Venue
                                  ? "has-danger"
                                  : ""
                              }`}
                            >
                              <div className="col-4">
                                <Label>Camp Venue:</Label>
                                <span style={{ color: "red" }}>*</span>
                              </div>
                              <Field
                                as="select"
                                className={`form-select ${
                                  errors.Venue && touched.Venue
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="Venue"
                                name="Venue"
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setMyData(event.target.value);
                                  setFieldValue("Venue", value);
                                  fetchData(event.target.value);
                                }}
                              >
                                <option value="">Select Camp Venue</option>
                                {Venues.length>0 &&
                                  Venues.map(
                                    (item, index) => (
                                      <option key={index} value={item._id}>
                                        {item.Society}
                                      </option>
                                    )
                                  )}
                              </Field>
                              <ErrorMessage
                                name="Venue"
                                component="div"
                                className="invalid-feedback"
                              />
                            </div>
                          </Col>
                          <Col lg={6} md={6}>
                            <div
                              className={`form-outline mb-4 ${
                                errors.CampDate && touched.CampDate
                                  ? "has-danger"
                                  : ""
                              }`}
                            >
                              <div className="col-4">
                                <Label>Camp Date:</Label>
                                <span style={{ color: "red" }}>*</span>
                              </div>
                              <Field
                                type="date"
                                className={`form-control form-control-lg ${
                                  errors.CampDate && touched.CampDate
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="CampDate"
                                name="CampDate"
                                value={mydate} // Ensure value is properly set
                                readOnly // Make the field read-only
                              />
                              <ErrorMessage
                                name="CampDate"
                                component="div"
                                className="invalid-feedback"
                              />
                            </div>
                          </Col>

                          <Col lg={6} md={6}>
                            <div
                              className={`form-outline mb-4 ${
                                errors.DocRef && touched.DocRef
                                  ? "has-danger"
                                  : ""
                              }`}
                            >
                              <div className="col-4">
                                <Label>Reference:</Label>
                                <span style={{ color: "red" }}>*</span>
                              </div>
                              <Field
                                type="text"
                                className={`form-control form-control-lg ${
                                  errors.DocRef && touched.DocRef
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="DocRef"
                                name="DocRef"
                              />
                              <ErrorMessage
                                name="DocRef"
                                component="div"
                                className="invalid-feedback"
                              />
                            </div>
                          </Col>
                          {!showOtherMedical ? (
                            <Col lg={6} md={6}>
                              <div
                                className={`form-outline mb-4 ${
                                  errors.Medical && touched.Medical
                                    ? "has-danger"
                                    : ""
                                }`}
                              >
                                <div className="col-4">
                                  <Label>Medical Condition:</Label>
                                  <span style={{ color: "red" }}>*</span>
                                </div>
                                {/* <Field
                                  as="select"
                                  className={`form-select ${
                                    errors.Medical && touched.Medical
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  id="Medical"
                                  name="Medical"
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    setFieldValue("Medical", value);
                                    if (value === "6661a1d061fd5a0faa7de829") {
                                      setShowOtherMedical(true);
                                    } else {
                                      setShowOtherMedical(false);
                                    }
                                  }}
                                >
                                  <option value="">
                                    Select Medical Condition
                                  </option>
                                  {medicalConditions &&
                                    medicalConditions
                                      .filter((item) => item.IsActive)
                                      .map((item, index) => (
                                        <option key={item._id} value={item._id}>
                                          {item.MedicalCondition}
                                        </option>
                                      ))}
                                </Field> */}
                                 <Select
      isMulti
      name="Medical"
      className={`form-select ${
        errors.Medical && touched.Medical
          ? "is-invalid"
          : ""
      }`}
      options={medicalConditions
        ?.filter((item) => item.IsActive)
        ?.map((item) => ({
          value: item._id,
          label: item.MedicalCondition,
        }))}
      onChange={(selectedOptions) => {
        const values = selectedOptions.map((option) => option.value);
        setFieldValue("Medical", values);
        if (values.includes("6661a1d061fd5a0faa7de829")) {
          setShowOtherMedical(true);
        } else {
          setShowOtherMedical(false);
        }
      }}
      // onBlur={handleBlur}
      value={values?.Medical?.map((id) => {
        const condition = medicalConditions.find((item) => item._id === id);
        return condition ? { value: id, label: condition.MedicalCondition } : null;
      })}
      classNamePrefix="react-select"
    />
                                <ErrorMessage
                                  name="Medical"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                            </Col>
                          ) : (
                            <Col lg={6} md={6}>
                              <div className="form-outline mb-4">
                                <div className="col-4">
                                  <Label>Other Medical Condition:</Label>
                                  <span style={{ color: "red" }}>*</span>
                                </div>
                                <Field
                                  type="text"
                                  className="form-select"
                                  id="OtherMedicalCondition"
                                  name="OtherMedicalCondition"
                                />
                              </div>
                            </Col>
                          )}
                          <Col lg={6} md={6}>
                            <div
                              className={`form-outline mb-4 ${
                                errors.Remark && touched.Remark
                                  ? "has-danger"
                                  : ""
                              }`}
                            >
                              <div className="col-4">
                                <Label>Remark:</Label>
                              </div>
                              <Field
                                type="text"
                                className="form-control form-control-lg"
                                id="Remark"
                                name="Remark"
                              />
                            </div>
                          </Col>

                          <Col lg={6} md={6}>
                            <div
                              className={`form-outline mb-4 ${
                                errors.password && touched.password
                                  ? "has-danger"
                                  : ""
                              }`}
                            >
                              <div className="col-4">
                                <Label htmlFor="password" className="form-Label">
                                  Password:
                                </Label>
                                <span style={{ color: "red" }}>*</span>
                              </div>
                              <Field
                                type="password"
                                className={`form-control form-control-lg ${
                                  errors.password && touched.password
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="password"
                                name="password"
                              />
                              <ErrorMessage
                                name="password"
                                component="div"
                                className="invalid-feedback"
                              />
                              <div className="text-muted small">
                                (For Future online access and login to avail
                                various medical facilities)
                              </div>
                            </div>
                          </Col>

                          <Col lg={12}>
                            <div className="form-outline  mt-4">
                              <Button
                                type="submit"
                                className="btn btn-success"
                                disabled={isSubmitting}
                              >
                                Submit
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                      <ThankYouModal
                        show={showThankYouModal}
                        IsActive={submittedValues.IsActive}
                        Receivedid={submittedValues.Receivedid}
                        Remark={submittedValues.Remark}
                        Medical={submittedValues.Medical}
                        OtherMedicalCondition={
                          submittedValues.OtherMedicalCondition
                        }
                        DocRef={submittedValues.DocRef}
                        Address={submittedValues.Address}
                        DOB={submittedValues.DOB}
                        Gender={submittedValues.Gender}
                        Phone={submittedValues.Phone}
                        email={submittedValues.email}
                        middleName={submittedValues.middleName}
                        lastName={submittedValues.lastName}
                        firstName={submittedValues.firstName}
                        Venue={submittedValues.Venue}
                        CampDate={submittedValues.CampDate}
                        Society={submittedValues.Society}
                        ReceivedImage=""
                        handleClose={() => {
                          setShowThankYouModal(false);
                          resetForm();
                        }}
                        errors={errors}
                        touched={touched}
                        setFieldValue={setFieldValue}
                      />
                    </>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Patinent;
