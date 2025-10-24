import axios from "axios";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
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

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Buisness Name is required"),
  buisnessCategory: Yup.string().required("Buisness Category is required"),
  conversionRatio: Yup.string().required("Dicount Percentage is required"),

  email: Yup.string().required("Email is required"),
  contact: Yup.string()
    .matches(/^\d+$/, "Contact No. must contain only digits")
    .length(10, "Contact No. must be exactly 10 digits")
    .required("Contact No. is required"),
  password: Yup.string().required("Password is required"),
  confirmpass: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),

  city: Yup.string().required("City is required"),
  address: Yup.string().required("Address is required"),
  area: Yup.string().required("area is required"),

  photo: Yup.string().required("photo is required"),
  ReferralCode: Yup.string(),
});

function Affiliatesignup() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [daysData, setDaysData] = useState([]);
  const [loc, setLoc] = useState([]);
  const [timeFieldsDisabled, setTimeFieldsDisabled] = useState(false);

  const [formValues, setFormValues] = useState({
    name: "",

    email: "",
    contact: "",
    password: "",
    confirmpass: "",
    buisnessCategory: "",
    city: "",
    conversionRatio: "",
    ReferralCode: "",

    photo: "",
    pdfFile: "",
    area: "",
  });

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

  const termsandcondition = async () => {
    try {
      let network = "Affiliate";
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
    termsandcondition();
  }, []);

  const [buinessCategoryData, setBuisnessCategory] = useState("");
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
    const Buisness = async () => {
      try {
        const city = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/activeBuisnessCategory`
        );
        console.log(city);
        setBuisnessCategory(city.data);
      } catch (error) {
        console.error("Error fetching laboratory list:", error);
      }
    };
    city();
    Buisness();
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
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/Affiliate`
      );
      const count = response.data.length;
      console.log(response.data.length);

      //console.log("count", count);

      const sequenceNumber = String(count + 1).padStart(6, "0"); // Add 1 to the count to get the next sequence number
      console.log(sequenceNumber);
      return `AFF${year}${month}${day}${hours}${sequenceNumber}`;
    } catch (error) {
      console.error("Error fetching lab count:", error);
      // Handle error appropriately, e.g., throw an error or return a default value
      throw new Error("Failed to generate unique reference number");
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("buisnessName", values.name);

      formData.append("email", values.email);
      formData.append("contactNo", values.contact);
      formData.append("password", values.password);
      formData.append("buisnessCategory", values.buisnessCategory);

      formData.append("city", values.city);
      formData.append("conversionRatio", values.conversionRatio);
      formData.append("address", values.address);
      formData.append("area", values.area);
      if (values.ReferralCode) {
        formData.append("ReferralCode", values.ReferralCode);
      }
      formData.append("bannerImage", file);

      formData.append("IsActive", false);

      const uniqueReferenceNo = await generateUniqueReferenceNo();
      formData.append("affiliateReferenceNo", uniqueReferenceNo);

      await axios
        .post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/create/Affiliate-By-Frontend`,
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
              text: "Affiliate registered successfully",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              navigate("/affiliate-login");
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

  const [isInputMode, setIsInputMode] = useState(false);
  const [categoryName, setCategoryName] = useState();

  const handleInputBlur = async (e, setFieldValue) => {
    const newCategory = e.target.value.trim();

    if (newCategory) {
      const createdCategory = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/create/BuisnessCategory`,
        { Name: categoryName, IsActive: true }
      );

      if (createdCategory) {
        const business = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/activeBuisnessCategory`
        );
        setBuisnessCategory(business.data);

        // setFormValues({ ...formValues, buisnessCategory: createdCategory.data._id });
        setFieldValue("buisnessCategory", createdCategory.data._id);

        // Switch back to dropdown mode
        setIsInputMode(false);
        setCategoryName();
      }
    }
  };

  const [newCity, setNewCity] = useState();
  const [isCityInputMode, setIsCityInputMode] = useState(false);

  const handleInputBlurCity = async (e, setFieldValue) => {
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
          heading="JOIN OUR AFFILIATE NETWORK"
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
                  initialValues={formValues}
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
                              Business Name{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              placeholder="Business Name"
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
                              Business Category{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            {!isInputMode ? (
                              <Form.Control
                                as="select"
                                name="buisnessCategory"
                                // onChange={handleChange}
                                onChange={(e) => {
                                  if (
                                    e.target.value == "675bf267f91ad47fa53d9b7d"
                                  ) {
                                    setIsInputMode(true); // Switch to input field
                                  } else {
                                    handleChange(e);
                                  }
                                }}
                                onBlur={handleBlur}
                                value={values.buisnessCategory}
                                isInvalid={
                                  touched.buisnessCategory &&
                                  errors.buisnessCategory
                                }
                              >
                                <option value="">Select Category</option>
                                {buinessCategoryData &&
                                  buinessCategoryData.map((city) => (
                                    <option key={city._id} value={city._id}>
                                      {city.Name}
                                    </option>
                                  ))}
                              </Form.Control>
                            ) : (
                              <Form.Control
                                type="text"
                                name="categoryName"
                                placeholder="Enter new category"
                                onChange={(e) =>
                                  setCategoryName(e.target.value)
                                }
                                onBlur={(e) =>
                                  handleInputBlur(e, setFieldValue)
                                }
                                value={categoryName}
                                // isInvalid={
                                //   touched.buisnessCategory &&
                                //   errors.buisnessCategory
                                // }
                              />
                            )}
                            <Form.Control.Feedback type="invalid">
                              {errors.buisnessCategory}
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
                              Discount Percentage{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="number"
                              onWheel={(e) => e.target.blur()}
                              name="conversionRatio"
                              placeholder="%"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.conversionRatio}
                              isInvalid={
                                touched.conversionRatio &&
                                errors.conversionRatio
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.conversionRatio}
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
                                  handleInputBlurCity(e, setFieldValue)
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
                          <Col lg={6} className="form-group mb-3">
                            <Form.Label>
                              Affiliate Image{" "}
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
                    <Link to="/affiliate-login" className="d-inline-block">
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

export default Affiliatesignup;
