import React from 'react'
import { Container, Row, Col, Image,Form } from 'react-bootstrap';



function Hospitallable(props) {
  return (
   <>
   <Col lg={props.size} md={12} xs={12}>
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" id="create-an-account" />
                      <label className="form-check-label" htmlFor="create-an-account">{props.label}</label>
                    </div>
                    </Col>
   
   </>
  )
}

export  {Hospitallable}


function Hospitalname(props) {
  return (
   <>
     {props.hospitals && props.hospitals.map((hospital, index) => (
  <div key={index} className="col-lg-12 col-md-12 col-12">
    <div className="form-check">
      <input type="checkbox" className="form-check-input" id={`create-an-account-${index}`} />
      <label className="form-check-label" htmlFor={`create-an-account-${index}`}>{hospital.name}</label>
    </div>
  </div>  
))}

   
   </>
  )
}

export  {Hospitalname}


function Hospitalad(props) {
  return (
   <>
   <Col lg={12} md={12} xs={12} className="mb-20">
          <div className="ad-image position-relative">
            <Image src={props.hospitaladimage} fluid />
            <div className="span-title">
              <span>Ad</span>
            </div>
          </div>
        </Col>
   
   </>
  )
}

export  {Hospitalad}

