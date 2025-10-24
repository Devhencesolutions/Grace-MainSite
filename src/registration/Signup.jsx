import React,{useState} from 'react'
import { IoIosArrowForward } from "react-icons/io";
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, InputGroup, Button, Checkbox ,Modal} from 'react-bootstrap';
// import { Modal } from 'react-bootstrap';
import network from '../img/network.jpg';
// import Pagetitle from './Pagetitle';

import Modalnavigationbar from '../navbar/Modalnavigationbar';
import { MdArrowForwardIos } from "react-icons/md";
import Pagetitle from '../patients/Pagetitle';




function Signup() {

  return (
   <>
<Modalnavigationbar />

<div className="page-title-area">
    <Pagetitle  
    heading="Signup"
    pagetitlelink="/"
    title1="Home"
    title2="Signup"
    IconComponent={MdArrowForwardIos}
    />
</div>

{/* section start */}
<section className="services-area ptb-70 pb-5">
      <Container>
        <Row className="justify-content-center" id="loginPanel">
          <Col md={12} lg={10}>
            <div className="wrap d-md-flex">
              <div className="login-wrap p-4 p-md-5">
                <div className="d-block">
                  <div className="w-100 text-center">
                    <h3 className="mb-4 h5 fw-bold">Please login to your account</h3>
                    {/* <p className="mb-4">Please login to your account</p> */}
                  </div>
                </div>
                <Form className="signin-form">
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Username" required />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" required />
                  </Form.Group>
                  <Row className="mb-4">
                    <Col className="text-start" xs={6}>
                    <Form.Check type="checkbox"  label="Remember Me"/>

                    </Col>
                    <Col className="text-end" xs={6}>
                      <Link to="/forgotpassword">Forgot Password?</Link>
                    </Col>
                  </Row>
                  <Button type="submit"  className="form-control btn btn-sign-in rounded submit px-3">Sign In</Button>
                </Form>
                <p className="text-center accounttop">Don't have an account? <Link to="/registration" className="d-inline-block">Register here</Link></p>
                <p className="text-center fw-bold">
                {/* <Link to="#" onClick={handleShow} style={{ color: "#eb268f" }}>Why Registered with us</Link> */}

                 
                        </p>  
                    </div>
                    <div class="img" style={{backgroundImage:`url(${network})`}} >
                        </div>
                    </div>
                </Col>
                </Row>
            </Container>
    </section>
   
   
   
   </>
  )
}

export default Signup