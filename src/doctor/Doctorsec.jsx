import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMapMarker } from "react-icons/fa";
import { Col, Row } from "react-bootstrap";
import { IoMdTimer } from "react-icons/io";
import axios from "axios";

function Doctorsec(props) {
  const [dayName, setDayName] = useState("");
  const [dayName2, setDayName2] = useState("");
  const [dayName3, setDayName3] = useState("");

  useEffect(() => {
    const fetchDayName = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/Days/${props.dayslab1}`
        );
        setDayName(response.data.Days);
      } catch (error) {
        console.error("Error fetching day name:", error);
      }
    };

    fetchDayName();

    const fetchDayName2 = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/Days/${props.dayslab2}`
        );
        setDayName2(response.data.Days);
      } catch (error) {
        console.error("Error fetching day name:", error);
      }
    };

    fetchDayName2();

    const fetchDayName3 = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/Days/${props.dayslab3}`
        );
        setDayName3(response.data.Days);
      } catch (error) {
        console.error("Error fetching day name:", error);
      }
    };

    fetchDayName3();
  }, [props.dayslab1, props.dayslab2, props.dayslab3]);

  const isClosed = dayName2 === "Sat(closed)" || dayName2 === "Sun(closed)";

  return (
    <>
      <div className="single-research-box">
        <Row>
          <Col lg={6}>
            <div className="research-image">
              <Link to="/">
                <img src={props.drimage} alt="image" />
              </Link>
            </div>
          </Col>

          <Col lg={6}>
            <div className="research-content">
              {/*<span>Pathology</span>*/}
              <h3>
                <Link to="/">{props.drname}</Link>
              </h3>
              <p>{props.drlocation}</p>
              <div className="location-marker-section">
                <Link to={props.locationall} target="_blank">
                  <h5 className="mt-1 d-inline-block me-2">
                    <FaMapMarker className="map-color" />
                    {props.location}
                  </h5>
                </Link>
              </div>

              <div className="location-marker-section">
                <h5 className="mt-3 d-inline-block me-2">
                  <IoMdTimer className="map-color" /> {props.starttime1} -{" "}
                  {props.endtime1} - {dayName} <br /> <br />
                  <IoMdTimer className="map-color" />
                  {
                    isClosed
                      ? `${dayName2}` // Only show the day name if it's closed
                      : `${props.starttime2} - ${props.endtime2} - ${dayName2}` // Show start time, end time, and day name
                  }
                  <br /> <br />
                  <IoMdTimer className="map-color" />
                  {
                    isClosed
                      ? `${dayName3}` // Only show the day name if it's closed
                      : `${props.starttime3} - ${props.endtime3} - ${dayName3}` // Show start time, end time, and day name
                  }
                </h5>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Doctorsec;
