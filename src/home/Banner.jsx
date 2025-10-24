import React from 'react'
import { Col, Card,Image  } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Banner(props) {
  return (
    <>
    <Col lg={4} md={6} sm={6}>
      <div className="single-box p-0">
        <Image src={props.baneerimg} fluid />
      </div>
    </Col>
    
    
    </>
  )
}

export default Banner