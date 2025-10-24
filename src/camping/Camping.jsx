import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Tab, Tabs, Container, Row } from "react-bootstrap";
import axios from "axios";
import placeholderimage from "../img/placeholder.jpeg";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import Pagetitle from "../patients/Pagetitle";
import { MdArrowForwardIos } from "react-icons/md";
import Doctordetails from "./Doctordetails";
import { FaUser } from "react-icons/fa";
import { SiSquare } from "react-icons/si";
import { IoCheckmarkDoneSharp, IoLocationSharp, IoCall } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import Cookies from "js-cookie";

function Camping() {
  const [camp, setCamp] = useState([]);
  const [upcomingcamps, setupcomingcapms] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null); // State for selected doctor
  const [showDoctorModal, setShowDoctorModal] = useState(false); // State to show doctor details modal
  const userNameFromCookies = Cookies.get("PatientName");

  useEffect(() => {
    const fetchcompletedcamps = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list-by-params/listCompletedCampsByParams`,
          {
            skip: 0,
            per_page: 1000,
            sorton: "Date",
            sortdir: "desc",
            match: "",
            IsActive: true,
          }
        );

        setCamp(response.data[0].data);
      } catch (error) {
        console.error("Error fetching camping data:", error);
      }
    };

    fetchcompletedcamps();

    const fetchupcomingcamps = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list-by-params/listUpcomingCampsByParams`,
          {
            skip: 0,
            per_page: 1000,
            sorton: "Date",
            sortdir: "desc",
            match: "",
            IsActive: true,
          }
        );

        setupcomingcapms(response.data[0].data);
      } catch (error) {
        console.error("Error fetching camping data:", error);
      }
    };

    fetchupcomingcamps();
  }, []);

  const handleRedirect = () => {
    window.open(
      "https://frontgracelab.barodaweb.in/patient-inquiry",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleDoctorClick = (doctorId) => {
    setSelectedDoctor(doctorId);
    setShowDoctorModal(true);
  };

  const handleCloseDoctorModal = () => {
    setShowDoctorModal(false);
    setSelectedDoctor(null);
  };

  return (
    <>
      <div
        className="copyright-area-home"
        style={{ backgroundColor: "#eb268f" }}
      >
        <Container>
          <Row className="align-items-center">
            <Col
              lg={4}
              md={12}
              sm={12}
              xs={12}
              xl={4}
               className="d-flex align-items-center gap-3"
            >
              <Link
                to="tel:+919313803441"
                className="d-flex align-items-center text-white text-decoration-none"
              >
                <IoCall className="location" style={{ fontSize: 20 }} />
                <p className="mb-0 ms-2 text-white">+91&nbsp;93138&nbsp;03441</p>
              </Link>
              <Link
                to="mailto:bharat.gracemedicalservices@gmail.com"
                className="d-flex align-items-center text-white text-decoration-none"
              >
                <IoIosMail className="location" style={{ fontSize: 20 }} />
                <p className="mb-0 ms-2 text-white">bharat.gracemedicalservices@gmail.com</p>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
      <Modalnavigationbar />

      <div className="page-title-area">
        <Pagetitle
          heading="Our Camping"
          pagetitlelink="/"
          title1="Home"
          title2="Camping"
          IconComponent={MdArrowForwardIos}
        />
      </div>

      <section className="services-area products-details-tab ptb-100">
        <div className="container">
          <Tabs
            defaultActiveKey="upcoming"
            id="camping-tabs"
            className="tabs d-flex justify-content-center mb-5 dot"
          >
            <Tab
              eventKey="completed"
              title="Completed Camping"
              className="box-before"
            >
              <div className="row">
                {camp.length > 0 ? (
                  camp.map((camping) => (
                    <Col key={camping.id} lg={4} className="mb-4">
                      <Link to="/camping">
                        <Card className="camping-card card">
                          <Card.Img
                            className="card-img-top card-image-camping"
                            variant="top"
                            src={`${process.env.REACT_APP_API_URL_GRACELAB}/${camping.Photo}`}
                            alt={camping.title}
                            onError={(e) => {
                              e.target.src = placeholderimage;
                            }}
                            style={{
                              borderTopLeftRadius: "8px",
                              borderTopRightRadius: "8px",
                            }}
                          />
                          <Card.Body className="card-body-camping card-body">
                            <Card.Title className="mb-3">
                              {camping.title}
                            </Card.Title>
                            <p>
                              <strong
                                style={{ fontSize: "1rem", fontWeight: "600" }}
                              >
                                Camp Venue:
                              </strong>{" "}
                              <span className="camp-venue">
                                {camping.CampVenueDetails?.Society || "N/A"}
                              </span>
                            </p>
                            <div className="date-flex">
                              <p>
                                <strong>Date:</strong>
                                {camping.Date
                                  ? new Date(camping.Date).toLocaleDateString()
                                  : "N/A"}
                              </p>
                              <p>
                                <strong>
                                  No Of Patients:{" "}
                                  {camping.NoOfPatients || "N/A"}
                                </strong>
                              </p>
                            </div>
                            <Card.Text style={{ marginBottom: "1rem" }}>
                              <strong>Description:</strong>{" "}
                              {camping.Descreption}
                            </Card.Text>
                            <Card.Text>
                              <strong>Doctors</strong>
                              <ul className="row doc-list">
                                {camping.DoctorsDetails &&
                                  camping.DoctorsDetails.map(
                                    (doctor, index) => (
                                      <li
                                        className="col-12 col-lg-6 mb-2"
                                        key={index}
                                        onClick={() =>
                                          handleDoctorClick(doctor._id)
                                        }
                                      >
                                        <div className="d-flex align-items-center">
                                          <FaUser
                                            style={{
                                              color: "#eb268f",
                                              marginRight: "5px",
                                            }}
                                          />
                                          {doctor.DoctorName}
                                        </div>
                                      </li>
                                    )
                                  )}
                              </ul>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Link>
                    </Col>
                  ))
                ) : (
                  <p className="text-center">
                    Currently, there are no completed camping events.
                  </p>
                )}
              </div>
            </Tab>

            <Tab
              eventKey="upcoming"
              title="Upcoming Camping"
              className="box-before"
            >
              <div className="row">
                {upcomingcamps.length > 0 ? (
                  upcomingcamps.map((camping) => (
                    <Col key={camping.id} lg={4} className="mb-4">
                      <Card className="camping-card">
                        <Card.Img
                          className="card-image-camping"
                          variant="top"
                          src={`${process.env.REACT_APP_API_URL_GRACELAB}/${camping.Photo}`}
                          alt={camping.title}
                          onError={(e) => {
                            e.target.src = placeholderimage;
                          }}
                          style={{ objectFit: "cover", height: "200px" }}
                        />
                        <Card.Body className="card-body-camping card-body">
                          <Card.Title className="mb-3">
                            {camping.title}
                          </Card.Title>
                          <p>
                            <strong
                              style={{ fontSize: "1rem", fontWeight: "600" }}
                            >
                              Camp Venue:
                            </strong>{" "}
                            <span className="camp-venue">
                              {camping.CampVenueDetails?.Society || "N/A"}
                            </span>
                          </p>
                          <div className="date-flex">
                            <p>
                              <strong>Date:</strong>
                              {camping.Date
                                ? new Intl.DateTimeFormat("en-GB").format(
                                    new Date(camping.Date)
                                  )
                                : "N/A"}
                            </p>
                            <p>
                              <strong>
                                No Of Patients: {camping.NoOfPatients || "N/A"}
                              </strong>
                            </p>
                          </div>
                          <Card.Text style={{ marginBottom: "1rem" }}>
                            <strong>Description:</strong> {camping.Descreption}
                          </Card.Text>
                          <Card.Text>
                            <strong>Doctors</strong>
                            <ul className="row doc-list">
                              {camping.DoctorsDetails &&
                                camping.DoctorsDetails.map((doctor, index) => (
                                  <li
                                    className="col-12 col-lg-6 mb-2"
                                    key={index}
                                    onClick={() =>
                                      handleDoctorClick(doctor._id)
                                    }
                                  >
                                    <div className="d-flex align-items-center">
                                      <FaUser
                                        style={{
                                          color: "#eb268f",
                                          marginRight: "5px",
                                        }}
                                      />
                                      {doctor.DoctorName}
                                    </div>
                                  </li>
                                ))}
                            </ul>
                          </Card.Text>
                        </Card.Body>
                        <div className="p-3 d-flex justify-content-end">
                          <Link
                            to="/patient-inquiry"
                            className="btn btn-primary"
                            style={{
                              borderRadius: "10px",
                              padding: 10,
                              fontSize: "1rem",
                            }}
                          >
                            Register
                          </Link>
                        </div>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <p className="text-center">
                    Currently, there are no upcoming camping events.
                  </p>
                )}
              </div>
            </Tab>
          </Tabs>
        </div>
      </section>

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <Doctordetails
          doctorId={selectedDoctor}
          show={showDoctorModal}
          handleClose={handleCloseDoctorModal}
        />
      )}
    </>
  );
}

export default Camping;
