import React, { useEffect, useState } from "react";

import "react-responsive-carousel/lib/styles/carousel.min.css";

import "../css/responsive.css";
import "../css/style.css";

import Modalnavigationbar from "../navbar/Modalnavigationbar";
import { Card } from "react-bootstrap";
import { FaMapMarkerAlt } from "react-icons/fa"; // Import React Icon
import Pagetitle from "../patients/Pagetitle";
import { MdArrowForwardIos } from "react-icons/md";
import axios from "axios";
import { Link } from "react-router-dom";
import CommonSec from "../navbar/CommonSec";


function Center() {
  const [center, setcenter] = useState([]);

useEffect(() => {
    const Maincenter = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/Centers`
        );
        console.log("Center list:", response.data);

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
}, [])


  return (
    <>
    <CommonSec />
      <Modalnavigationbar />
      <div className="page-title-area">
        <Pagetitle
          heading="Center"
          pagetitlelink="/"
          title1="Home"
          title2="Contact"
          IconComponent={MdArrowForwardIos}
        />
      </div>
      <section class="services-area ptb-120">
        <div class="container">
          <div class="row">
           {center.map((center)=>(
              
  <div class="col-lg-4 col-md-6 col-sm-6">
    <Link to={`/centerdetails/${center._id}`}>
            <div className="service-center">
  <div class="single-services-box-center">
                <div class="icon">
                  <FaMapMarkerAlt className="service-icon" />{" "}
                  {/* Location icon */}
                </div>

                <h3>{center.Name}</h3>
                <p>
                 {center.Address}
                </p>
               <h3>M:{center.Contact}</h3>

                {/* <a href="single-services.html" class="learn-more-btn">
                  Learn More <i class="flaticon-arrow-pointing-to-right"></i>
                </a> */}
              </div>
            </div>
                </Link>
            </div>
            
           ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Center;
