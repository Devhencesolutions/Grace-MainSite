import React, { useEffect, useState } from "react";
import { IoIosMail } from "react-icons/io";
import { IoCall, IoCheckmarkDoneSharp } from "react-icons/io5";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";

import {
  Card,
  Col,
  Container,
  Image,
  Row,
  Tab,
  Tabs
} from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";

import axios from "axios";
import Cookies from "js-cookie";
import {
  FaChevronCircleLeft,
  FaChevronCircleRight
} from "react-icons/fa";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // Include the Lightbox CSS
import { useMediaQuery } from "react-responsive";
import { Tooltip } from "reactstrap";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/effect-flip";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "../css/responsive.css";
import "../css/style.css";
import icon1 from "../img/icon1.png";
import icon2 from "../img/icon2.png";
import icon3 from "../img/icon3.png";
import icon4 from "../img/icon4.png";
import icon5 from "../img/icon5.png";
import icon6 from "../img/icon6.png";
import placeholderbanner from "../img/placeholder-banner.jpg";
import placeholderimage from "../img/placeholder.jpeg";
import Modalnavigationbar from "../navbar/Modalnavigationbar";

function Home() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const [bannerList, setBannerList] = useState([]);
  const [campList, setcampList] = useState([]);
  const [cmsdesc, setcmsdesc] = useState([]);
  const [Loyalty, setLoyalty] = useState([]);
  const [camp, setcamp] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [upcomingcamps, setupcomingcapms] = useState([]);

  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  // about section add here

  // const { _ID } = useParams();
  const [bout, setBout] = useState({ blogDesc: "", blogTitle: "" });

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/blogs/66fe6213c15ae7e3b150337d`
        );
        setBout(res.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchAbout();
  }, []);

  // Helper function to extract the first paragraph from blogDesc
  const removeStrongTags = (html) => {
    return html.replace(/<\/?strong>/g, "");
  };

  const formatContent = (content) => {
    return `
      <style>
        .content-container {
          font-size: 16px;
          line-height: 1.6;
          color: black;
        }
        .content-container p {
          text-align: justify;
        }
          
      </style>
      <div class="content-container">
        ${content}
      </div>
    `;
  };

  const isMobile = useMediaQuery({ query: "(max-width: 992px)" }); // Mobile screen (767px or less)

  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth < 576) {
        setItemsPerSlide(1); // Mobile view
      } else if (window.innerWidth < 768) {
        setItemsPerSlide(2); // Tablet view
      } else {
        setItemsPerSlide(3); // Desktop view
      }
    };

    updateItemsPerSlide(); // Initial check

    window.addEventListener("resize", updateItemsPerSlide);
    return () => {
      window.removeEventListener("resize", updateItemsPerSlide);
    };
  }, []);

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
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

    const fetchupcomingcamps = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list-by-params/listUpcomingCampsByDateParams`,
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

    const Loyaltyimages = async () => {
      try {
        const Loyaltyimages = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/loyaltyimage`
        );

        setLoyalty(Loyaltyimages.data);
      } catch (error) {
        console.log("cms data   :", error);
      }
    };
    Loyaltyimages();

    const campdetails = async () => {
      try {
        const campdetails = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list-by-params/listCompletedCampsByDateParams`,
          {
            skip: 0,
            per_page: 1000,
            sorton: "Date",
            sortdir: "desc",
            match: "",
            IsActive: true,
          }
        );

        setcamp(campdetails.data[0].data);
      } catch (error) {
        console.log("cms data   :", error);
      }
    };
    campdetails();
  }, []);

  useEffect(() => {
    const Homebannerimage = async () => {
      try {
        const Homebannerimage = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/banners`
        );

        const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

        const specilityisactive = Homebannerimage.data.filter((item) => {
          if (!item.IsActive) return false;
        
          if (item.hasStartEndDate) {
            return (
              item.startDate &&
              item.endDate &&
              today >= item.startDate &&
              today <= item.endDate
            );
          }
        
          return true; // Include item if IsActive is true and no date restriction
        });
        

        setBannerList(specilityisactive);
      } catch (error) {
        console.log("Doctor Speciality error  :", error);
      }
    };
    Homebannerimage();

    const campsection = async () => {
      try {
        const campsection = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/listNearestUpcomingCamp`
        );
        const campsectionactive = campsection.data.filter(
          (campsectionactive) => campsectionactive.IsActive
        );
        setcampList(campsectionactive);
        console.log("this is camp venue", campsection);
      } catch (error) {
        console.log("Doctor Speciality error  :", error);
      }
    };
    campsection();
  }, []);

  function handleLinkClick(item) {
    localStorage.setItem("selectedtellusmore", item);
  }

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipOpenPharmacy, setTooltipOpenPharmacy] = useState(false);
  const [tooltipOpenHos, setTooltipOpenHos] = useState(false);
  const [tooltipOpenLab, setTooltipOpenLab] = useState(false);
  const [tooltipOpenDoc, setTooltipOpenDoc] = useState(false);
  const [tooltipOpenPatient, setTooltipOpenPatient] = useState(false);

  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);
  function handleLinkClickmore(item) {
    localStorage.setItem("selectedNavItem", item);
  }
  localStorage.clear();

  const isSmallScreen = useMediaQuery({ query: "(max-width: 600px)" });
  const isMediumScreen = useMediaQuery({
    query: "(min-width: 600px) and (max-width: 768px)",
  });
  const isLargeScreen = useMediaQuery({ query: "(min-width: 768px)" });

  // Determine the number of items per slide
  // const itemsPerSlide = isSmallScreen ? 1 : isMediumScreen ? 2 : 3;
  // Number of items per slide
  const slideIndices = Array.from(
    { length: Math.ceil(camp.length / itemsPerSlide) },
    (_, index) => index
  );

  // Calculate the number of slides needed
  const numSlides = Math.ceil(Loyalty.length / itemsPerSlide);

  const slideIndicesloyalti = Array.from(
    { length: numSlides },
    (_, index) => index
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const userNameFromCookies = Cookies.get("PatientName");

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsOpen(true);
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
      {/* <div className="text-end stored-name">
        {userNameFromCookies ? (
          <span className="patient-name">Welcome {userNameFromCookies}</span>
        ) : null}
      </div> */}

      <Carousel
        prevIcon={
          <FaChevronCircleLeft
            className="custom-carousel-icon"
            style={{ fontSize: "40px", color: "#EB268F" }}
          />
        }
        nextIcon={
          <FaChevronCircleRight
            className="custom-carousel-icon"
            style={{ fontSize: "40px", color: "#EB268F" }}
          />
        }
      >
        {bannerList.map((banner) => (
          <Carousel.Item key={banner._id} className="banner-carousal">
            <a href={banner.Link ? `${banner.Link}` : "#"}>
              <img
                src={`${process.env.REACT_APP_API_URL_GRACELAB}/${banner.bannerImage}`}
                // alt={banner.Title}
                onError={(e) => {
                  e.target.src = placeholderbanner;
                }}
              />
            </a>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* carousal start */}

      {/* start service section */}

      <section className="services-area ptb-70 pb-5 bg-fff7f4">
        <Container>
          <Card className="section-title">
            <span>Network</span>
            <h2>Join Our Network</h2>

            <Link
              onClick={() => handleLinkClick("Join Our Network")}
              to="/tellusmore"
              className="btn btn-secondary"
            >
              Tell Us More
            </Link>
          </Card>
          <Row className="justify-content-center" id="homeindustry">
            <Col lg={2} md={6} sm={6}>
              <Link
                onClick={() => handleLinkClickmore("Laboratory")}
                to="/laboratory"
                id="lab-tooltip2"
              >
                <Card className="single-services-box text-center">
                  <Card.Body>
                    <div className="icon">
                      <Image src={icon1} alt="Service Icon" />
                    </div>
                    <Card.Title className="networktitle">Laboratory</Card.Title>
                    <Tooltip
                      isOpen={tooltipOpenLab}
                      toggle={() => setTooltipOpenLab(!tooltipOpenLab)}
                      target="lab-tooltip2"
                      placement="bottom"
                      className="bg-light"
                    >
                      Schedule your lab tests effortlessly and get them done
                      from the comfort of your home!
                    </Tooltip>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col lg={2} md={6} sm={6}>
              <Link
                id="phar-tooltip2"
                onClick={() => handleLinkClickmore("Pharmacy")}
                to="/pharmacy"
              >
                <Card className="single-services-box text-center">
                  <Card.Body>
                    <div className="icon">
                      <Image src={icon2} alt="Service Icon" />
                    </div>
                    <Card.Title className="networktitle">Pharmacy</Card.Title>
                    <Tooltip
                      isOpen={tooltipOpenPharmacy}
                      toggle={() =>
                        setTooltipOpenPharmacy(!tooltipOpenPharmacy)
                      }
                      target="phar-tooltip2"
                      placement="bottom"
                      className="bg-light"
                    >
                      Conveniently order your medicines online from our
                      pharmacy. Stay healthy and enjoy hassle-free service at
                      your fingertips!
                    </Tooltip>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col lg={2} md={6} sm={6}>
              <Link
                onClick={() => handleLinkClickmore("Doctors")}
                to="/doctor"
                id="doc-tooltip2"
              >
                <Card className="single-services-box text-center">
                  <Card.Body>
                    <div className="icon">
                      <Image src={icon3} alt="Service Icon" />
                    </div>
                    <Card.Title className="networktitle">Doctor</Card.Title>
                    <Tooltip
                      isOpen={tooltipOpenDoc}
                      toggle={() => setTooltipOpenDoc(!tooltipOpenDoc)}
                      target="doc-tooltip2"
                      placement="bottom"
                      className="bg-light"
                    >
                      Schedule your appointment with the doctor and consult via
                      video conferencing at your convenience.
                    </Tooltip>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col lg={2} md={6} sm={6}>
              <Link
                id="hos-tooltip2"
                onClick={() => handleLinkClickmore("Hospital")}
                to="/hospital"
              >
                <Card className="single-services-box text-center">
                  <Card.Body>
                    <div className="icon">
                      <Image src={icon4} alt="Service Icon" />
                    </div>
                    <Card.Title className="networktitle">Hospital</Card.Title>
                    <Tooltip
                      isOpen={tooltipOpenHos}
                      toggle={() => setTooltipOpenHos(!tooltipOpenHos)}
                      target="hos-tooltip2"
                      placement="bottom"
                      className="bg-light"
                    >
                      Avail benefits under Grace Reference and online services.
                      Please contact us via the provided numbers or email for
                      seamless coordination.
                    </Tooltip>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col lg={2} md={6} sm={6}>
              <Link
                onClick={() => handleLinkClickmore("Patients")}
                to="/patient-login"
                id="patient-tooltip2"
              >
                <Card className="single-services-box text-center">
                  <Card.Body>
                    <div className="icon">
                      <Image src={icon5} alt="Service Icon" />
                    </div>
                    <Card.Title className="networktitle">Member</Card.Title>
                    <Tooltip
                      isOpen={tooltipOpenPatient}
                      toggle={() => setTooltipOpenPatient(!tooltipOpenPatient)}
                      target="patient-tooltip2"
                      placement="bottom"
                      className="bg-light"
                    >
                      Grace members can avail all end to end solution from this
                      online integrated network health related platform.
                    </Tooltip>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col lg={2} md={6} sm={6}>
              <Link
                onClick={() => handleLinkClickmore("Affiliate")}
                to="/affiliate"
                id="affiliate-tooltip2"
              >
                <Card className="single-services-box text-center">
                  <Card.Body>
                    <div className="icon">
                      <Image src={icon6} alt="Service Icon" />
                    </div>
                    <Card.Title className="networktitle">Affiliate</Card.Title>
                    <Tooltip
                      isOpen={tooltipOpen}
                      toggle={toggleTooltip}
                      target="affiliate-tooltip2"
                      placement="bottom"
                      className="bg-light"
                    >
                      An affiliate refers to a third-party entity, such as a
                      hotel, mall, or restaurant, where grace members can redeem
                      their loyalty points.
                    </Tooltip>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          </Row>
          <Row className="d-flex justify-content-center" >
            <Col lg={4} md={6} sm={6}>
              <Link
                onClick={() => handleLinkClickmore("Services")}
                to="/home-service"
              // id="affiliate-tooltip2"
              >
                {/* <Card className="single-services-box text-center" style={{padding: "10px"}} >
                  <Card.Body>
                    <div className="icon" style={{ width: "80%" }} >
                      <Image src={icon7} alt="Service Icon" />
                    </div>
                    <Card.Title className="networktitle">Medical Services At Home</Card.Title>
                  </Card.Body>
                </Card> */}
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    fontSize: "20px",
                    backgroundColor: "#EB268F",
                    color: "white",
                    borderRadius: "10px",
                    boxShadow:
                      "rgba(0, 0, 0, 0.4) 0px 4px 6px, rgba(0, 0, 0, 0.3) 0px 6px 10px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                    cursor: "pointer",
                    transition: "transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(3px)";
                    e.currentTarget.style.boxShadow =
                      "rgba(0, 0, 0, 0.3) 0px 2px 4px, rgba(0, 0, 0, 0.2) 0px 4px 8px -3px, rgba(0, 0, 0, 0.2) 0px -2px 0px inset";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "rgba(0, 0, 0, 0.4) 0px 4px 6px, rgba(0, 0, 0, 0.3) 0px 6px 10px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset";
                  }}
                >
                  Medical Services At Home
                </div>


              </Link>
            </Col>
            <Col lg={4} md={6} sm={6}>
              <Link
                onClick={() => handleLinkClickmore("Equipment")}
                to="/home-equipment"
              // id="affiliate-tooltip2"
              >
                {/* <Card className="single-services-box text-center" style={{padding: "10px"}} >
                  <Card.Body>
                    <div className="icon" style={{ width: "80%" }} >
                      <Image src={icon7} alt="Service Icon" />
                    </div>
                    <Card.Title className="networktitle">Medical Services At Home</Card.Title>
                  </Card.Body>
                </Card> */}
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    fontSize: "20px",
                    backgroundColor: "#EB268F",
                    color: "white",
                    borderRadius: "10px",
                    boxShadow:
                      "rgba(0, 0, 0, 0.4) 0px 4px 6px, rgba(0, 0, 0, 0.3) 0px 6px 10px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                    cursor: "pointer",
                    transition: "transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(3px)";
                    e.currentTarget.style.boxShadow =
                      "rgba(0, 0, 0, 0.3) 0px 2px 4px, rgba(0, 0, 0, 0.2) 0px 4px 8px -3px, rgba(0, 0, 0, 0.2) 0px -2px 0px inset";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "rgba(0, 0, 0, 0.4) 0px 4px 6px, rgba(0, 0, 0, 0.3) 0px 6px 10px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset";
                  }}
                >
                  Medical Equipments On Rent
                </div>


              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* box area start */}

      <section className="boxes-area ptb-70 pb-5">
        <Container>
          <Card className="section-title">
            <span>CAMPS PROGRAM</span>
            <h2> Explore Our Camps</h2>

            <Link
              onClick={() => handleLinkClick("Explore Our Camps")}
              to="/tellusmore"
              className="btn btn-secondary tell-us-more-btn"
            >
              Tell Us More
            </Link>
          </Card>

          {/* {campList.map((upcoming, index) => (
            <Row key={index}>
              <div className="row align-items-center sec-row mb-5">
                <div className="col-lg-4 col-md-12 ps-0">
                  <div className="team-details-sidebar">
                    <div className="team-profile w-100">
                      <img
                        className="height-100 br-img"
                        src={`${process.env.REACT_APP_API_URL_GRACELAB}/${upcoming.Photo}`}
                        alt={upcoming.Title}
                        onClick={() =>
                          handleImageClick(
                            `${process.env.REACT_APP_API_URL_GRACELAB}/${upcoming.Photo}`
                          )
                        }
                        style={{ cursor: "pointer" }}
                        onError={(e) => {
                          e.target.src = placeholderimage;
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-8 col-md-12">
                  <div className="team-details-desc top m-0">
                    <h3 style={{ fontWeight: 500, lineBreak: "auto" }}>
                      {upcoming.CampVenueDetails?.Society || ""}
                    </h3>

                    <p>
                      <strong style={{ color: "#eb268f" }}>Date</strong>
                      {` : ${upcoming.Date
                        ? new Date(upcoming.Date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                        : ""
                        }`}
                    </p>

                    <ul
                      className="about-features-list"
                      style={{ padding: 0, margin: 0 }}
                    >
                      {upcoming.DoctorsDetails &&
                        upcoming.DoctorsDetails.map((doctor, index) => (
                          <li className="p-0" key={index}>
                            <div className="d-flex align-items-center">
                              <FaUser
                                style={{ color: "#eb268f", marginRight: "5px" }}
                              />
                              {doctor.DoctorName}
                            </div>
                          </li>
                        ))}
                    </ul>

                    <p>
                      <strong style={{ color: "#eb268f" }}>Details : </strong>
                      {upcoming.Descreption || ""}
                    </p>

                    <div className="text-end mt-2">
                      <Link
                        to="/patient-inquiry"
                        className="btn btn-primary btn-login"
                      >
                        Register
                      </Link>
                      <Link
                        to="/camping" // Assuming you have a dynamic route for camp details
                        className="btn btn-primary btn-login ms-2"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Row>
          ))} */}
          <div className="row">
            {upcomingcamps.length === 0 ? (
              // Message when no upcoming camping data is available
              <div className="col-12 text-center">
                <h5>No upcoming camping available here.</h5>
              </div>
            ) : isMobile ? (
              // Carousel for mobile screens
              <Carousel>
                {upcomingcamps.slice(0, 3).map((camping) => (
                  <Carousel.Item key={camping.id}>
                    <Link to="/patient-inquiry">
                      <Card className="camping-card">
                        <Card.Img
                          className=""
                          variant="top"
                          src={`${process.env.REACT_APP_API_URL_GRACELAB}/${camping.Photo}`}
                          alt={camping.title}
                          onError={(e) => {
                            e.target.src = placeholderimage;
                          }}
                          style={{
                            objectFit: "cover",
                            height: "100%",
                          }}
                        />
                        {/* <Card.Body className="card-body-camping card-body">
                          <Card.Title className="mb-3">
                            {camping.title}
                          </Card.Title>
                          <p>
                                    <strong
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "600",
                                      }}
                                    >
                                      Camp Venue:
                                    </strong>{" "}
                                    <span className="camp-venue">
                                      {camping.CampVenueDetails?.Society ||
                                        "N/A"}
                                    </span>
                                  </p>
                          <div className="date-flex">
                            <p>
                                      <strong>Date:</strong>
                                      {camping.Date
                                        ? new Date(
                                          camping.Date
                                        ).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                        })
                                        : "N/A"}
                                    </p>
                            <p>
                                      <strong>
                                        No Of Patients:{" "}
                                        {camping.NoOfPatients || "N/A"}
                                      </strong>{" "}
                                    </p>
                          </div>
                          <Card.Text style={{ marginBottom: "1rem" }}>
                                    <strong>Description:</strong>{" "}
                                    {camping.Descreption}
                                  </Card.Text>
                          <div className="text-end mt-2">
                            <Link
                              to="/patient-inquiry"
                              className="btn btn-primary btn-login"
                            >
                              Register
                            </Link>
                            <Link
                        to="/camping" // Assuming you have a dynamic route for camp details
                        className="btn btn-primary btn-login ms-2"
                      >
                        Details
                      </Link>
                          </div>
                        </Card.Body> */}
                      </Card>
                    </Link>
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              // Grid layout for desktop screens
              upcomingcamps.slice(0, 3).map((camping) => (
                <Col key={camping.id} lg={4} className="mb-4">
                  <Link to="/patient-inquiry">
                    <Card className="camping-card" style={{ position: "relative", overflow: "hidden" }}>
                      <div className="image-container">
                        <Card.Img
                          // className="card-image-camping"
                          variant="top"
                          src={`${process.env.REACT_APP_API_URL_GRACELAB}/${camping.Photo}`}
                          alt={camping.title}
                          onError={(e) => {
                            e.target.src = placeholderimage;
                          }}
                          style={{ objectFit: "cover", height: "100%" }}
                        />
                        <div className="hover-text">Please click to register</div>
                      </div>

                      {/* <Card.Body className="">
                        <div className="text-center mt-2">
                          <Link
                            to="/patient-inquiry"
                            className="btn btn-lg btn-primary btn-login"
                          >
                            Register
                          </Link>
                        </div>
                      </Card.Body> */}
                    </Card>
                  </Link>
                </Col>
              ))
            )}
          </div>

          {isOpen && (
            <Lightbox
              mainSrc={selectedImage}
              onCloseRequest={() => setIsOpen(false)}
            />
          )}
          <section className="services-area-home products-details-tab pb-100">
            <div className="container">
              <Tabs
                defaultActiveKey="completed"
                id="camping-tabs"
                className="tabs d-flex justify-content-center mb-5 dot"
              >
                <Tab
                  eventKey="completed"
                  title="Completed Camping"
                  className="box-before"
                >
                  <div className="row">
                    {camp.length === 0 ? (
                      // Message when no completed camping data is available
                      <div className="col-12 text-center">
                        <h5>No completed camping available here.</h5>
                      </div>
                    ) : isMobile ? (
                      // Carousel for mobile screens
                      <Carousel>
                        {camp.slice(0, 3).map((camping) => (
                          <Carousel.Item key={camping.id}>
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
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "600",
                                      }}
                                    >
                                      Camp Venue:
                                    </strong>{" "}
                                    <span className="camp-venue">
                                      {camping.CampVenueDetails?.Society ||
                                        "N/A"}
                                    </span>
                                  </p>
                                  <div className="date-flex">
                                    <p>
                                      <strong>Date:</strong>
                                      {camping.Date
                                        ? new Date(
                                          camping.Date
                                        ).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                        })
                                        : "N/A"}
                                    </p>

                                    <p>
                                      <strong>
                                        No Of Patients:{" "}
                                        {camping.NoOfPatients || "N/A"}
                                      </strong>{" "}
                                    </p>
                                  </div>
                                  <Card.Text style={{ marginBottom: "1rem" }}>
                                    <strong>Description:</strong>{" "}
                                    {camping.Descreption}
                                  </Card.Text>
                                </Card.Body>
                              </Card>
                            </Link>
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    ) : (
                      // Grid layout for desktop screens
                      camp.slice(0, 3).map((camping) => (
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
                                    style={{
                                      fontSize: "1rem",
                                      fontWeight: "600",
                                    }}
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
                                      ? new Date(
                                        camping.Date
                                      ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })
                                      : "N/A"}
                                  </p>
                                  <p>
                                    <strong>
                                      No Of Patients:{" "}
                                      {camping.NoOfPatients || "N/A"}
                                    </strong>{" "}
                                  </p>
                                </div>
                                <Card.Text style={{ marginBottom: "1rem" }}>
                                  <strong>Description:</strong>{" "}
                                  {camping.Descreption}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Link>
                        </Col>
                      ))
                    )}
                  </div>
                </Tab>
                <Tab
                  eventKey="upcoming"
                  title="Upcoming Camping"
                  className="box-before"
                >
                  <div className="row">
                    {upcomingcamps.length === 0 ? (
                      // Message when no upcoming camping data is available
                      <div className="col-12 text-center">
                        <h5>No upcoming camping available here.</h5>
                      </div>
                    ) : isMobile ? (
                      // Carousel for mobile screens
                      <Carousel>
                        {upcomingcamps.slice(0, 3).map((camping) => (
                          <Carousel.Item key={camping.id}>
                            <Link to="/camping">
                              <Card className="camping-card">
                                <Card.Img
                                  className="card-image-camping"
                                  variant="top"
                                  src={`${process.env.REACT_APP_API_URL_GRACELAB}/${camping.Photo}`}
                                  alt={camping.title}
                                  onError={(e) => {
                                    e.target.src = placeholderimage;
                                  }}
                                  style={{
                                    objectFit: "cover",
                                    height: "200px",
                                  }}
                                />
                                <Card.Body className="card-body-camping card-body">
                                  <Card.Title className="mb-3">
                                    {camping.title}
                                  </Card.Title>
                                  <p>
                                    <strong
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "600",
                                      }}
                                    >
                                      Camp Venue:
                                    </strong>{" "}
                                    <span className="camp-venue">
                                      {camping.CampVenueDetails?.Society ||
                                        "N/A"}
                                    </span>
                                  </p>
                                  <div className="date-flex">
                                    <p>
                                      <strong>Date:</strong>
                                      {camping.Date
                                        ? new Date(
                                          camping.Date
                                        ).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                        })
                                        : "N/A"}
                                    </p>
                                    <p>
                                      <strong>
                                        No Of Patients:{" "}
                                        {camping.NoOfPatients || "N/A"}
                                      </strong>{" "}
                                    </p>
                                  </div>
                                  <Card.Text style={{ marginBottom: "1rem" }}>
                                    <strong>Description:</strong>{" "}
                                    {camping.Descreption}
                                  </Card.Text>
                                </Card.Body>
                              </Card>
                            </Link>
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    ) : (
                      // Grid layout for desktop screens
                      upcomingcamps.slice(0, 3).map((camping) => (
                        <Col key={camping.id} lg={4} className="mb-4">
                          <Link to="/camping">
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
                                    style={{
                                      fontSize: "1rem",
                                      fontWeight: "600",
                                    }}
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
                                      ? new Date(
                                        camping.Date
                                      ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })
                                      : "N/A"}
                                  </p>
                                  <p>
                                    <strong>
                                      No Of Patients:{" "}
                                      {camping.NoOfPatients || "N/A"}
                                    </strong>{" "}
                                  </p>
                                </div>
                                <Card.Text style={{ marginBottom: "1rem" }}>
                                  <strong>Description:</strong>{" "}
                                  {camping.Descreption}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Link>
                        </Col>
                      ))
                    )}
                  </div>
                </Tab>
              </Tabs>
            </div>
          </section>
        </Container>
      </section>

      {/* about section start */}

      {/* loyalty program */}

      <section className="boxes-area ptb-70 pb-5 bg-fff7f4">
        <Container>
          <Card className="section-title">
            <span>Loyalty PROGRAM</span>
            <h2> Join Our Loyalty Program</h2>

            <Link
              onClick={() => handleLinkClick("Join Our Loyalty Program")}
              to="/tellusmore"
              className="btn btn-secondary"
            >
              Tell Us More
            </Link>
          </Card>
          <Row>
            {/* {Loyalty.map((image, index) => (
        <Col key={index} lg={4} md={6} sm={6}>
          <div className="single-box p-0">
            <img src={`${process.env.REACT_APP_API_URL_GRACELAB}/${image.bannerImage}`} alt={image.placeholderimage ? image.title : 'Placeholder Image'}/>
          </div>
        </Col>
      ))} */}
            <Carousel
              className="mt-4"
              controls={Loyalty.length > itemsPerSlide}
            >
              {slideIndicesloyalti.map((slideIndex) => (
                <Carousel.Item key={slideIndex}>
                  <Row>
                    {Loyalty.slice(
                      slideIndex * itemsPerSlide,
                      (slideIndex + 1) * itemsPerSlide
                    ).map((image, index) => (
                      <Col
                        key={index}
                        lg={12 / itemsPerSlide}
                        md={12 / itemsPerSlide}
                        sm={12 / itemsPerSlide}
                      >
                        <div className="single-box p-0 loylti-program">
                          <img
                            className="d-block w-100"
                            src={`${process.env.REACT_APP_API_URL_GRACELAB}/${image.bannerImage}`}
                            alt={
                              image.title ? image.title : "Placeholder Image"
                            }
                            onError={(e) => {
                              e.target.src = placeholderimage; // Ensure placeholderimage is defined
                            }}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Carousel.Item>
              ))}
            </Carousel>
          </Row>
        </Container>
      </section>

      <section className="about-area ptb-50">
        <Container>
          <Row className="align-items-center">
            <div className="col-lg-12 col-md-12">
              <div className="about-content">
                {/* <h2>{bout.blogTitle || "Welcome to Grace Labs"}</h2> */}

                {/* Ensure blogDesc exists before trying to render */}
                {bout.blogDesc ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: removeStrongTags(formatContent(bout.blogDesc)),
                    }}
                  />
                ) : (
                  <p>Loading content...</p>
                )}
              </div>
            </div>
            <div className="col-lg-7 col-12 offset-lg-5">
              <div className="row">
                <div className="col-lg-6 col-12">
                  <ul className="about-features-list">
                    <li>
                      <IoCheckmarkDoneSharp style={{ color: "#ffb923" }} />{" "}
                      Streamlined Operations
                    </li>
                    <li>
                      <IoCheckmarkDoneSharp style={{ color: "#ffb923" }} />{" "}
                      Member Loyalty Rewards
                    </li>
                  </ul>
                </div>
                <div className="col-lg-6 col-12">
                  <ul className="about-features-list">
                    <li>
                      <IoCheckmarkDoneSharp style={{ color: "#ffb923" }} />{" "}
                      Multi-Facility Redemption
                    </li>
                    <li>
                      <IoCheckmarkDoneSharp style={{ color: "#ffb923" }} />{" "}
                      Enhanced Member Satisfaction
                    </li>
                  </ul>
                </div>
              </div>

              <div className="btn-box text-end mb-3">
                <Link
                  to="/cms/667e52387a043e58372e16ce"
                  className="btn btn-primary btn-login"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Home;
