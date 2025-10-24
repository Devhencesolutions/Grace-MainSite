import React, { useEffect, useState } from "react";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import { MdArrowForwardIos } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import placeholderimage from "../img/center-placeholder.jpg";
import { FaMapMarkerAlt } from "react-icons/fa"; // Import React Icon
import { MdWifiCalling3 } from "react-icons/md";

import axios from "axios";
import CommonSec from "../navbar/CommonSec";

function Centerdetails() {
  const { id } = useParams();
  const [bout, setBout] = useState({}); // Initialize as an empty object

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/Centers/${id}`
        );
        setBout(res.data);
        console.log("center details", res);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchAbout();
  }, [id]);

  const bannerImageUrl = bout.bannerImage
    ? encodeURI(`${process.env.REACT_APP_API_URL_GRACELAB}/${bout.bannerImage}`)
    : placeholderimage;

  console.log("bout data", bout);

  return (
    <>
    <CommonSec />
      <Modalnavigationbar />

      <div>
        <div className="page-title-area">
          <div className="container">
            <div className="page-title-content">
              <h2>{bout.Name || "Loading..."}</h2>
              <ul>
                <li>
                  <MdArrowForwardIos className="arrowright" />
                  <Link to="/">Home</Link>
                </li>
                <li>{bout.Name || "Loading..."}</li>
              </ul>
            </div>
          </div>
        </div>

        <section className="team-details-area ptb-120">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-12">
                <div className="team-details-sidebar">
                  <div className="team-profile">
                    <img
                      src={bannerImageUrl}
                      alt={bout.Name}
                      onError={(e) => {
                        e.target.src = placeholderimage;
                      }}
                    />
                  </div>

                  <div className="call-to-action-box">
                    <Link to="/contact">
                      <i className="fas fa-headset" />
                      <h3>Contact Us Today</h3>
                      
                    </Link>
                  </div>
                 
                </div>
              </div>

              <div className="col-lg-8 col-md-12">
                <div className="team-details-desc">
                  <h3>{bout.Name}</h3>

                  {/* Assuming bout has specific details to display */}
                  {bout.Address ? (
                    <ul className="team-info">
                      <li>
                        <span
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "50px",
                            height: "25px",
                            color: "#eb268f",
                          }}
                        >
                          <FaMapMarkerAlt
                            style={{
                              width: "40px",
                              height: "40px",
                            }}
                          />
                        </span>
                        <ul>
                          <Link to={bout.Location} target="_blank">
                            <h6>{bout.Address}</h6> {/* Changed <p> to <li> */}
                          </Link>
                        </ul>
                      </li>

                  <br />

                       <li>
                        <span
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "50px",
                            height: "25px",
                            color: "#eb268f",
                          }}
                        >
                          <MdWifiCalling3 
                            style={{
                              width: "40px",
                              height: "40px",
                            }}
                          />
                        </span>
                        <ul>
                        
                            <h6>{bout.Contact}</h6> {/* Changed <p> to <li> */}
                          
                        </ul>
                      </li>

                    </ul>

                    
                  ) : (
                    <p>No data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Centerdetails;
