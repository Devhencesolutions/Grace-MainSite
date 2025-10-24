import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../css/responsive.css";
import "../css/style.css";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import Pagetitle from "../patients/Pagetitle";
import { MdArrowForwardIos } from "react-icons/md";
import axios from "axios";
import { IoCheckmarkDoneSharp, IoLocationSharp, IoCall } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

function Testimonial() {
  const [center, setcenter] = useState([]);
  const userNameFromCookies = Cookies.get("PatientName");

  useEffect(() => {
    const Maincenter = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/Testimonial`
        );
        console.log("Testimonial list :", response.data);

        if (Array.isArray(response.data)) {
          setcenter(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setcenter([]);
        }
      } catch (error) {
        console.error("Error fetching CMS content:", error);
        setcenter([]);
      }
    };
    Maincenter();
  }, []);

  const isValidYouTubeURL = (url) => {
    const regExp = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    return regExp.test(url);
  };

  const extractYouTubeVideoID = (url) => {
    try {
      return url.split("v=")[1]?.split("&")[0] || null;
    } catch (error) {
      console.error("Error extracting video ID from URL:", url);
      return null;
    }
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
          heading="Testimonial"
          pagetitlelink="/"
          title1="Home"
          title2="About"
          IconComponent={MdArrowForwardIos}
        />
      </div>
      <section className="services-area ptb-120">
        <div className="container">
          <div className="row">
            {center.map((item) => {
              const videoID = isValidYouTubeURL(item.URL)
                ? extractYouTubeVideoID(item.URL)
                : null;

              return (
                <div className="col-lg-4 col-md-6 col-sm-6" key={item._id}>
                  <div className="single-services-box">
                    {videoID ? (
                      <iframe
                        width="100%"
                        height="280px"
                        src={`https://www.youtube.com/embed/${videoID}`}
                        title={item.Tittle}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <img
                        src="https://via.placeholder.com/280x160.png?text=No+Video+Available"
                        alt="Placeholder"
                        width="100%"
                        height="280px"
                      />
                    )}
                    <h3>{item.Tittle}</h3>
                    <p>{item.Description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export default Testimonial;
