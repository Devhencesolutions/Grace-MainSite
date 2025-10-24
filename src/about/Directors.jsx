import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { MdArrowForwardIos } from "react-icons/md";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import axios from "axios";
import Pagetitle from "../patients/Pagetitle";
import placeholderimage from "../img/placeholder.jpeg";
import "../css/responsive.css";
import "../css/style.css";
import { IoCheckmarkDoneSharp, IoLocationSharp, IoCall } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

function Directors() {
  const [blog, setBlog] = useState([]);
  const userNameFromCookies = Cookies.get("PatientName");

  useEffect(() => {
    const CMScontent = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/Director`
        );
        console.log("Director list:", response.data);

        if (Array.isArray(response.data)) {
          setBlog(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setBlog([]);
        }
      } catch (error) {
        console.error("Error fetching CMS content:", error);
        setBlog([]);
      }
    };

    CMScontent();
  }, []);

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
          heading="Grace Medical Services Management"
          pagetitlelink="/"
          title1="Home"
          title2="About"
          IconComponent={MdArrowForwardIos}
        />
      </div>

      <section className="team-details-area ptb-120">
        <div className="container">
          <div className="row">
            {blog.map((item, index) => (
              <React.Fragment key={item.id}>
                {index % 2 === 0 ? (
                  <>
                    <div className="col-lg-4 col-md-12">
                      <div className="director-details-sidebar">
                        <div className="team-profile">
                          <img
                            src={
                              item.bannerImage
                                ? `${process.env.REACT_APP_API_URL_GRACELAB}/${item.bannerImage}`
                                : placeholderimage
                            }
                            alt={item.Tittle}
                          />
                          <div className="team-content">
                            {/* <h3>{item.Tittle}</h3> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-8 col-md-12">
                      <div className="team-details-desc">
                        <h3>{item.Tittle}</h3>
                        <p>{item.Description}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-lg-8 col-md-12">
                      <div className="team-details-desc">
                        <h3>{item.Tittle}</h3>
                        <p>{item.Description}</p>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12">
                      <div className="director-details-sidebar">
                        <div className="team-profile">
                          <img
                            src={
                              item.bannerImage
                                ? `${process.env.REACT_APP_API_URL_GRACELAB}/${item.bannerImage}`
                                : placeholderimage
                            }
                            alt={item.Tittle}
                          />
                          <div className="team-content">
                            {/* <h3>{item.Tittle}</h3> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Directors;
