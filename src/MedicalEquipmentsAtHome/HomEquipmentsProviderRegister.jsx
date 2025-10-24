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

const validationSchema = Yup.object({
  ContactPersonName: Yup.string().required("Vendor Name is required"),
  EquipmentProvider: Yup.string().required("Reference Number is required"),
  Email: Yup.string().required("Email is required"),
  Password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  ContactNo: Yup.string()
    .matches(/^[0-9]{10}$/, "Invalid Mobile Number")
    .required("Mobile Number is required"),
  City: Yup.string().required("City is required"),
  IsActive: Yup.boolean(),
});

function HomeEquipmentProviderRegister() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [loc, setLoc] = useState([]);

  const initialValues = {
    ContactPersonName: "",
    EquipmentProvider: "",
    Email: "",
    Password: "",
    ContactNo: "",
    City: "",
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

      await axios
        .post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/equipment-provider`,
          values
        )
        .then((res) => {
          console.log("provider registration", res);
          setIsLoading(false);
          if (res.data.isOk === false) {
            toast.error(res.data.message);
            return;
          } else if (res.status === 200) {
            Swal.fire({
              title: "Success!",
              text: "Equipment Provider registered successfully!",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              window.location.reload(
                  `/medical-equipments/equipment-provider-register`
              );
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
          heading="Medical Equipments On Rent"
          pagetitlelink=">"
          title1="Signup"
          title2="Medical Equipments On Rent"
          IconComponent={RxSlash}
        />
      </div>

      <section className="equipments-area ptb-70 pb-5">
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
                    <h3 className="mb-4 h5 fw-bold">
                      Equipment Provider Registration
                    </h3>
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
                              Equipment Provider{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="EquipmentProvider"
                              placeholder="Equipment Provider Name"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.EquipmentProvider}
                              isInvalid={
                                touched.EquipmentProvider &&
                                errors.EquipmentProvider
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.EquipmentProvider}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Contact Person Name{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="ContactPersonName"
                              placeholder="Contact Person Name"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.ContactPersonName}
                              isInvalid={
                                touched.ContactPersonName &&
                                errors.ContactPersonName
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.ContactPersonName}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Mobile Number{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="ContactNo"
                              placeholder="Mobile Number"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.ContactNo}
                              isInvalid={touched.ContactNo && errors.ContactNo}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.ContactNo}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              Email <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="Email"
                              placeholder="Personal Email"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.Email}
                              isInvalid={touched.Email && errors.Email}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.Email}
                            </Form.Control.Feedback>
                          </Col>

                          <Col lg={4} className="form-group mb-3">
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
                          {/* <Col lg={6} className="form-group mb-3">
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
                          </Col> */}

                          <Col lg={4} className="form-group mb-3">
                            <Form.Label>
                              City <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            {!isCityInputMode ? (
                              <Form.Control
                                as="select"
                                name="City"
                                onChange={(e) => {
                                  if (e.target.value === "new-city-option-id") {
                                    setIsCityInputMode(true); // Switch to input field
                                  } else {
                                    handleChange(e);
                                  }
                                }}
                                onBlur={handleBlur}
                                value={values.City}
                                isInvalid={touched.City && errors.City}
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
                              {errors.City}
                            </Form.Control.Feedback>
                          </Col>

                          {/* <Col lg={6} className="form-group mb-3">
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
                          </Col> */}

                          {/* <Col lg={6} className="form-group mb-3">
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
                          </Col> */}

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
                                  Terms of Equipment
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
                    <Link
                      to="/medical-equipments/equipment-provider-login"
                      className="d-inline-block"
                    >
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

export default HomeEquipmentProviderRegister;
