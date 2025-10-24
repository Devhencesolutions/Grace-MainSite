import React from 'react';
import { Col, Row, Label } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Scaneer from "../img/qr.png";
import ThankYou from "../img/thankYouImg.avif";
import { Button } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from 'yup';


const ThankYouModal = ({
  show,
  handleClose,
  Receivedid,
  IsActive,
  Remark,
  Medical,
  DocRef,
  Address,
  DOB,
  Gender,
  Phone,
  email,
  middleName,
  firstName,
  lastName,
  errors,
  touched,
  setFieldValue,
  Venue,
  CampDate,
  // Society,
  OtherMedicalCondition
 
}) => {
  const initialValues = {
   ReceivedImage:""
    // agree: false, // Add the agree field with initial value as false
  };

  const handleRegister = async (values) => {
    try {
      console.log(values.ReceivedImage);
      const formdata = new FormData();
      formdata.append("IsActive", IsActive);
      formdata.append("Remark", Remark);
      formdata.append("ReceivedImage", values.ReceivedImage);
      formdata.append("Medical", Medical);
      formdata.append("OtherMedicalCondition", OtherMedicalCondition);
      formdata.append("DocRef", DocRef);
      formdata.append("Address", Address);  
      formdata.append("DOB",DOB);
      formdata.append("Venue",Venue);
      formdata.append("CampDate",CampDate);
      // formdata.append("Society",Society);
      formdata.append("Gender", Gender);
      formdata.append("Phone", Phone);
      formdata.append("email", email);
      formdata.append("middleName",middleName);
      formdata.append("firstName",firstName);
      formdata.append("lastName",lastName);
      formdata.append("Receivedid",`P${Date.now()}`);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/create/PatientInquiryWithSociety`,
        formdata
      );
      console.log(response);
      if(response.data.isOk)
        {
          handleClose();
          alert("Inquiry Successful");
           
        }

    } catch (error) {
      console.error("Some error:", error);
      alert("Request failed. Please try again.");
    }
  };
  const validationSchema = Yup.object().shape({
    ReceivedImage: Yup.mixed().required('Please Upload the Image to Confirm your Payment'),
  });
  
  return (
    <Modal size='md' show={show} onHide={handleClose}>
      <Modal.Header closeButton />
      <Modal.Body>
        <Row className='thankYouRow'>
          <Col lg={6}>
            <div>
              <img src={Scaneer} className='scannerimg' alt='Scanner QR' />
            </div>
          </Col>
          <Col lg={6}>
            <div>
              <img className='scannerimg' src={ThankYou} alt='Thank You' />
            </div>
          </Col>
        </Row>
        {/* <Row className='mt-3'>
          <Col lg={6} md={6}>
            <div
              className={`form-outline mb-4 ${
                errors?.ReceivedImage && touched?.ReceivedImage ? "has-danger" : ""
              }`}
            >
              <div className="col-4">
                <Label>Received Image:</Label>
              </div>
              <input
                type="file"
                className={`form-control form-control-lg ${
                  errors?.ReceivedImage && touched?.ReceivedImage ? "is-invalid" : ""
                }`}
                onChange={(event) => {
                  setFieldValue("ReceivedImage", event.currentTarget.files[0]);
                }}
              />
              <ErrorMessage
                name="ReceivedImage"
                component="div"
                className="invalid-feedback"
              />
            </div>
          </Col>
        </Row> */}
        <Formik
  initialValues={initialValues}
  validationSchema={validationSchema} // Uncomment this line
  onSubmit={(values, { setSubmitting }) => {
    handleRegister(values);
    setSubmitting(false);
    console.log(values); 
  }}
>

                {({
                  isSubmitting,
                  errors,
                  touched,
                  setFieldValue,
                  values,
                  handleSubmit
                }) => (
                  <>
                    <Form>
                      
                      <Row className='mt-3'>
          <Col lg={6} md={6}>
            <div
              className={`form-outline mb-4 ${
                errors?.ReceivedImage && touched?.ReceivedImage ? "has-danger" : ""
              }`}
            >
              <div className="col-4">
                <Label>Payment Confirmation Image:</Label>
              </div>
              <input
                type="file"
                className={`form-control form-control-lg ${
                  errors?.ReceivedImage && touched?.ReceivedImage ? "is-invalid" : ""
                }`}
                onChange={(event) => {
                  setFieldValue("ReceivedImage", event.currentTarget.files[0]);
                }}
              />
              <ErrorMessage
                name="ReceivedImage"
                component="div"
                className="invalid-feedback"
              />
            </div>
          </Col>
        </Row>
                        <Col lg={12}>
                          <div className="form-outline mb-4">
                            <Button
                              type="submit"
                              className="btn btn-success"
                              disabled={isSubmitting}
                            >
                              Submit
                            </Button>
                          </div>
                        </Col>
                      </Form>
                  
                  </>
                )}
              </Formik>
        
      </Modal.Body>
    </Modal>
  );
}

export default ThankYouModal;
