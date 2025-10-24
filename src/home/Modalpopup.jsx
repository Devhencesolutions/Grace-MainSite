import React from 'react'
import { Col, Card,Image  } from 'react-bootstrap';
import { Link } from 'react-router-dom';


function Modalpopup(props) {
  return (
   <>
   <Col lg={props.size} md={4} sm={6}>
      <Link to={props.modalpopuplink}>
        <Card className="single-services-box-modalpopup text-center">
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

export default Modalpopup