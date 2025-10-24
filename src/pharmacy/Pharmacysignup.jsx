import React, { useState, useEffect } from "react";
import axios from "axios";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import Pagetitle from "../patients/Pagetitle";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import pharmacylogin from "../img/pharmacy-login2.jpg";
import { RxSlash } from "react-icons/rx";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import CommonSec from "../navbar/CommonSec";
import { ToastContainer, toast } from "react-toastify";

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  ContactPerson: Yup.string().required("Contac person name is required"),

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
  PharmacyRegistrationDate: Yup.date().required(
    "PharmacyRegistration Date is required"
  ),
  city: Yup.string().required("city is required"),
  pincode: Yup.string().required("Pincode is required"),
  pharmacyStartTime1: Yup.string().required("time slot is required"),
  // pharmacyStartTime2: Yup.string().required('time slot is required'),
  // pharmacyStartTime3: Yup.string().required('time slot is required'),
  pharmacyEndTime1: Yup.string().required("time slot is required"),
  // pharmacyEndTime2: Yup.string().required('time slot is required'),
  // pharmacyEndTime3: Yup.string().required('time slot is required'),
  address: Yup.string().required("Address is required"),
  area: Yup.string().required("area is required"),
  DaysPharmacy1: Yup.string().required("days are required"),
  DaysPharmacy2: Yup.string().required("days are required"),
  DaysPharmacy3: Yup.string().required("days are required"),
  photo: Yup.string().required("photo is required"),
  pdfFile: Yup.string().required("Licence is required"),
  ReferralCode: Yup.string(),
});

function Pharmacysignup() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [daysData, setDaysData] = useState([]);
  const [loc, setLoc] = useState([]);
  const [timeFieldsDisabled, setTimeFieldsDisabled] = useState(false);

  const listDay = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/Days`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching days data:", error);
      return []; // Return empty array on error
    }
  };

  const pharmacytermsandcondition = async () => {
    try {
      let network = "Pharmacy";
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/termsandconditionbynetwork/${network}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching days data:", error);
      return [];
    }
  };

  useEffect(() => {
    pharmacytermsandcondition();
  }, []);

  useEffect(() => {
    const fetchDays = async () => {
      const days = await listDay();
      setDaysData(days);
    };

    const city = async () => {
      try {
        const city = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/location/city`
        );
        setLoc(city.data);
      } catch (error) {
        console.error("Error fetching laboratory list:", error);
      }
    };
    city();

    fetchDays();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.currentTarget.files[0]);
  };
  const handlePdfChange = (event) => {
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
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/getPharmacyCount`
      );
      const count = response.data.count;

      const sequenceNumber = String(count + 1).padStart(6, "0"); // Add 1 to the count to get the next sequence number

      return `PHA${year}${month}${day}${hours}${sequenceNumber}`;
    } catch (error) {
      console.error("Error fetching lab count:", error);
      // Handle error appropriately, e.g., throw an error or return a default value
      throw new Error("Failed to generate unique reference number");
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("PharmacyName", values.name);
      formData.append("ContactPerson", values.ContactPerson);
      formData.append("EmailClinic", values.email);
      formData.append("mobileNumber", values.contact);
      formData.append("Password", values.password);
      formData.append("PharmacyLicenseNumber", values.licenceno);
      formData.append("PharmacyLicenseDate", values.licencedate);
      formData.append(
        "PharmacyRegistrationDate",
        values.PharmacyRegistrationDate
      );
      formData.append("city", values.city);
      formData.append("PharmacyStartTime1", values.pharmacyStartTime1);
      formData.append("PharmacyStartTime2", values.pharmacyStartTime2);
      formData.append("PharmacyStartTime3", values.pharmacyStartTime3);
      formData.append("PharmacyEndTime1", values.pharmacyEndTime1);
      formData.append("PharmacyEndTime2", values.pharmacyEndTime2);
      formData.append("PharmacyEndTime3", values.pharmacyEndTime3);
      formData.append("DaysPharmacy1", values.DaysPharmacy1);
      formData.append("DaysPharmacy2", values.DaysPharmacy2);
      formData.append("DaysPharmacy3", values.DaysPharmacy3);
      formData.append("Pincode", values.pincode); // Include pincode
      formData.append("address", values.address);
      formData.append("area", values.area);
      if (values.ReferralCode) {
        formData.append("ReferralCode", values.ReferralCode);
      }
      formData.append("photo", file);
      formData.append("pdfFile", pdf);

      formData.append("isActive", false);

      const uniqueReferenceNo = await generateUniqueReferenceNo();
      formData.append("PharmacyReferenceNo", uniqueReferenceNo);

      await axios
        .post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/createPharmacy`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          console.log(res);
          if (res.data.isOk === false) {
            toast.error(res.data.message);
            return;
          } else if (res.status === 200) {
            Swal.fire({
              title: "Success!",
              text: "Pharmacy registered successfully",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              navigate("/pharmacy-login");
            });
          }
        });
    } catch (error) {
      console.error("Error creating pharmacy:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to create Pharmcay",
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

      console.log("pp", createdCategory);

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
          heading="JOIN OUR PHARMACY NETWORK"
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
                style={{ backgroundImage: `url(${pharmacylogin})` }}
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
                    ContactPerson: "",
                    email: "",
                    contact: "",
                    password: "",
                    confirmpass: "",
                    licenceno: "",
                    licencedate: "",
                    PharmacyRegistrationDate: "",
                    city: "",
                    pharmacyStartTime1: "",
                    pharmacyStartTime2: "",
                    pharmacyStartTime3: "",
                    pharmacyEndTime1: "",
                    pharmacyEndTime2: "",
                    pharmacyEndTime3: "",
                    pincode: "",
                    address: "",
                    DaysPharmacy1: "",
                    DaysPharmacy2: "",
                    DaysPharmacy3: "",
                    photo: "",
                    pdfFile: "",
                    area: "",
                    ReferralCode: "",
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
                    <Form className="signin-form row" onSubmit={handleSubmit}>
                      <div className="step-1 d-block">
                        <Row className="justify-content-center">
                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Pharmacy Name{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              placeholder="Pharmacy Name"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.name}
                              isInvalid={touched.name && errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.name}
                            </Form.Control.Feedback>
                          </Col>
                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Contact Person Name
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="ContactPerson"
                              placeholder="Contact person name"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.ContactPerson}
                              isInvalid={
                                touched.ContactPerson && errors.ContactPerson
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.ContactPerson}
                            </Form.Control.Feedback>
                          </Col>
                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Pharmacy Email Address{" "}
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
                              Pharmacy Licence No.{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="licenceno"
                              placeholder="Pharmacy Licence No."
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
                              Pharmacy Licence Date{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="date"
                              name="licencedate"
                              placeholder="Pharmacy Licence Date"
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
                              Pharmacy Registration Date{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="date"
                              name="PharmacyRegistrationDate"
                              placeholder="Pharmacy Registration Date"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.PharmacyRegistrationDate}
                              isInvalid={
                                touched.PharmacyRegistrationDate &&
                                errors.PharmacyRegistrationDate
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.PharmacyRegistrationDate}
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
                              Pharmacy Image{" "}
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
                              Pharmacy Licence Image{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="file"
                              name="pdfFile"
                              accept=".pdf,.docx,.excel"
                              onChange={(event) => {
                                handlePdfChange(event);
                                handleChange(event);
                              }}
                              onBlur={handleBlur}
                              isInvalid={touched.pdfFile && errors.pdfFile}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.pdfFile}
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

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Days <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              as="select"
                              name="DaysPharmacy1"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.DaysPharmacy1}
                              isInvalid={
                                touched.DaysPharmacy1 && errors.DaysPharmacy1
                              }
                            >
                              <option value="">Select Days</option>
                              {daysData.map((day) => (
                                <option key={day._id} value={day._id}>
                                  {day.Days}
                                </option>
                              ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                              {errors.DaysPharmacy1}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Pharmacy Start Time 1{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="time"
                              name="pharmacyStartTime1"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.pharmacyStartTime1}
                              isInvalid={
                                touched.pharmacyStartTime1 &&
                                errors.pharmacyStartTime1
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.pharmacyStartTime1}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Pharmacy End Time 1{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="time"
                              name="pharmacyEndTime1"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.pharmacyEndTime1}
                              isInvalid={
                                touched.pharmacyEndTime1 &&
                                errors.pharmacyEndTime1
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.pharmacyEndTime1}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Days<span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              as="select"
                              name="DaysPharmacy2"
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
                                    setFieldValue("pharmacyStartTime2", ""); // Clear start time field
                                    setFieldValue("pharmacyEndTime2", ""); // Clear end time field
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
                              value={values.DaysPharmacy2}
                              isInvalid={
                                touched.DaysPharmacy2 && errors.DaysPharmacy2
                              }
                            >
                              <option value="">Select Days</option>
                              {daysData.map((day) => (
                                <option key={day._id} value={day._id}>
                                  {day.Days}
                                </option>
                              ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                              {errors.DaysPharmacy3}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>Pharmacy Start Time 2 </Form.Label>
                            <Form.Control
                              type="time"
                              name="pharmacyStartTime2"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.pharmacyStartTime2}
                              isInvalid={
                                touched.pharmacyStartTime2 &&
                                errors.pharmacyStartTime2
                              }
                              disabled={disabled1} // Disable if Sun or Sat is selected
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.pharmacyStartTime2}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>Pharmacy End Time 2 </Form.Label>
                            <Form.Control
                              type="time"
                              name="pharmacyEndTime2"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.pharmacyEndTime2}
                              isInvalid={
                                touched.pharmacyEndTime2 &&
                                errors.pharmacyEndTime2
                              }
                              disabled={disabled1}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.pharmacyEndTime2}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Days <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              as="select"
                              name="DaysPharmacy3"
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
                                    setFieldValue("pharmacyStartTime3", ""); // Clear start time field
                                    setFieldValue("pharmacyEndTime3", ""); // Clear end time field
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
                              value={values.DaysPharmacy3}
                              isInvalid={
                                touched.DaysPharmacy3 && errors.DaysPharmacy3
                              }
                            >
                              <option value="">Select Days</option>
                              {daysData.map((day) => (
                                <option key={day._id} value={day._id}>
                                  {day.Days}
                                </option>
                              ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                              {errors.DaysPharmacy2}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>Pharmacy Start Time 3 </Form.Label>
                            <Form.Control
                              type="time"
                              name="pharmacyStartTime3"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.pharmacyStartTime3}
                              isInvalid={
                                touched.pharmacyStartTime3 &&
                                errors.pharmacyStartTime3
                              }
                              disabled={disabled2}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.pharmacyStartTime3}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>Pharmacy End Time 3 </Form.Label>
                            <Form.Control
                              type="time"
                              name="pharmacyEndTime3"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.pharmacyEndTime3}
                              isInvalid={
                                touched.pharmacyEndTime3 &&
                                errors.pharmacyEndTime3
                              }
                              disabled={disabled2}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.pharmacyEndTime3}
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
                              Address <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
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
                                  Terms of service
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
                        </Row>
                      </div>
                    </Form>
                  )}
                </Formik>
                <div className="w-100 text-center mt-4">
                  <p className="text-center">
                    Already have an account?{" "}
                    <Link to="/pharmacy-login" className="d-inline-block">
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Pharmacysignup;
