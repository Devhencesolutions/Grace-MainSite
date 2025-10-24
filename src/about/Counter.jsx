import React from 'react'
import { Col } from 'react-bootstrap';

function Counter(props) {
  return (
    <>
    <Col lg={3} md={3} sm={6} xs={6}>
            <div className="single-funfacts">
              <h3><span className="odometer">{props.count}</span></h3>
              <p>{props.title}</p>
            </div>
          </Col>
    
    
    </>
  )
}

export default Counter