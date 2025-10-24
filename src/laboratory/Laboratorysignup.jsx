import React, { useState, useEffect } from "react";
import axios from "axios";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import Pagetitle from "../patients/Pagetitle";
import { Container, Row, Col, Form, Button, Label } from "react-bootstrap";
import laboratoryimage from "../img/laboratory-login.jpg";
import { RxSlash } from "react-icons/rx";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import CommonSec from "../navbar/CommonSec";

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
  confirmpass: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  licenceno: Yup.string().required("License No. is required"),
  licencedate: Yup.date().required("License Date is required"),
  LabRegistrationDate: Yup.date().required("Lab Registration Date is required"),
  city: Yup.string().required("city is required"),
  labStartTime1: Yup.string().required("Time Slot is required"),
  // labStartTime2: Yup.string().required('Time Slot is required'),
  // labStartTime3: Yup.string().required('Time Slot is required'),
  labEndTime1: Yup.string().required("Time Slot is required"),
  // labEndTime2: Yup.string().required('Time Slot is required'),
  // labEndTime3: Yup.string().required('Time Slot is required'),
  pincode: Yup.string().required("Pincode is required"),
  address: Yup.string().required("Address is required"),
  DaysLab1: Yup.string().required("days are required"),
  DaysLab2: Yup.string().required("days are required"),
  DaysLab3: Yup.string().required("days are required"),
  LabTests: Yup.string().required("LabTests is required"),
  area: Yup.string().required("area is required"),
  pdfFile: Yup.string().required("file is required"),
  photo: Yup.string().required("photo is required"),
  ReferralCode: Yup.string(),
});

function Laboratorysignup() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [daysData, setDaysData] = useState([]);
  const [loc, setLoc] = useState([]);
  const [labTest, setLabTest] = useState([]);
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const listDay = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/Days`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching days data:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const days = await listDay();
        setDaysData(days);
      } catch (error) {
        console.error("Error setting days data:", error);
      }
    };

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

    const fetchLaboratoryTest = async () => {
      try {
        const test = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/getAllLabTests`
        );
        const laboratoryTest = test.data.filter(
          (laboratoryTestActive) => laboratoryTestActive.IsActive
        );
        setLabTest(laboratoryTest);
      } catch (error) {
        console.error("Error fetching laboratory tests:", error);
      }
    };
    fetchLaboratoryTest();

    fetchDays();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.currentTarget.files[0]);
  };
  const handlepdfChange = (event) => {
    setPdf(event.currentTarget.files[0]);
  };

  const generateUniqueReferenceNo = async () => {
    try {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // JS months are 0-based
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");

      // Fetch the count of entries in the database
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/getLabCount`
      );
      const count = response.data.count;

      const sequenceNumber = String(count + 1).padStart(6, "0"); // Add 1 to the count to get the next sequence number

      return `LAB${year}${month}${day}${hours}${sequenceNumber}`;
    } catch (error) {
      console.error("Error fetching lab count:", error);
      // Handle error appropriately, e.g., throw an error or return a default value
      throw new Error("Failed to generate unique reference number");
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("LabName", values.name);
      formData.append("EmailLab", values.email);
      formData.append("mobileNumber", values.contact);
      formData.append("Password", values.password);
      formData.append("LabLicenseNumber", values.licenceno);
      formData.append("LabLicenseDate", values.licencedate);
      formData.append("LabRegistrationDate", values.LabRegistrationDate);
      formData.append("city", values.city);
      formData.append("LabStartTime1", values.labStartTime1);
      formData.append("LabStartTime2", values.labStartTime2);
      formData.append("LabStartTime3", values.labStartTime3);
      formData.append("LabEndTime1", values.labEndTime1);
      formData.append("LabEndTime2", values.labEndTime2);
      formData.append("LabEndTime3", values.labEndTime3);
      formData.append("Pincode", values.pincode);
      formData.append("DaysLab1", values.DaysLab1);
      formData.append("DaysLab2", values.DaysLab2);
      formData.append("DaysLab3", values.DaysLab3);
      formData.append("address", values.address);
      formData.append("area", values.area);
      formData.append("LabTests", values.LabTests);
      formData.append("Speciality", values.Speciality);
      if (values.ReferralCode) {
        formData.append("ReferralCode", values.ReferralCode);
      }
      formData.append("photo", file);
      formData.append("pdfFile", pdf);
      formData.append("isActive", false);

      const uniqueReferenceNo = await generateUniqueReferenceNo();
      formData.append("LabReferenceNo", uniqueReferenceNo);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/createLaboratery`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        title: "Success!",
        text: "Laboratory registered successfully",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/laboratory-login");
      });
    } catch (error) {
      console.error("Error creating laboratory:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to create Laboratory",
        icon: "error",
        confirmButtonText: "OK",
      });
      setSubmitting(false); // Reset form submission state
    }
  };

  const [disabled1, setIsDisbled1] = useState(false);
  const [disabled2, setIsDisbled2] = useState(false);

  const [newCity, setNewCity] = useState();
  const [isCityInputMode, setIsCityInputMode] = useState(false);

  const handleInputBlur = async (e, setFieldValue) => {
    const newCategory = e.target.value.trim();

    if (newCategory) {
      const createdCategory = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/create/City`,
        { Name: newCity, IsActive: true }
      );

      console.log("pp",createdCategory);

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

      <div className="page-title-area">
        <Pagetitle
          heading="JOIN OUR LABORATORY NETWORK"
          pagetitlelink="/"
          title1="Login"
          title2="Signup"
          IconComponent={RxSlash}
        />
      </div>

      <section className="services-area ptb-70 pb-5">
        <Container>
          <Row className="justify-content-center" id="signupPanel">
            <div className="wrap d-md-flex">
              <div
                className="img"
                style={{ backgroundImage: `url(${laboratoryimage})` }}
              ></div>
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
                    confirmpass: "",
                    licenceno: "",
                    licencedate: "",
                    LabRegistrationDate: "",
                    city: "",
                    labStartTime1: "",
                    labStartTime2: "",
                    labStartTime3: "",
                    labEndTime1: "",
                    labEndTime2: "",
                    labEndTime3: "",
                    pincode: "",
                    address: "",
                    DaysLab1: "",
                    DaysLab2: "",
                    DaysLab3: "",
                    area: "",
                    pdfFile: "",
                    photo: "",
                    ReferralCode: "",
                    LabTests: "",
                  }}
                  validationSchema={SignupSchema}
                  onSubmit={handleSubmit}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    setFieldValue,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                  }) => (
                    <Form className="signin-form row" onSubmit={handleSubmit}>
                      <div className="step-1 d-block">
                        <Row className="justify-content-center">
                          <Col lg={6} className="form-group mb-3">
                            <Form.Label>
                              Laboratory Name{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              placeholder="Laboratory Name"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.name}
                              isInvalid={touched.name && errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.name}
                            </Form.Control.Feedback>
                          </Col>
                          <Col lg={6} className="form-group mb-3">
                            <Form.Label>
                              Laboratory Email Address{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="email"
                              placeholder="Email Address"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.email}
                              isInvalid={touched.email && errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.email}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={6} className="form-group mb-3">
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
                              isInvalid={touched.password && errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.password}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={6} className="form-group mb-3">
                            <Form.Label>
                              Confirm Password{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="password"
                              name="confirmpass"
                              placeholder="Confirm Password"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.confirmpass}
                              isInvalid={
                                touched.confirmpass && errors.confirmpass
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.confirmpass}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={6} className="form-group mb-3">
                            <Form.Label>
                              Laboratory Licence No.{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="licenceno"
                              placeholder="Laboratory Licence No."
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.licenceno}
                              isInvalid={touched.licenceno && errors.licenceno}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.licenceno}
                            </Form.Control.Feedback>
                          </Col>
                          <Col lg={6} className="form-group mb-3">
                            <Form.Label>
                              Laboratory Licence Date{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="date"
                              name="licencedate"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.licencedate}
                              isInvalid={
                                touched.licencedate && errors.licencedate
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.licencedate}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={6} className="form-group mb-3">
                            <Form.Label>
                              Laboratory Registration Date{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="date"
                              name="LabRegistrationDate"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.LabRegistrationDate}
                              isInvalid={
                                touched.LabRegistrationDate &&
                                errors.LabRegistrationDate
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.LabRegistrationDate}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={6} className="form-group mb-3">
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
                                onBlur={(e) =>
                                  handleInputBlur(e, setFieldValue)
                                }
                                value={newCity}
                              />
                            )}
                            <Form.Control.Feedback type="invalid">
                              {errors.city}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={6} className="form-group mb-3">
                            <Form.Label>
                              Upload Photo{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="file"
                              name="photo"
                              accept=".jpg,.jpeg,.png"
                              onChange={(event) => {
                                handleFileChange(event);
                                handleChange(event);
                              }}
                              onBlur={handleBlur}
                              isInvalid={touched.photo && errors.photo}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.photo}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={6} className="form-group mb-3">
                            <Form.Label>
                              Upload Licence{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="file"
                              name="pdfFile"
                              accept=".pdf,.docx,.excel"
                              onChange={(event) => {
                                handlepdfChange(event);
                                handleChange(event);
                              }}
                              onBlur={handleBlur}
                              isInvalid={touched.pdfFile && errors.pdfFile}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.pdfFile}
                            </Form.Control.Feedback>
                          </Col>

                          {/* start time 1 */}

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Days <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              as="select"
                              name="DaysLab1"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.DaysLab1}
                              isInvalid={touched.DaysLab1 && errors.DaysLab1}
                            >
                              <option value="">Select Days</option>
                              {daysData.map((day) => (
                                <option key={day._id} value={day._id}>
                                  {day.Days}
                                </option>
                              ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                              {errors.DaysLab1}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Lab Start Time 1{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="time"
                              name="labStartTime1"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.labStartTime1}
                              isInvalid={
                                touched.labStartTime1 && errors.labStartTime1
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.labStartTime1}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Lab End Time 1{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="time"
                              name="labEndTime1"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.labEndTime1}
                              isInvalid={
                                touched.labEndTime1 && errors.labEndTime1
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.labEndTime1}
                            </Form.Control.Feedback>
                          </Col>

                          {/* start time 2 */}

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Days<span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              as="select"
                              name="DaysLab2"
                              onChange={(e) => {
                                const selectedDayId = e.target.value;
                                handleChange(e); // Formik's change handler

                                // Find the selected day object from the daysData array using the ID
                                const selectedDay = daysData.find(
                                  (day) => day._id === selectedDayId
                                );

                                if (selectedDay) {
                                  if (
                                    selectedDay.Days === "Sat(closed)" ||
                                    selectedDay.Days === "Sun(closed)"
                                  ) {
                                    // Disable time fields if selected day is "Sat(closed)" or "Sun(closed)"
                                    setFieldValue("labStartTime2", ""); // Clear start time field
                                    setFieldValue("labEndTime2", ""); // Clear end time field
                                    setFieldValue("timeFieldsDisabled", true); // Disable time fields
                                    setIsDisbled1(true);
                                  } else {
                                    setIsDisbled1(false);
                                    // Enable time fields for other days
                                    setFieldValue("timeFieldsDisabled", false);
                                  }
                                }
                              }}
                              onBlur={handleBlur}
                              value={values.DaysLab2}
                              isInvalid={touched.DaysLab2 && errors.DaysLab2}
                            >
                              <option value="">Select Days</option>
                              {daysData.map((day) => (
                                <option key={day._id} value={day._id}>
                                  {day.Days}
                                </option>
                              ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                              {errors.DaysLab2}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Lab Start Time 2{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="time"
                              name="labStartTime2"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.labStartTime2}
                              isInvalid={
                                touched.labStartTime2 && errors.labStartTime2
                              }
                              disabled={disabled1}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.labStartTime2}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Lab End Time 2{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="time"
                              name="labEndTime2"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.labEndTime2}
                              isInvalid={
                                touched.labEndTime2 && errors.labEndTime2
                              }
                              disabled={disabled1}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.labEndTime2}
                            </Form.Control.Feedback>
                          </Col>

                          {/* start time 3 */}

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Days<span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              as="select"
                              name="DaysLab3"
                              onChange={(e) => {
                                const selectedDayId = e.target.value;
                                handleChange(e); // Formik's change handler

                                // Find the selected day object from the daysData array using the ID
                                const selectedDay = daysData.find(
                                  (day) => day._id === selectedDayId
                                );

                                if (selectedDay) {
                                  if (
                                    selectedDay.Days === "Sat(closed)" ||
                                    selectedDay.Days === "Sun(closed)"
                                  ) {
                                    // Disable time fields if selected day is "Sat(closed)" or "Sun(closed)"
                                    setFieldValue("labStartTime3", ""); // Clear start time field
                                    setFieldValue("labEndTime3", ""); // Clear end time field
                                    setFieldValue("timeFieldsDisabled", true); // Disable time fields
                                    setIsDisbled2(true);
                                  } else {
                                    setIsDisbled2(false);
                                    // Enable time fields for other days
                                    setFieldValue("timeFieldsDisabled", false);
                                  }
                                }
                              }}
                              onBlur={handleBlur}
                              value={values.DaysLab3}
                              isInvalid={touched.DaysLab3 && errors.DaysLab3}
                            >
                              <option value="">Select Days</option>
                              {daysData.map((day) => (
                                <option key={day._id} value={day._id}>
                                  {day.Days}
                                </option>
                              ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                              {errors.DaysLab3}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Lab Start Time 3{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="time"
                              name="labStartTime3"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.labStartTime3}
                              isInvalid={
                                touched.labStartTime3 && errors.labStartTime3
                              }
                              disabled={disabled2}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.labStartTime3}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Lab End Time 3{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="time"
                              name="labEndTime3"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.labEndTime3}
                              isInvalid={
                                touched.labEndTime3 && errors.labEndTime3
                              }
                              disabled={disabled2}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.labEndTime3}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={6} className="form-group mb-3">
                            <Form.Label>
                              Pincode <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="pincode"
                              placeholder="Pincode"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.pincode}
                              isInvalid={touched.pincode && errors.pincode}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.pincode}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={6} className="form-group mb-3">
                            <Form.Label>
                              Area <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="area"
                              placeholder="Area"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.area}
                              isInvalid={touched.area && errors.area}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.area}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={6} className="form-group mb-3">
                            <Form.Label>
                              Contact No.{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="contact"
                              placeholder="Contact No."
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.contact}
                              isInvalid={touched.contact && errors.contact}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.contact}
                            </Form.Control.Feedback>
                          </Col>
                          <Col lg={6} className="form-group mb-3">
                            <Form.Label>
                              Lab Test <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              as="select"
                              name="LabTests"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.LabTests}
                              isInvalid={touched.LabTests && errors.LabTests}
                            >
                              <option value="">Select Lab Test</option>
                              {labTest?.map((test) => (
                                <option key={test._id} value={test._id}>
                                  {test.TestName}
                                </option>
                              ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                              {errors.LabTests}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={12} className="form-group mb-3">
                            <Form.Label>
                              Address <span style={{ color: "red" }}>*</span>{" "}
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="address"
                              placeholder="Address"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.address}
                              isInvalid={touched.address && errors.address}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.address}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={12} className="form-group d-md-flex mb-4">
                            <div className="w-100 text-start">
                              <label className="checkbox-wrap checkbox-primary mb-0">
                                <input type="checkbox" required />
                                <span className="checkmark"></span> I agree to
                                all statements in{" "}
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
                              Any Referral code ?(optional)
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
                        </Row>
                      </div>
                    </Form>
                  )}
                </Formik>
                <p className="text-center">
                  Already have an account?{" "}
                  <Link to="/laboratory-login" className="d-inline-block">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Laboratorysignup;
