import React from 'react';
import { MdArrowForwardIos } from "react-icons/md";
import Modalnavigationbar from '../navbar/Modalnavigationbar';
import Pagetitle from '../patients/Pagetitle';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CommonSec from '../navbar/CommonSec';

function Feedback() {
  const navigate = useNavigate();

  const SignupSchema = Yup.object().shape({
    Name: Yup.string().required('Please enter your Name'),
    email: Yup.string()
      .email('Invalid email')
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email must be valid and end with .com')
      .test('endsWithCom', 'Email must end with .com', value => value.endsWith('.com'))
      .required('Please enter your email'),
    contactno: Yup.string()
      .matches(/^\d+$/, 'Contact No. must contain only digits')
      .length(10, 'Contact No. must be exactly 10 digits')
      .required('Contact No. is required'),
    message: Yup.string().required('Please enter the Message'),
    // textarea: Yup.string().required('Please enter your message'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const feedback = {
        'Did you get timely service?': values.feedback['Did you get timely service?'] || '',
        'Did you face any problem during blood collection?': values.feedback['Did you face any problem during blood collection?'] || '',
        'Was the staff courteous and helpful?': values.feedback['Was the staff courteous and helpful?'] || '',
        'Was it clean?': values.feedback['Was it clean?'] || '',
        'Did Staff do the hand sanitization before collection?': values.feedback['Did Staff do the hand sanitization before collection?'] || '',
        'Will you recommend Grace Laboratory to others?': values.feedback['Will you recommend Grace Laboratory to others?'] || '',
      };

      const response = await axios.post(`${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/Feedback`, {
        ...values,
        feedback,
      });

      Swal.fire({
        title: "Success!",
        text: "Contact Details submitted successfully",
        icon: "success",
        confirmButtonText: "OK"
      });

      resetForm();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Swal.fire({
        title: "Error",
        text: "There was an error submitting your feedback. Please try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  return (
    <>
    <CommonSec />
      <Modalnavigationbar />
      <div className="page-title-area">
        <Pagetitle heading="Feedback" pagetitlelink="/" title1="Home" title2="Contact" IconComponent={MdArrowForwardIos} />
      </div>

      <section className="contact-area ptb-120">
        <Container>
          <div className="section-title text-center">
            <span className="bg-ff5d24">Message Us</span>
            <h2>Feedback here</h2>
          </div>

          <Formik
            initialValues={{
              Name: '',
              email: '',
              contactno: '',
              message: '',
              // textarea: '',
              feedback: {
                'Did you get timely service?': '',
                'Did you face any problem during blood collection?': '',
                'Was the staff courteous and helpful?': '',
                'Was it clean?': '',
                'Did Staff do the hand sanitization before collection?': '',
                'Will you recommend Grace Laboratory to others?': '',
              }
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
              handleSubmit,
              resetForm,
            }) => (
              <Form onSubmit={handleSubmit} id="contactForm">
                <Row>
                  <Col lg={12} md={12}>
                    <div className="feedback-questions" style={{ textAlign: 'left',fontSize: '1rem', fontWeight: 'bold', }}>
                      {[
                        'Did you get timely service?',
                        'Did you face any problem during blood collection?',
                        'Was the staff courteous and helpful?',
                        'Was it clean?',
                        'Did Staff do the hand sanitization before collection?',
                        'Will you recommend Grace Laboratory to others?',
                      ].map((field, idx) => {
                        return (
                          <Form.Group key={idx}>
                            <Form.Label>{field}</Form.Label>
                            <div className="d-flex align-items-center">
                              <Form.Check
                                type="radio"
                                label="Yes"
                                Name={`feedback.${field}`}
                                value="Yes"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                checked={values.feedback[field] === 'Yes'}
                                className="me-3"
                              />
                              <Form.Check
                                type="radio"
                                label="No"
                                Name={`feedback.${field}`}
                                value="No"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                checked={values.feedback[field] === 'No'}
                              />
                            </div>
                            {errors.feedback && errors.feedback[field] && touched.feedback && touched.feedback[field] && (
                              <div className="text-danger">{errors.feedback[field]}</div>
                            )}
                          </Form.Group>
                        );
                      })}
                    </div>
                  </Col>

                  <Col lg={6} md={6} className='mt-5'>
                    <Form.Group controlId="formName" style={{textAlign:'left'}}>
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        Name="Name"
                        placeholder="Your Name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.Name}
                        isInvalid={touched.Name && errors.Name}
                      />
                      <Form.Control.Feedback type="invalid">{errors.Name}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col lg={6} md={6} className='mt-5'>
                    <Form.Group controlId="formContactNo" style={{textAlign:'left'}}>
                      <Form.Label>Contact no</Form.Label>
                      <Form.Control
                        type="text"
                        Name="contactno"
                        placeholder="Your Contact no"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.contactno}
                        isInvalid={touched.contactno && errors.contactno}
                      />
                      <Form.Control.Feedback type="invalid">{errors.contactno}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col lg={6} md={6}>
                    <Form.Group controlId="formEmail" style={{textAlign:'left'}}>
                      <Form.Label >Email</Form.Label>
                      <Form.Control
                        type="text"
                        Name="email"
                        placeholder="Your Email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        isInvalid={touched.email && errors.email}
                      />
                      <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col lg={6} md={6}>
                    <Form.Group controlId="formMessage" style={{textAlign:'left'}}>
                      <Form.Label >Message</Form.Label>
                      <Form.Control
                        type="text"
                        Name="message"
                        placeholder="Your Message"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.message}
                        isInvalid={touched.message && errors.message}
                      />
                      <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col lg={12} md={12}>
                    <Form.Group controlId="formTextarea" style={{textAlign:'left'}}>
                      <Form.Label >Your Feedback</Form.Label>
                      <Form.Control
                        as="textarea"
                        Name="textarea"
                        rows="6"
                        placeholder="Your Feedback"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.textarea}
                        isInvalid={touched.textarea && errors.textarea}
                      />
                      {/* <Form.Control.Feedback type="invalid">{errors.textarea}</Form.Control.Feedback> */}
                    </Form.Group>
                  </Col>

                  <Col lg={12} md={12}>
                    <Button variant="primary" type="submit" className="w-100">Send Feedback</Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Container>
      </section>
    </>
  );
}

export default Feedback;
