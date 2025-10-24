import React, { useState, useEffect } from "react";
import { Container, Row, Col, Modal, Button ,Form} from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import placeholderimage from "../img/serology-placeholder.jpg";
import { useParams } from "react-router-dom";
import Pagetitle from "../patients/Pagetitle";
import { MdArrowForwardIos } from "react-icons/md";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
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
  { id: 9, name: "PCOD Profile Blood Test" }
];

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  mobileNo: Yup.string().required("Mobile number is required"),
  message: Yup.string().required("Message is required"),
});

function Serologytest() {
  const [showModal, setShowModal] = useState(false);
  const [blog, setBlog] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const { testName } = useParams();

  const selectedTestId = "7";
          console.log("Selected Test ID:", selectedTestId);
  useEffect(() => {
    const fetchCMSContent = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/getallTestDetails`
        );

        if (Array.isArray(response.data) && response.data.length > 0) {
          setBlog(response.data);

          const matchedTestType = TestTypes.find(test => test.id.toString() === selectedTestId);

          if (matchedTestType) {
            const matchedItem = response.data.find(item => item.selectedTest === matchedTestType.id.toString());
            if (matchedItem) {
              setSelectedItemId(matchedItem._id);
            }
          }
        } else {
          setBlog([]);
        }
      } catch (error) {
        console.error("Error fetching CMS content:", error);
        setBlog([]);
      }
    };

    fetchCMSContent();
  }, [testName]);

  const handleSubmit = async (values, { resetForm }) => {
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
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting the form:", error);
      toast.error("There was an error submitting your inquiry.");
    }
  };

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
          heading="Serology Test"
          pagetitlelink="/"
          title1="Home"
          title2="Package"
          IconComponent={MdArrowForwardIos}
        />
      </div>

      <section className="about-area ptb-120">
        <Container>
          {blog
            .filter(item => item._id === selectedItemId)
            .map(item => (
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
                        <h2 style={{fontWeight:700}}>₹ {item.Price}</h2>

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
          <Formik
            initialValues={{ name: '', email: '', mobileNo: '', message: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, values, errors, touched }) => (
              <FormikForm>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Field
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter your name"
                  />
                  <ErrorMessage name="name" component="div" className="text-danger" />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Field
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </Form.Group>
                <Form.Group controlId="formMobileNo">
                  <Form.Label>Mobile No</Form.Label>
                  <Field
                    type="tel"
                    name="mobileNo"
                    className="form-control"
                    placeholder="Enter your mobile number"
                  />
                  <ErrorMessage name="mobileNo" component="div" className="text-danger" />
                </Form.Group>
                <Form.Group controlId="formMessage">
                  <Form.Label>Message</Form.Label>
                  <Field
                    as="textarea"
                    name="message"
                    className="form-control"
                    placeholder="Enter your message"
                    rows="4"
                  />
                  <ErrorMessage name="message" component="div" className="text-danger" />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Submit
                </Button>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      <ToastContainer />
    </>
  );
}

export default Serologytest;
