import React from 'react'
import { Col, Card,Image  } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Program(props) {
  return (
    <>
    <Card className="section-title">
    
    <span>{props.title}</span>
    <h2>{props.heading}</h2>
 
  <Link to={props.headinglink} className="btn btn-secondary">{props.headinglinktitle}</Link>
</Card>
    
    
    </>
  )
}

export default Program