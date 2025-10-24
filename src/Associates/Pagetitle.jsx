import React from "react";
import { Button } from "react-bootstrap";

import { Link, useNavigate } from "react-router-dom";

function Pagetitle(props) {
  const navigate = useNavigate();

  return (
    <>
      <div className="container">
        <div className="page-title-content">
          <h2>
            <Link to={props.pagetitlelink}>{props.heading}</Link>
          </h2>
          <p
            className="mt-3 ml-3 float-end "
            style={{ color: "magenta", cursor:"pointer" }}
            onClick={() => navigate(props.pagetitlelink)}
          >
            {props.registrationTitle}
          </p>
          <ul>
            <li>
              {/* {props.IconComponent && <props.IconComponent className='arrowright' />} */}
              {props.title1}
              {" > "} {props.title2}
            </li>
            {/* <li> {props.title2}</li> */}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Pagetitle;
