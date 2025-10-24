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

const validationSchema = Yup.object({
  VendorName: Yup.string().required("Vendor Name is required"),
  VendorReferenceNo: Yup.string().required("Reference Number is required"),
  VendorRegistrationDate: Yup.date().required("Registration Date is required"),
  Password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  ConfirmPassword: Yup.string()
    .oneOf([Yup.ref("Password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  ShopName: Yup.string().required("Shop Name is required"),
  VendorLicenseNumber: Yup.string().required("License Number is required"),
  VendorLicenseDate: Yup.date().required("License Date is required"),
  mobileNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Invalid Mobile Number")
    .required("Mobile Number is required"),
  EmailPersonal: Yup.string()
    .email("Invalid Email")
    .required("Personal Email is required"),
  EmailShop: Yup.string()
    .email("Invalid Email")
    .required("Shop Email is required"),
  Speciality: Yup.string().required("Category is required"),
  area: Yup.string().required("Area is required"),
  city: Yup.string().required("City is required"),
  address: Yup.string().required("Address is required"),
  photo: Yup.string().required("Photo is required"),
  IsActive: Yup.boolean(),
});

function Vendorsignup() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [loc, setLoc] = useState([]);

  const initialValues = {
    VendorName: "",
    VendorReferenceNo: "",
    VendorRegistrationDate: "",
    Password: "",
    confirmpass: "",
    ShopName: "",
    VendorLicenseNumber: "",
    VendorLicenseDate: "",
    mobileNumber: "",
    EmailPersonal: "",
    EmailShop: "",
    Speciality: "",
    area: "",
    city: "",
    address: "",
    photo: null,
    IsActive: false,
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

  const [speciality, setspeciality] = useState([]);

  useEffect(() => {
    // const fetchDays = async () => {
    //   const days = await listDay();
    //   setDaysData(days);
    // };

    const listspeciality = async () => {
      try {
        const speciality = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/VendorCategory`
        );

        setspeciality(speciality.data);
        console.log("this is doctor specility", speciality);
      } catch (error) {
        console.error("Error fetching days data:", error);
      }
    };
    listspeciality();

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

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit2 = async (values) => {
    try {
      console.log("nn", values);
      setIsLoading(true);
      const formData = new FormData();
      formData.append("VendorName", values.VendorName);
      //   formData.append("VendorReferenceNo", values.VendorReferenceNo);
      formData.append("VendorRegistrationDate", values.VendorRegistrationDate);
      formData.append("Password", values.Password);
      formData.append("ShopName", values.ShopName);
      formData.append("VendorLicenseNumber", values.VendorLicenseNumber);
      formData.append("VendorLicenseDate", values.VendorLicenseDate);
      formData.append("mobileNumber", values.mobileNumber);
      formData.append("EmailPersonal", values.EmailPersonal);
      formData.append("EmailShop", values.EmailShop);
      formData.append("Speciality", values.Speciality);
      formData.append("area", values.area);
      formData.append("city", values.city);
      formData.append("address", values.address);

      formData.append("photo", file);
      formData.append("IsActive", false);

      const uniqueReferenceNo = await generateUniqueReferenceNo();
      formData.append("VendorReferenceNo", uniqueReferenceNo);

      await axios
        .post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/createVendorAdmin`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          console.log("vendor registration", res);
          setIsLoading(false);
          if (res.data.isOk === false) {
            toast.error(res.data.message);
            return;
          } else if (res.status === 200) {
            Swal.fire({
              title: "Success!",
              text: "Vendor registered successfully",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              navigate("/vendor-login");
            });
          }
        });
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating vendor:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to create Vendor",
        icon: "error",
        confirmButtonText: "OK",
      });
      //   setSubmitting(false); // Reset form submission state
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
          heading="Vendor"
          pagetitlelink=">"
          title1="Signup"
          title2="Vendor"
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
                    <h3 className="mb-4 h5 fw-bold">Vendor Registration</h3>
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
                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Vendor Name{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="VendorName"
                              placeholder="Vendor Name"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.VendorName}
                              isInvalid={
                                touched.VendorName && errors.VendorName
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.VendorName}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Shop Name <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="ShopName"
                              placeholder="Shop Name"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.ShopName}
                              isInvalid={touched.ShopName && errors.ShopName}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.ShopName}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Mobile Number{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="mobileNumber"
                              placeholder="Mobile Number"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.mobileNumber}
                              isInvalid={
                                touched.mobileNumber && errors.mobileNumber
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.mobileNumber}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={6} className="form-group mb-3">
                            <Form.Label>
                              Personal Email{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="EmailPersonal"
                              placeholder="Personal Email"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.EmailPersonal}
                              isInvalid={
                                touched.EmailPersonal && errors.EmailPersonal
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.EmailPersonal}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={6} className="form-group mb-3">
                            <Form.Label>
                              Shop Email <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="EmailShop"
                              placeholder="Shop Email"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.EmailShop}
                              isInvalid={touched.EmailShop && errors.EmailShop}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.EmailShop}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={6} className="form-group mb-3">
                            <Form.Label>
                              Password <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="password"
                              name="Password"
                              placeholder="Password"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.Password}
                              isInvalid={touched.Password && errors.Password}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.Password}
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

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Vendor License Number{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="VendorLicenseNumber"
                              placeholder="Vendor License Number"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.VendorLicenseNumber}
                              isInvalid={
                                touched.VendorLicenseNumber &&
                                errors.VendorLicenseNumber
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.VendorLicenseNumber}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Vendor Licence Date{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="date"
                              name="VendorLicenseDate"
                              placeholder="Vendor License Date"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.VendorLicenseDate}
                              isInvalid={
                                touched.VendorLicenseDate &&
                                errors.VendorLicenseDate
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.VendorLicenseDate}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Vendor Registration Date{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="date"
                              name="VendorRegistrationDate"
                              placeholder="Vendor RegistrationDate Date"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.VendorRegistrationDate}
                              isInvalid={
                                touched.VendorRegistrationDate &&
                                errors.VendorRegistrationDate
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.VendorRegistrationDate}
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
                              Category <span style={{ color: "red" }}>*</span>
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
                              <option value="">Select Category</option>
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

                          <Col lg={6} className="form-group mb-3">
                            <Form.Label>
                              Vendor Image{" "}
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

                          <Button
                            type="button"
                            className="form-control btn btn-sign-in rounded submit px-3"
                            disabled={isLoading}
                            onClick={(e) => {
                              e.preventDefault();
                              handleSubmit2(values);
                            }}
                          >
                            {isLoading ? "Submitting..." : "Submit Now"}
                          </Button>
                        </Row>
                      </div>
                    </Form>
                  )}
                </Formik>
                <div className="w-100 text-center mt-4">
                  <p className="text-center">
                    Already have an account?{" "}
                    <Link to="/vendor-login" className="d-inline-block">
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

export default Vendorsignup;
