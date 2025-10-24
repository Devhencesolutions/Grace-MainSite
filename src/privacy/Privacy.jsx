import React from 'react'
import Modalnavigationbar from '../navbar/Modalnavigationbar'
import Pagetitle from '../patients/Pagetitle'
import { MdArrowForwardIos } from "react-icons/md";
import { Container, Row, Col, Form, InputGroup, Button, Checkbox ,Modal} from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Privacy() {
  return (
   <>
   
   <Modalnavigationbar />
    <div className="page-title-area">
    <Pagetitle  
    heading="Privacy Policies"
    pagetitlelink="/"
    title1="Home"
    title2="Privacy"
    IconComponent={MdArrowForwardIos}
    />
</div>



<section className="services-area ptb-70 pb-5">
      <Container>
        <Row className="justify-content-center" id="loginPanel">
          <Col md={12} lg={10}>
                        <div class="research-details-desc">
                            <h3>Challenge & Solution</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.</p>

                            <h3>Exerci tation ullamcorper suscipit lobortis</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.</p>

                            <h3>Occaecat sint occaecat suscipit dolore</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.</p>

                            <h3>Being a top us private facility for any kind</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.</p>

                            <h3>Our Process</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.</p>
                        </div>
                </Col>
                </Row>
            </Container>
    </section>
   
   </>
  )
}

export default Privacy