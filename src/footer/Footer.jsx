import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IoLocationSharp, IoCall } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import logo from "../img/logo.jpg";
import axios from "axios";
import {
  TiSocialFacebook,
  TiSocialInstagram,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialYoutube,
} from "react-icons/ti";
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  const [cmsdesc, setcmsdesc] = useState([]);

  useEffect(() => {
    localStorage.clear();

    const CMScontent = async () => {
      try {
        const HomeCMScontent = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/blogs`
        );
        setcmsdesc(HomeCMScontent.data);
      } catch (error) {
        console.log("cms data   :", error);
      }
    };
    CMScontent();
  }, []);

  const [titles, setTitles] = useState([]);
  console.log("show title ", titles);

  const fetchTitles = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/JoinHand`
      );
      setTitles(response.data); // Assuming the response is an array of objects with id and title
    } catch (error) {
      console.error("Error fetching titles:", error);
    }
  };

  useEffect(() => {
    fetchTitles(); // Fetch titles on component mount
  }, []);

  function handleLinkClick(item) {
    localStorage.setItem("selectedNavItem", item);
  }

  return (
    <>
      <footer className="footer-area">
        <Container>
          <Row>
            <Col lg={2} md={6} sm={6}>
              <div className="single-footer-widget">
                <div className="logo">
                  <Link to="/home">
                    <Image src={logo} alt="Logo" className="logoimage" />
                  </Link>
                  <div className="d-flex flex-column align-items-start mt-4">
                    <span className="" style={{ fontSize: "14px", margin: 10 }}>
                      Follow us on Social Media
                    </span>
                    <Link
                      className="useful-links-list mb-2"
                      to="https://www.facebook.com/gracelaboratory"
                      target="_blank"
                    >
                      <h5 className="d-flex align-items-center">
                        <TiSocialFacebook
                          style={{
                            backgroundColor: "#eb258e",
                            color: "white",
                            borderRadius: "50%",
                            padding: "2px",
                            fontSize: "22px",
                          }}
                        />
                        <span
                          className="ml-3"
                          style={{ fontSize: "14px", margin: 10 }}
                        >
                          Facebook
                        </span>
                      </h5>
                    </Link>

                    <Link
                      className="useful-links-list mb-2"
                      to="https://www.instagram.com/gracelaboratory/"
                      target="_blank"
                    >
                      <h5 className="d-flex align-items-center">
                        <TiSocialInstagram
                          style={{
                            backgroundColor: "#eb258e",
                            color: "white",
                            borderRadius: "50%",
                            padding: "2px",
                            fontSize: "24px",
                          }}
                        />
                        <span
                          className="ml-2"
                          style={{ fontSize: "14px", margin: 10 }}
                        >
                          Instagram
                        </span>
                      </h5>
                    </Link>

                    <Link
                      className="useful-links-list mb-2"
                      to="https://in.linkedin.com/in/bhavin-patel-8689b9215"
                      target="_blank"
                    >
                      <h5 className="d-flex align-items-center">
                        <TiSocialLinkedin
                          style={{
                            backgroundColor: "#eb258e",
                            color: "white",
                            borderRadius: "50%",
                            padding: "2px",
                            fontSize: "24px",
                          }}
                        />
                        <span
                          className="ml-2"
                          style={{ fontSize: "14px", margin: 10 }}
                        >
                          LinkedIn
                        </span>
                      </h5>
                    </Link>

                    <Link
                      className="useful-links-list mb-2"
                      to="https://x.com/i/flow/login?redirect_after_login=%2FGraceLaboratory"
                      target="_blank"
                    >
                      <h5 className="d-flex align-items-center">
                        <FaXTwitter
                          style={{
                            backgroundColor: "#eb258e",
                            color: "white",
                            borderRadius: "50%",
                            padding: "2px",
                            fontSize: "24px",
                          }}
                        />
                        <span
                          className="ml-2"
                          style={{ fontSize: "14px", margin: 10 }}
                        >
                          Twitter
                        </span>
                      </h5>
                    </Link>

                    <Link
                      className="useful-links-list mb-2"
                      to="https://www.youtube.com/channel/UC0p5Z4uvneAUvmSTCoEZ23w"
                      target="_blank"
                    >
                      <h5 className="d-flex align-items-center">
                        <TiSocialYoutube
                          style={{
                            backgroundColor: "#eb258e",
                            color: "white",
                            borderRadius: "20%",
                            padding: "2px",
                            fontSize: "24px",
                          }}
                        />
                        <span
                          className="ml-2"
                          style={{ fontSize: "14px", margin: 10 }}
                        >
                          YouTube
                        </span>
                      </h5>
                    </Link>
                  </div>
                  {/* <h5><FaLinkedin /></h5> */}
                </div>
              </div>
            </Col>
            <Col lg={5} md={6} sm={6}>
              <Row>
                <Col sm={6}>
                  <div className="single-footer-widget">
                    <h3>Useful Links</h3>
                    <ul className="useful-links-list">
                      {cmsdesc.slice(0, -1).map((link, index) => (
                        <li key={index}>
                          <Link to={`/cms/${link._id}`}>{link.blogTitle}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="single-footer-widget">
                    <h3>Our Network</h3>
                    <ul className="widget-services-list">
                      <li>
                        <Link
                          to="/laboratory"
                          onClick={() => handleLinkClick("Laboratory")}
                        >
                          Laboratory
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/pharmacy"
                          onClick={() => handleLinkClick("Pharmacy")}
                        >
                          Pharmacy
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/doctor"
                          onClick={() => handleLinkClick("Doctors")}
                        >
                          Doctors
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/hospital"
                          onClick={() => handleLinkClick("Hospital")}
                        >
                          Hospital
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/patient-login"
                          onClick={() => handleLinkClick("Patients")}
                        >
                          Member
                        </Link>
                      </li>
                    </ul>
                  </div>
                </Col>
                <Col sm={12}>
                  <div className="single-footer-widget">
                    <h3>Contact Us</h3>
                    <ul className="footer-contact-info">
                      <li>
                        <IoLocationSharp className="location" />{" "}
                        <span>
                          61, Starry Opaque Banglows, Vadodara, Makarpura, opp swami residency,Vadodara, Gujarat-390014

                        </span>
                      </li>
                      <li>
                        <IoCall className="location" />{" "}
                        <a href="tel:+919313803441">+91&nbsp;93138&nbsp;03441</a>
                      </li>
                      <li>
                        <IoIosMail className="location" />{" "}
                        <a href="mailto:bharat.gracemedicalservices@gmail.com">
                          bharat.gracemedicalservices@gmail.com
                        </a>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col lg={5} md={6} sm={6}>
              <Row>
                <Col sm={6}>
                  <div className="single-footer-widget">
                    <h3>Join With Us</h3>
                    <ul className="widget-services-list">
                      <li>
                        <Link to="/Directors">Directors</Link>
                      </li>
                      <li>
                        <Link to="/Testimonial">Testimonial</Link>
                      </li>
                      <li>
                        <Link to="/awards">Awards & Certificates</Link>
                      </li>
                      <li>
                        <Link to="/news">News & Media</Link>
                      </li>

                      <li>
                        <Link to="/contact">Contact Us</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="single-footer-widget">
                    <h3>Opportunities</h3>
                    <ul className="widget-services-list">
                      <li className="nav-item">
                        {titles.map((item) => (
                          <li key={item._id}>
                            <Link
                              to={`/join-handwith-us/${item._id}`}
                              onClick={() => `/join-handwith-us/${item._id}`}
                              className={`nav-link ${`/join-handwith-us/${item.id}`}`}
                            >
                              {item.Tittle}
                            </Link>
                          </li>
                        ))}
                      </li>
                    </ul>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="single-footer-widget">
                    <h3>Packages</h3>
                    <ul className="widget-services-list">
                      <li>
                        <Link to="/pregnancy-blood-test">
                          Pregnancy Blood Test
                        </Link>
                      </li>
                      <li>
                        <Link to="/blood-test-kids">Blood Test For Kids</Link>
                      </li>
                      <li>
                        <Link to="/full-body-checkup">Full Body Checkup</Link>
                      </li>
                      <li>
                        <Link to="/senior-citizen-male">
                          Health checkup for senior citizen (male)
                        </Link>
                      </li>
                      <li>
                        <Link to="/senior-citizen-female">
                          Health checkup for senior citizen (Female)
                        </Link>
                      </li>
                      <li>
                        <Link to="/swine-flue">
                          Swine Flue Test In Vadodara
                        </Link>
                      </li>
                      <li>
                        <Link to="/serology-blood-test">
                          Serology Blood Test
                        </Link>
                      </li>
                      <li>
                        <Link to="/PCOD-pofile-blood-test">
                          PCOD Profile Blood Test
                        </Link>
                      </li>
                      <li>
                        <Link to="/ige-test">Blood Ige Test in Vadodara</Link>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
        <div className="copyright-area" style={{ backgroundColor: "#131313" }}>
          <Container>
            <Row className="align-items-center">
              <Col lg={6} md={6} sm={6}>
                <p className="text-white">
                  © 2024{" "}
                  <Link to="https://gracelaboratory.com/">
                    Grace Laboratory
                  </Link>{" "}
                  All Rights Reserved
                </p>
              </Col>
              {/* <Col lg={6} md={6} sm={6} className="text-end">
                <p className="text-white footer-section">
                  Powered By :{" "}
                  <a
                    href="https://www.barodaweb.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    BarodaWeb | The E-Catalogue Designer
                  </a>
                </p>
              </Col> */}
            </Row>
          </Container>
        </div>
      </footer>
    </>
  );
}

export default Footer;
