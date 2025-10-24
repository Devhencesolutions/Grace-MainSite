import React from 'react'
import { Link } from 'react-router-dom'
import { Col, Card,Image  } from 'react-bootstrap';
import '../css/responsive.css';
import '../css/style.css';


function Network(props) {
  return (
    <>
       <Col lg={3} md={6} sm={6}>
      <Link to={props.networklink}>
        <Card className="single-services-box text-center">
          <Card.Body>
            <div className="icon">
            <Image src={props.networkimage} alt="Service Icon" />
            </div>
            <Card.Title className='networktitle'>{props.networktitle}</Card.Title>
          </Card.Body>
        </Card>
      </Link>
    </Col>
    
    </>
  )
}

export default Network










