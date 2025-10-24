import React, { useEffect, useState } from "react";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import Pagetitle from "../patients/Pagetitle";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import doctorlogin from "../img/doctor-login.jpg";
import { RxSlash } from "react-icons/rx";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import CommonSec from "../navbar/CommonSec";
import ReactSelect from "react-select";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";

function Doctorsignup() {
  // const [specialties, setSpecialties] = useState([]);

  // useEffect(() => {
  //   const Doctorlocation = async () => {
  //     try {
  //       const location = await axios.get(
  //         `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/DoctorSpeciality`
  //       );
  //       setSpecialties(location.data);
  //       //console.log("Doctor Dropdownlist", location.data);
  //     } catch (error) {
  //       //console.log("Error : ", error);
  //     }
  //   };
  //   Doctorlocation();

  // }, [])

  const SignupSchema = Yup.object().shape({
    doctorsName: Yup.string().required("Name is required"),
    hospitalName: Yup.string().required("Hospital name is required"),
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Invalid email address"
      )
      .required("Email is required"),
    contactNo: Yup.string()
      .matches(/^\d+$/, "Contact No. must contain only digits")
      .length(10, "Contact No. must be exactly 10 digits")
      .required("Contact No. is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    education: Yup.string().required("Education is required"),
    pincode: Yup.string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .required("Pincode is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("city is required"),
    OPD1StartTime: Yup.string().required("OPD start time is required"),
    // OPD2StartTime: Yup.string().required('OPD start time is required'),
    // OPD3StartTime: Yup.string().required('OPD start time is required'),
    OPD1EndTime: Yup.string().required("OPD end time is required"),
    // OPD2EndTime: Yup.string().required('OPD end time is required'),
    // OPD3EndTime: Yup.string().required('OPD end time is required'),
    DaysDoctor1: Yup.string().required("Days are required"),
    DaysDoctor2: Yup.string().required("Days are required"),
    DaysDoctor3: Yup.string().required("Days are required"),
    area: Yup.string().required("area is required"),
    Speciality: Yup.string().required("Speciality are required"),
    // DiseasesSymptoms: Yup.string().required("Diseases Symptoms are required"),
    DiseasesSymptoms: Yup.array()
  .of(Yup.string().required("Each Disease Symptom must be a string"))
  .required("Diseases Symptoms are required")
  .min(1, "At least one Disease Symptom is required"),
    // photo: Yup.string().required("Image is required"),
    // pdfFile: Yup.string().required("File is required"),

    // DoctorMasterDegreeCertificate: Yup.string().required('File is required'),
    ReferralCode: Yup.string(),
  });

  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [registration, setregistration] = useState(null);
  const [degree, setdegree] = useState(null);
  const [master, setmaster] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [daysData, setDaysData] = useState([]);
  const [speciality, setspeciality] = useState([]);
  const [loc, setLoc] = useState([]);
  const [symptomwise, setsymptomwise] = useState(null);
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
  listDay();

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const days = await listDay();
        setDaysData(days);
      } catch (error) {
        console.error("Error setting days data:", error);
      }
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

    const listspeciality = async () => {
      try {
        const speciality = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/getAllDoctorSpeciality`
        );

        setspeciality(speciality.data);
        console.log("this is doctor specility", speciality);
      } catch (error) {
        console.error("Error fetching days data:", error);
      }
    };
    listspeciality();

    const Doctorsymtoms = async () => {
      try {
        const Doctorsymtoms = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/DiseasesSymptoms`
        );

        const specilityisactive = Doctorsymtoms.data.filter(
          (specialityisactive) => specialityisactive.IsActive
        );
        setsymptomwise(specilityisactive);
      } catch (error) {
        console.log("doctor symtoms  :", error);
      }
    };
    Doctorsymtoms();

    fetchDays();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.currentTarget.files[0]);
  };

  const handleFileRegisterChange = (event) => {
    setregistration(event.currentTarget.files[0]);
  };
  const handleFileDegreeChange = (event) => {
    setdegree(event.currentTarget.files[0]);
  };
  const handleFileMasterChange = (event) => {
    setmaster(event.currentTarget.files[0]);
  };

  const [disabled1, setIsDisbled1] = useState(false);
  const [disabled2, setIsDisbled2] = useState(false);

  const generateUniqueReferenceNo = async () => {
    try {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // JS months are 0-based
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");

      // Fetch the count of entries in the database
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/getDoctorCount`
      );
      const count = response.data.count;

      const sequenceNumber = String(count + 1).padStart(6, "0"); // Add 1 to the count to get the next sequence number

      return `DOC${year}${month}${day}${hours}${sequenceNumber}`;
    } catch (error) {
      console.error("Error fetching lab count:", error);
      // Handle error appropriately, e.g., throw an error or return a default value
      throw new Error("Failed to generate unique reference number");
    }
  };

  const handlepdfChange = (event) => {
    setPdf(event.currentTarget.files[0]);
  };
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("this is values", values);

      const formData = new FormData();
      formData.append("DoctorName", values.doctorsName);
      formData.append("ClinicName", values.hospitalName);
      formData.append("EmailClinic", values.email);
      formData.append("mobileNumber", values.contactNo);
      formData.append("Password", values.password);
      formData.append("Confirmpassword", values.confirmPassword);
      formData.append("Education", values.education);
      formData.append("Pincode", values.pincode);
      formData.append("photo", file);
      formData.append("address", values.address);
      formData.append("OPD1StartTime", values.OPD1StartTime);
      formData.append("OPD2StartTime", values.OPD2StartTime);
      formData.append("OPD3StartTime", values.OPD3StartTime);
      formData.append("OPD1EndTime", values.OPD1EndTime);
      formData.append("OPD2EndTime", values.OPD2EndTime);
      formData.append("OPD3EndTime", values.OPD3EndTime);

      formData.append("OPD1Slot2StartTime", values.OPD1Slot2StartTime);
      formData.append("OPD1Slot3StartTime", values.OPD1Slot3StartTime);
      formData.append("OPD2Slot2StartTime", values.OPD2Slot2StartTime);
      formData.append("OPD2Slot3StartTime", values.OPD2Slot3StartTime);
      formData.append("OPD3Slot2StartTime", values.OPD3Slot2StartTime);
      formData.append("OPD3Slot3StartTime", values.OPD3Slot3StartTime);

      formData.append("OPD1Slot2EndTime", values.OPD1Slot2EndTime);
      formData.append("OPD1Slot3EndTime", values.OPD1Slot3EndTime);
      formData.append("OPD2Slot2EndTime", values.OPD2Slot2EndTime);
      formData.append("OPD2Slot3EndTime", values.OPD2Slot3EndTime);
      formData.append("OPD3Slot2EndTime", values.OPD3Slot2EndTime);
      formData.append("OPD3Slot3EndTime", values.OPD3Slot3EndTime);

      formData.append("DaysDoctor1", values.DaysDoctor1);
      formData.append("DaysDoctor2", values.DaysDoctor2);
      formData.append("DaysDoctor3", values.DaysDoctor3);
      formData.append("area", values.area);
      formData.append("city", values.city);

      formData.append("Speciality", values.Speciality);

      formData.append("DiseasesSymptoms", values.DiseasesSymptoms);
      if (values.ReferralCode) {
        formData.append("ReferralCode", values.ReferralCode);
      }

      formData.append("isActive", false);

      const uniqueReferenceNo = await generateUniqueReferenceNo();
      formData.append("DoctorReferenceNo", uniqueReferenceNo);

      await axios
        .post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/createDoctor`,
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
            console.log("mm");
            Swal.fire({
              title: "Success!",
              text: "Doctor registered successfully. A link has been sent to your registered email id and sms through which please complete the document submission and remaining process please",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              navigate("/doctor-login"); // Ensure this runs after Swal is closed
            });
          }
          // Redirect to '/laboratory-login' using useHistory hook
          // navigate("/doctor-login");
        });
    } catch (error) {
      console.error("Error creating laboratory:", error);
      // Show error message here
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to create Doctor",
        icon: "error",
        confirmButtonText: "OK",
      });
      setSubmitting(false); // Reset form submission state
    }
  };

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
      <ToastContainer />

      <div className="page-title-area">
        <Pagetitle
          heading="JOIN OUR DOCTORS NETWORK"
          pagetitlelink="/"
          title1="Login"
          title2="Signup"
          IconComponent={RxSlash}
        />
      </div>
      <section className="services-area ptb-70 pb-5">
        <Container>
          <Row className="justify-content-center" id="signupPanel">
            <Col md={12} lg={12}>
              <div className="wrap d-md-flex">
                <div
                  className="img"
                  style={{
                    backgroundImage: `url(${doctorlogin})`,
                  }}
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
                      doctorsName: "",
                      hospitalName: "",
                      email: "",
                      contactNo: "",
                      password: "",
                      confirmPassword: "",
                      education: "",
                      pincode: "",

                      address: "",
                      city: "",
                      OPD1StartTime: "",
                      OPD2StartTime: "",
                      OPD3StartTime: "",
                      OPD1EndTime: "",
                      OPD2EndTime: "",
                      OPD3EndTime: "",
                      OPD1Slot2StartTime: "",
                      OPD1Slot3StartTime: "",
                      OPD2Slot2StartTime: "",
                      OPD2Slot3StartTime: "",
                      OPD3Slot2StartTime: "",
                      OPD3Slot3StartTime: "",
                      OPD1Slot2EndTime: "",
                      OPD1Slot3EndTime: "",
                      OPD2Slot2EndTime: "",
                      OPD2Slot3EndTime: "",
                      OPD3Slot2EndTime: "",
                      OPD3Slot3EndTime: "",

                      DaysDoctor1: "",
                      DaysDoctor2: "",
                      DaysDoctor3: "",
                      area: "",
                      Speciality: "",
                      photo: "",
                      // pdfFile: "",
                      ReferralCode: "",
                      DiseasesSymptoms: [],
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
                            <Col lg={6} className="form-group mb-3">
                              <Form.Label>
                                Doctors Name{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="doctorsName"
                                placeholder="Doctor Name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.doctorsName}
                                isInvalid={
                                  touched.doctorsName && errors.doctorsName
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.doctorsName}
                              </Form.Control.Feedback>
                            </Col>

                            <Col lg={6} className="form-group mb-3">
                              <Form.Label>
                                Hospital/Clinic Name{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="hospitalName"
                                placeholder="Hospital/Clinic Name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.hospitalName}
                                isInvalid={
                                  touched.hospitalName && errors.hospitalName
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.hospitalName}
                              </Form.Control.Feedback>
                            </Col>

                            <Col lg={6} className="form-group mb-3">
                              <Form.Label>
                                Email Address{" "}
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
                                Contact No.{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="contactNo"
                                placeholder="Contact No."
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.contactNo}
                                isInvalid={
                                  touched.contactNo && errors.contactNo
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.contactNo}
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
                                Confirm password{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              <Form.Control
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.confirmPassword}
                                isInvalid={
                                  touched.confirmPassword &&
                                  errors.confirmPassword
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.confirmPassword}
                              </Form.Control.Feedback>
                            </Col>

                            <Col lg={6} className="form-group mb-3">
                              <Form.Label>
                                Education{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="education"
                                placeholder="Education"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.education}
                                isInvalid={
                                  touched.education && errors.education
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.education}
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

                             {/* <Col lg={6} className="form-group mb-3">
                                                        <Form.Label>
                                                          Upload Doctor Image{" "}
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
                                                      <Col lg={6} className="form-group mb-3"></Col> */}

                            <Col lg={4} className="form-group mb-3">
                              <Form.Label>
                                Days <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              <Form.Control
                                as="select"
                                name="DaysDoctor1"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.DaysDoctor1}
                                isInvalid={
                                  touched.DaysDoctor1 && errors.DaysDoctor1
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
                                {errors.DaysDoctor1}
                              </Form.Control.Feedback>
                            </Col>

                            <Col lg={4} className="form-group mb-3">
                              <Form.Label>
                                OPD Slot 1 Start Time 1
                                <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              <Form.Control
                                type="time"
                                name="OPD1StartTime"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.OPD1StartTime}
                                isInvalid={
                                  touched.OPD1StartTime && errors.OPD1StartTime
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.OPD1StartTime}
                              </Form.Control.Feedback>
                            </Col>

                            <Col lg={4} className="form-group mb-3">
                              <Form.Label>
                                OPD Slot 1 End Time 1
                                <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              <Form.Control
                                type="time"
                                name="OPD1EndTime"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.OPD1EndTime}
                                isInvalid={
                                  touched.OPD1EndTime && errors.OPD1EndTime
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.OPD1EndTime}
                              </Form.Control.Feedback>
                            </Col>

                            <Col lg={4} className="form-group mb-3">
                              <Form.Label>OPD Slot 2 Start Time 1</Form.Label>
                              <Form.Control
                                type="time"
                                name="OPD1Slot2StartTime"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.OPD1Slot2StartTime}
                              />
                            </Col>

                            <Col lg={4} className="form-group mb-3">
                              <Form.Label>OPD Slot 2 End Time 1</Form.Label>
                              <Form.Control
                                type="time"
                                name="OPD1Slot2EndTime"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.OPD1Slot2EndTime}
                              />
                            </Col>

                            <Col lg={4} className="form-group mb-3">
                              <Form.Label>OPD Slot 3 Start Time 1</Form.Label>
                              <Form.Control
                                type="time"
                                name="OPD1Slot3StartTime"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.OPD1Slot3StartTime}
                              />
                            </Col>

                            <Col lg={4} className="form-group mb-3">
                              <Form.Label>OPD Slot 3 End Time 1</Form.Label>
                              <Form.Control
                                type="time"
                                name="OPD1Slot3EndTime"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.OPD1Slot3EndTime}
                              />
                            </Col>

                            {/* opd start time 2 */}

                            <Col lg={4} className="form-group mb-3">
                              <Form.Label>
                                Days<span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              <Form.Control
                                as="select"
                                name="DaysDoctor2"
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
                                      setFieldValue("OPD2StartTime", ""); // Clear start time field
                                      setFieldValue("OPD2EndTime", ""); // Clear end time field
                                      setFieldValue("timeFieldsDisabled", true); // Disable time fields
                                      setIsDisbled1(true);
                                    } else {
                                      setIsDisbled1(false);
                                      // Enable time fields for other days
                                      setFieldValue(
                                        "timeFieldsDisabled",
                                        false
                                      );
                                    }
                                  }
                                }}
                                onBlur={handleBlur}
                                value={values.DaysDoctor2}
                                isInvalid={
                                  touched.DaysDoctor2 && errors.DaysDoctor2
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
                                {errors.DaysDoctor2}
                              </Form.Control.Feedback>
                            </Col>

                            <Col lg={4} className="form-group mb-3">
                              <Form.Label>OPD Slot 1 Start Time 2 </Form.Label>
                              <Form.Control
                                type="time"
                                name="OPD2StartTime"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.OPD2StartTime}
                                isInvalid={
                                  touched.OPD2StartTime && errors.OPD2StartTime
                                }
                                disabled={disabled1}
                              />

                              <Form.Control.Feedback type="invalid">
                                {errors.OPD2StartTime}
                              </Form.Control.Feedback>
                            </Col>

                            <Col lg={4} className="form-group mb-3">
                              <Form.Label>OPD Slot 1 End Time 2 </Form.Label>
                              <Form.Control
                                type="time"
                                name="OPD2EndTime"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.OPD2EndTime}
                                isInvalid={
                                  touched.OPD2EndTime && errors.OPD2EndTime
                                }
                                disabled={disabled1}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.OPD2EndTime}
                              </Form.Control.Feedback>
                            </Col>

                            <Col lg={4} className="form-group mb-3">
                              <Form.Label>OPD Slot 2 Start Time 2 </Form.Label>
                              <Form.Control
                                type="time"
                                name="OPD2Slot2StartTime"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.OPD2Slot2StartTime}
                                disabled={disabled1}
                              />
                            </Col>

                            <Col lg={4} className="form-group mb-3">
                              <Form.Label>OPD Slot 2 End Time 2 </Form.Label>
                              <Form.Control
                                type="time"
                                name="OPD2Slot2EndTime"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.OPD2Slot2EndTime}
                                disabled={disabled1}
                              />
                            </Col>

                            <Col lg={4} className="form-group mb-3">
                              <Form.Label>OPD Slot 3 Start Time 2 </Form.Label>
                              <Form.Control
                                type="time"
                                name="OPD2Slot3StartTime"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.OPD2Slot3StartTime}
                                disabled={disabled1}
                              />
                            </Col>

                            <Col lg={4} className="form-group mb-3">
                              <Form.Label>OPD Slot 3 End Time 2 </Form.Label>
                              <Form.Control
                                type="time"
                                name="OPD2Slot3EndTime"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.OPD2Slot3EndTime}
                                disabled={disabled1}
                              />
                            </Col>

                            {/* opd start time 3 */}

                            <Col lg={4} className="form-group mb-3">
                              <Form.Label>
                                Days<span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              <Form.Control
                                as="select"
                                name="DaysDoctor3"
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
                                      setFieldValue("OPD3StartTime", ""); // Clear start time field
                                      setFieldValue("OPD3EndTime", ""); // Clear end time field
                                      setFieldValue("timeFieldsDisabled", true); // Disable time fields
                                      setIsDisbled2(true);
                                    } else {
                                      setIsDisbled2(false);
                                      // Enable time fields for other days
                                      setFieldValue(
                                        "timeFieldsDisabled",
                                        false
                                      );
                                    }
                                  }
                                }}
                                onBlur={handleBlur}
                                value={values.DaysDoctor3}
                                isInvalid={
                                  touched.DaysDoctor3 && errors.DaysDoctor3
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
                                {errors.DaysDoctor3}
                              </Form.Control.Feedback>
                            </Col>
                            <Col lg={4} className="form-group mb-3">
                              <Form.Label>OPD Slot 1 Start Time 3 </Form.Label>
                              <Form.Control
                                type="time"
                                name="OPD3StartTime"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.OPD3StartTime}
                                isInvalid={
                                  touched.OPD3StartTime && errors.OPD3StartTime
                                }
                                disabled={disabled2}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.OPD3StartTime}
                              </Form.Control.Feedback>
                            </Col>

                            <Col lg={4} className="form-group mb-3">
                              <Form.Label>OPD slot 1 End Time 3 </Form.Label>
                              <Form.Control
                                type="time"
                                name="OPD3EndTime"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.OPD3EndTime}
                                isInvalid={
                                  touched.OPD3EndTime && errors.OPD3EndTime
                                }
                                disabled={disabled2}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.OPD3EndTime}
                              </Form.Control.Feedback>
                            </Col>

                            <Col lg={4} className="form-group mb-3">
                              <Form.Label>OPD Slot 2 Start Time 3 </Form.Label>
                              <Form.Control
                                type="time"
                                name="OPD3Slot2StartTime"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.OPD3Slot2StartTime}
                                disabled={disabled2}
                              />
                            </Col>

                            <Col lg={4} className="form-group mb-3">
                              <Form.Label>OPD slot 2 End Time 3 </Form.Label>
                              <Form.Control
                                type="time"
                                name="OPD3Slot2EndTime"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.OPD3Slot2EndTime}
                                disabled={disabled2}
                              />
                            </Col>

                            <Col lg={4} className="form-group mb-3">
                              <Form.Label>OPD Slot 3 Start Time 3 </Form.Label>
                              <Form.Control
                                type="time"
                                name="OPD3Slot3StartTime"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.OPD3Slot3StartTime}
                                disabled={disabled2}
                              />
                            </Col>

                            <Col lg={4} className="form-group mb-3">
                              <Form.Label>OPD slot 3 End Time 3 </Form.Label>
                              <Form.Control
                                type="time"
                                name="OPD3Slot3EndTime"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.OPD3Slot3EndTime}
                                disabled={disabled2}
                              />
                            </Col>

                            <Col lg={6} className="form-group mb-3">
                              <Form.Label>
                                Area <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="area"
                                placeholder="area"
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
                                Speciality{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              <Form.Control
                                as="select"
                                name="Speciality"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.Speciality}
                                isInvalid={
                                  touched.Speciality && errors.Speciality
                                }
                              >
                                <option value="">Select Speciality</option>
                                {Array.isArray(speciality) &&
                                  speciality.map((item) => (
                                    <option key={item._id} value={item._id}>
                                      {item.Speciality}
                                    </option>
                                  ))}
                              </Form.Control>
                              <Form.Control.Feedback type="invalid">
                                {errors.Speciality}
                              </Form.Control.Feedback>
                            </Col>

                            <Col className="form-group mb-3">
                              <Form.Label>
                                City <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              {!isCityInputMode ? (
                                <Form.Control
                                  as="select"
                                  name="city"
                                  onChange={(e) => {
                                    if (
                                      e.target.value === "new-city-option-id"
                                    ) {
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
                                Diseases Symptoms{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              <Select
                                isMulti
                                name="DiseasesSymptoms"
                                options={symptomwise?.map((symptom) => ({
                                  value: symptom._id,
                                  label: symptom.Symptom,
                                }))}
                                onChange={(selectedOptions) => {
                                  const values = selectedOptions.map(
                                    (option) => option.value
                                  );
                                  handleChange({
                                    target: {
                                      name: "DiseasesSymptoms",
                                      value: values,
                                    },
                                  });
                                }}
                                onBlur={handleBlur}
                                value={values.DiseasesSymptoms.map(
                                  (id) =>
                                    symptomwise.find(
                                      (symptom) => symptom._id === id
                                    ) && {
                                      value: id,
                                      label: symptomwise.find(
                                        (symptom) => symptom._id === id
                                      ).Symptom,
                                    }
                                )}
                                classNamePrefix="react-select"
                              />
                              {touched.DiseasesSymptoms &&
                                errors.DiseasesSymptoms && (
                                  <div className="invalid-feedback d-block">
                                    {errors.DiseasesSymptoms}
                                  </div>
                                )}
                            </Col>

                            <Col lg={12} className="form-group mb-3">
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
                  <p className="text-center">
                    Already have an account?{" "}
                    <Link
                      data-toggle="tab"
                      to="/doctor-login"
                      className="d-inline-block"
                    >
                      Sign In
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

export default Doctorsignup;
