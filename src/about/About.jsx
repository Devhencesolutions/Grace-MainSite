import React, { useEffect, useState } from "react";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import { MdArrowForwardIos } from "react-icons/md";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Link, useParams, useHistory, useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import { IoCheckmarkDoneSharp, IoLocationSharp, IoCall } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import Cookies from "js-cookie";

function About() {
  const { _ID } = useParams();
  const [bout, setBout] = useState({ blogDesc: "", blogTitle: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/blogs/${_ID}`
        );
        setBout(res.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchAbout();
  }, [_ID]);

  useEffect(() => {
    if (bout.blogTitle) {
      const formattedTitle = bout.blogTitle.toLowerCase().replace(/\s+/g, "-"); // Format the title to be URL-friendly
      navigate(`/cms/${formattedTitle}`);
    }
  }, [bout.blogTitle, navigate]);

  const formatContent = (content) => {
    return `
    <style>
      .content-container {
        font-size: 16px; /* Base font size for all text */
        line-height: 1.6; /* Adjusted line-height for readability */
        color: black;
        margin-bottom: 20px; /* Minimal margin at the bottom */
      }
      .content-container h1, .content-container h2, .content-container h3, .content-container h4 {
        font-weight: bold;
        text-align: center;
        color: black;
        font-size: 20px; /* Single font size for all headings */
        margin-top: 20px; /* Minimal spacing above headings */
        margin-bottom: 10px; /* Minimal spacing below headings */
      }
      .content-container p {
        text-align: justify;
        margin-bottom: 15px; /* Reduced margin for paragraphs */
        color: black; /* Ensure text color is black */
      }
      .content-container img {
        display: block;
        margin: 20px auto; /* Reduced margin for uniform spacing */
        max-width: 100%;
        height: auto;
      }
      .content-container table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0; /* Reduced margin for tables */
      }
      .content-container table, .content-container th, .content-container td {
        border: 1px solid #ddd;
        padding: 10px; /* Reduced padding for tables */
      }
      .content-container th {
        text-align: center;
        background-color: #f2f2f2;
        font-weight: bold;
        font-size: 16px; /* Single font size for table headings */
        color: black; /* Ensure table header text color is black */
      }
      .content-container td {
        text-align: center;
        font-size: 16px; /* Single font size for table content */
        color: black; /* Ensure table content text color is black */
      }
      .content-container * {
        color: black !important; /* Force all text to be black */
      }
    </style>
    <div class="content-container">
      ${content}
    </div>
  `;
  };

  const removeStrongTags = (html) => {
    return html.replace(/<\/?strong>/g, "");
  };

  const userNameFromCookies = Cookies.get("PatientName");

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
        <Container>
          <div className="page-title-content">
            <h2>{bout.blogTitle || "Loading..."}</h2>
            <ul>
              <li>
                {/* <MdArrowForwardIos className='arrowright' /> */}
                <Link to="/">Home</Link>
              </li>
              {/* <li>About</li> */}
            </ul>
          </div>
        </Container>
      </div>

      <section class="team-details-area ptb-50">
        <div class="container">
          <div class="row mt-4">
            <Col lg={12} className="mb-4">
              <div className="team-details-desc">
                <div
                  dangerouslySetInnerHTML={{
                    __html: removeStrongTags(formatContent(bout.blogDesc)),
                  }}
                />
              </div>
            </Col>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
