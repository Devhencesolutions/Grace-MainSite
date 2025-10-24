import React,{useState} from 'react'
import { IoIosArrowForward } from "react-icons/io";
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, InputGroup, Button, Checkbox ,Modal} from 'react-bootstrap';
// import { Modal } from 'react-bootstrap';
import network from '../img/network.jpg';
// import Pagetitle from './Pagetitle';

import Modalnavigationbar from '../navbar/Modalnavigationbar';
import Pagetitle from '../patients/Pagetitle';




function Forgotpass() {
  return (
   <>
<Modalnavigationbar />



{/* section start */}
<section className="services-area ptb-70 pb-5">
      <Container>
        <Row className="justify-content-center" id="loginPanel">
          <Col md={12} lg={10}>
            <div className="wrap d-md-flex">
              <div className="forgotpass-wrap p-4 p-md-5">
                <div className="d-block">
                  <div className="w-100 text-center">
                    <h3 className="mb-2 h5 fw-bold">Forgot Your Password</h3>
                    <p className="mb-4">Please enter the email you use to sign in </p>
                  </div>
                </div>
                <Form className="signin-form">
                  <Form.Group className="mb-3" controlId="formUsername" >
                    {/* <Form.Label>Your email</Form.Label> */}
                    <Form.Control type="text" placeholder="Enter Your Email" required  className='forgotlabel'/>
                  </Form.Group>
                
                  
                  <Button type="submit"  className="form-control btn btn-sign-in rounded submit px-3">Request Password Reset</Button>

                  <p className="text-center hospitallogin">Back to Home?<Link to='/' className="d-inline-block">Home</Link></p>
                </Form>
                
                    </div>
                    
                    </div>
                </Col>
                </Row>
            </Container>
    </section>
   
   
   
   </>
  )
}

export default Forgotpass