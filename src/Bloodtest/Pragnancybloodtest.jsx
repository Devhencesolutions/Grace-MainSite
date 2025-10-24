import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import placeholderimage from "../img/Pregnant-placeholder.jpeg";
import Pagetitle from "../patients/Pagetitle";
import { MdArrowForwardIos } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import CommonSec from "../navbar/CommonSec";

const TestTypes = [
  { id: 1, name: "Pregnancy Blood Test" },
  { id: 2, name: "Blood Test For Kids" },
  { id: 3, name: "Full Body Checkup" },
  { id: 4, name: "Health checkup for senior citizen (male)" },
  { id: 5, name: "Health checkup for senior citizen (Female)" },
  { id: 6, name: "Swine Flue Test In vadodara" },
  { id: 7, name: "Serology Blood Test" },
  { id: 8, name: "Blood Ige Test in vadodara" },
  { id: 9, name: "PCOD Profile Blood Test" },
];

function Pragnancybloodtest() {
  const [showModal, setShowModal] = useState(false);
  const [blog, setBlog] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const { testName } = useParams();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    mobileNo: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
      .required("Mobile number is required"),
    message: Yup.string().required("Message is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobileNo: "",
      message: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (!selectedItemId) {
        console.error("No item selected");
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/create/TestDetails/${selectedItemId}`,
          values
        );

        toast.success("Inquiry was successfully received!");

        formik.resetForm();
        setShowModal(false);
      } catch (error) {
        toast.error("There was an error submitting your inquiry.");
      }
    },
  });

  const selectedTestId = "1";

  useEffect(() => {
    const fetchCMSContent = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/getallTestDetails`
        );

        if (Array.isArray(response.data) && response.data.length > 0) {
          setBlog(response.data);

          const matchedTestType = TestTypes.find(
            (test) => test.id.toString() === selectedTestId
          );

          if (matchedTestType) {
            const matchedItem = response.data.find(
              (item) =>
                item.selectedTest.toString() === matchedTestType.id.toString()
            );

            if (matchedItem) {
              setSelectedItemId(matchedItem._id);
            } else {
              console.error("No matching test found in the API response.");
            }
          }
        } else {
          setBlog([]);
        }
      } catch (error) {
        console.error("Error fetching test details:", error);
        setBlog([]);
      }
    };

    fetchCMSContent();
  }, [selectedTestId]);

  const formatContent = (content) => {
    return `
    <style>
      .content-container {
        font-size: 16px;
        line-height: 1.6;
        color: black;
        margin-bottom: 20px;
      }
      .content-container h1, .content-container h2, .content-container h3, .content-container h4 {
        font-weight: bold;
        text-align: center;
        color: black;
        font-size: 20px;
        margin-top: 20px;
        margin-bottom: 10px;
      }
      .content-container p {
        text-align: justify;
        margin-bottom: 15px;
        color: black;
      }
      .content-container img {
        display: block;
        margin: 20px auto;
        max-width: 100%;
        height: auto;
      }
      .content-container table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      .content-container table, .content-container th, .content-container td {
        border: 1px solid #ddd;
        padding: 10px;
      }
      .content-container th {
        text-align: center;
        background-color: #f2f2f2;
        font-weight: bold;
        font-size: 16px;
        color: black;
      }
      .content-container td {
        text-align: center;
        font-size: 16px;
        color: black;
      }
      .content-container * {
        color: black !important;
      }
      .content-container p, .content-container li, .content-container tr td {
        font-size: 16px !important;
      }
    </style>
    <div class="content-container">
      ${content}
    </div>
  `;
  };

  return (
    <>
    <CommonSec />
      <Modalnavigationbar />
      <div className="page-title-area">
        <Pagetitle
          heading="Pregnancy Blood Test"
          pagetitlelink="/"
          title1="Home"
          title2="Package"
          IconComponent={MdArrowForwardIos}
        />
      </div>

      <section className="about-area ptb-50">
        <Container>
          {blog
            .filter((item) => item._id === selectedItemId)
            .map((item) => (
              <Row key={item._id}>
                <div class="row sec-row mb-5">
                <div class="col-lg-4 col-md-12 ps-0">
                    <div class="team-details-sidebar height-100">
                        <div class="team-profile height-100">
                             <img
                             class="height-100 br-img"
                          src={`${process.env.REACT_APP_API_URL_GRACELAB}/${item.Images}`}
                          alt={item.Title}
                          onError={(e) => {
                            e.target.src = placeholderimage;
                          }}
                        />

                        </div>

                    </div>
                </div>

                <div class="col-lg-8 col-md-12">
                    <div class="team-details-desc top">
                        <h3>{item.Title}</h3>
                        <h2 style={{fontWeight:700}} >₹ {item.Price}</h2>

                        <ul class="team-info">
                           

                               
                                    <li>{item.TestName}</li>
                               
                         

                        </ul>

                        <div class="text-end mt-2">
                            <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={() => {
                            setSelectedItemId(item._id);
                            setShowModal(true);
                          }}
                        >
                          Inquiry Now
                        </button>

                        </div>

                    </div>

                   
                </div>

            </div>


                <Col lg={12} className="mb-4">
                  <div className="team-details-desc">
                    <h3>Description</h3>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatContent(item.Description),
                      }}
                    />
                  </div>
                </Col>
              </Row>
            ))}
        </Container>
      </section>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>Inquiry Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your name"
                isInvalid={!!formik.errors.name && formik.touched.name}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your email"
                isInvalid={!!formik.errors.email && formik.touched.email}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formMobileNo">
              <Form.Label>Mobile No</Form.Label>
              <Form.Control
                type="text"
                name="mobileNo"
                value={formik.values.mobileNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your mobile number"
                isInvalid={!!formik.errors.mobileNo && formik.touched.mobileNo}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.mobileNo}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="message"
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your message"
                isInvalid={!!formik.errors.message && formik.touched.message}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer />
    </>
  );
}

export default Pragnancybloodtest;
