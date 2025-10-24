import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import placeholderimage from "../img/center-placeholder.jpg";
import CommonSec from "../navbar/CommonSec";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import { MdArrowForwardIos } from "react-icons/md";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Joinhandwithus() {
  const { id } = useParams(); // Fetch id from URL parameters
  const [bout, setBout] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    phoneNumber: '',
    residentCity: '',
    residentDistrict: '',
    residentCountry: '',
    interestedCityForFranchise: '',
    state: '',
    designation: '',
    investmentAmount: '',
    whyYouWannaJoin: ''
  });

  // Static options for dropdowns
  const occupations = [
    { id: '1', value: 'Student', label: 'Student' },
    { id: '2', value: 'From Medical Field', label: 'From Medical Field' },
    { id: '3', value: 'Pathologist', label: 'Pathologist' },
    { id: '4', value: 'Builder', label: 'Builder' },
    { id: '5', value: 'Other', label: 'Other' },
  ];

  const investments = [
    { id: '1', value: '8-15 Lacs', label: '8-15 Lacs' },
    { id: '2', value: '60-99 Lacs (Zero Risk)', label: '60-99 Lacs (Zero Risk)' }
  ];

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/JoinHand/${id}`);
        setBout(res.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchAbout();
  }, [id]);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Include the id in the formData object
      const dataToSend = { ...formData, id };

      await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/create/joinHandWithUs`, 
        dataToSend
      );

      // Show success toast
      toast.success("Inquiry sent successfully!");

      // Clear form data
      setFormData({
        firstName: '',
        lastName: '',
        emailId: '',
        phoneNumber: '',
        residentCity: '',
        residentDistrict: '',
        residentCountry: '',
        interestedCityForFranchise: '',
        state: '',
        designation: '',
        investmentAmount: '',
        whyYouWannaJoin: '',
        otherOccupation:''
      });

      handleClose();
    } catch (error) {
      console.log("Error submitting form:", error);
    }
  };

  const bannerImageUrl = bout.bannerImage
    ? encodeURI(`${process.env.REACT_APP_API_URL_GRACELAB}/${bout.bannerImage}`)
    : placeholderimage;

  return (
    <>
      <CommonSec />
      <Modalnavigationbar />

      <div>
        <div className="page-title-area">
          <div className="container">
            <div className="page-title-content">
              <h2>{bout.Tittle || "Loading..."}</h2>
              <ul>
                <li>
                  
                  <Link to="/">Home</Link>
                </li>
                
              </ul>
            </div>
          </div>
        </div>

        <section className="team-details-area ptbjoin-hand-120">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-12 col-sm-12">
                <div className="team-details-sidebar">
                  <div className="team-profile">
                    <img
                      src={bannerImageUrl}
                      alt={bout.Tittle || "Banner"}
                      onError={(e) => {
                        e.target.src = placeholderimage;
                      }}
                    />
                  </div>

                  
                </div>
              </div>

             <div className="col-lg-8 col-md-12">
 <div className="team-details-desc">
  <h3>{bout.Tittle || "No title available"}</h3>
  <p>{bout.Description || "No description available"}</p>

  <div className="row">
    <div className="col-6">
      <p >Call Us Now : <span style={{ fontWeight: "bold" }}>{bout.ContactNo || "No contact available"}</span></p>
    
   
       <p >Email Us Now : <span style={{ fontWeight: "bold" }}>{bout.Email || "No contact available"}</span></p>
    </div>

     <div className="col-6">
      <div  className="call-to-action-box mt-3 float-end contact-sec btn btn-primary join-with-us" >
                    <Link onClick={handleShow}>
                      <i className="fas fa-headset" />
                      <h3 style={{color:"white"}}>Join Us Today</h3>
                      
                    </Link>
                  </div>
    </div>
  </div>
</div>

</div>



            </div>
          </div>
        </section>
      </div>

      {/* Modal Popup */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Join With Us</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email ID</Form.Label>
                  <Form.Control
                    type="email"
                    name="emailId"
                    value={formData.emailId}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formPhone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formCity">
                  <Form.Label>Resident City</Form.Label>
                  <Form.Control
                    type="text"
                    name="residentCity"
                    value={formData.residentCity}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formDistrict">
                  <Form.Label>Resident  District</Form.Label>
                  <Form.Control
                    type="text"
                    name="residentDistrict"
                    value={formData.residentDistrict}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formCountry">
                  <Form.Label> Resident Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="residentCountry"
                    value={formData.residentCountry}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formCityForFrenchies">
                  <Form.Label>City for Franchise</Form.Label>
                  <Form.Control
                    type="text"
                    name="interestedCityForFranchise"
                    value={formData.interestedCityForFranchise}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formState">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formDesignation">
                  <Form.Label>I am </Form.Label>
                  <Form.Control
                    as="select"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    {occupations.map(option => (
                      <option key={option.id} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

           

            <Row>
              <Col md={6}>
                <Form.Group controlId="formInvestment">
                  <Form.Label>I Can Invest (in 6 months)</Form.Label>
                  <Form.Control
                    as="select"
                    name="investmentAmount"
                    value={formData.investmentAmount}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    {investments.map(option => (
                      <option key={option.id} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formWhyJoin">
                  <Form.Label>Why do you want to join hand with Grace Laboratory</Form.Label>
                  <Form.Control
                    type="text"
                    name="whyYouWannaJoin"
                    value={formData.whyYouWannaJoin}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

               <Row>
              <Col md={12}>
                <Form.Group controlId="formState">
                  <Form.Label>Other Occupasion</Form.Label>
                  <Form.Control
                    type="text"
                    name="otherOccupation"
                    value={formData.otherOccupation}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
           
            </Row>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Toast Container */}
      <ToastContainer />
    </>
  );
}

export default Joinhandwithus;
