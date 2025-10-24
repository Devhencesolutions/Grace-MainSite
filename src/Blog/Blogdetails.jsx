import React, { useEffect, useState } from 'react';
import Modalnavigationbar from '../navbar/Modalnavigationbar';
import { MdArrowForwardIos } from "react-icons/md";
import { Container, Row, Col, Spinner } from 'react-bootstrap'; // Import Spinner for loading
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import CommonSec from '../navbar/CommonSec';

function Blogdetails() {
  const { id } = useParams();

  const [bout, setBout] = useState({ blogDesc: "", blogTitle: "" }); // Initialize with a default structure
  const [loading, setLoading] = useState(true); // Loader state

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/AboutUs/${id}`
        );
        setBout(res.data);
        setLoading(false); // Data fetched successfully, stop loading
        console.log("blog details", res);
      } catch (error) {
        console.log("Error fetching data:", error);
        setLoading(false); // Stop loading even if there's an error
      }
    };
    fetchAbout();
  }, [id]);

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
      .content-container p, .content-container li, .content-container tr td {
        font-size: 16px !important;
      }
    </style>
    <div class="content-container">
      ${content}
    </div>
  `;
  };

  return (
    <>
    <CommonSec />
      <Modalnavigationbar />

      <div>
        <div className="page-title-area">
          <div className="container">
            <div className="page-title-content">
              <h2 style={{ fontSize: 20 }}>{bout.Title || 'Loading...'}</h2>
              <ul>
                <li>
                  <MdArrowForwardIos className='arrowright' />
                  <Link to='/'>Home</Link>
                </li>
                <li>Media</li>
              </ul>
            </div>
          </div>
        </div>
        {/* End Page Title Area */}
        {/* Start Blog Details Area */}
        <section className="blog-details-area">
          <div className="container">
            <div className="row justify-content-center">
              <Col lg={12} className="mb-4">
                {loading ? (
                  <div className="text-center">
                    <Spinner animation="border" variant="primary" /> {/* Show loader */}
                  </div>
                ) : (
                  <div className="team-details-desc">
                    <div dangerouslySetInnerHTML={{ __html: formatContent(bout.Description) }} />
                  </div>
                )}
              </Col>
            </div>
          </div>
        </section>
        {/* End Blog Details Area */}
      </div>
    </>
  );
}

export default Blogdetails;
