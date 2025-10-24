import { useEffect, useState } from "react";
import { Card, Col, Image, Modal, Row } from "react-bootstrap";
import { FaAngleDown } from "react-icons/fa";
import { Link, useLocation, useParams } from "react-router-dom";
import { Tooltip } from "reactstrap";

import Container from "react-bootstrap/Container";
import icon1 from "../img/icon1.png";
import icon2 from "../img/icon2.png";
import icon3 from "../img/icon3.png";
import icon4 from "../img/icon4.png";
import icon5 from "../img/icon5.png";
import icon6 from "../img/icon6.png";
import logo from "../img/logo.jpg";

import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import Account from "./Account";
import Addtocart from "./Addtocart";

import { useCustomerId } from "../Components/MyContext";

function Modalnavigationbar(props) {
  const { id } = useParams();
  const [isSticky, setIsSticky] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setOpen] = useState(false); // State for hamburger menu
  // const expand = false;

  const [expand, setExpand] = useState(false);

  const [titles, setTitles] = useState([]);
  const [addproduct, setaddproduct] = useState([]);
  // const customerId = Cookies.get("CustomerId");
  // console.log("show title ", titles);
  const { customerId, FetchCustomer } = useCustomerId();

  useEffect(() => {
    FetchCustomer();
  }, []);

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipOpenPharmacy, setTooltipOpenPharmacy] = useState(false);
  const [tooltipOpenHos, setTooltipOpenHos] = useState(false);
  const [tooltipOpenLab, setTooltipOpenLab] = useState(false);
  const [tooltipOpenDoc, setTooltipOpenDoc] = useState(false);
  const [tooltipOpenPatient, setTooltipOpenPatient] = useState(false);

  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

  // Function to fetch titles from the API
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

  const fetchshowproduct = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/customer/getcart/${customerId}`
      );
      setaddproduct(response.data); // Assuming the response is an array of objects with id and title
      console.log("get to product add to cart", response.data);
    } catch (error) {
      console.error("Error fetching titles:", error);
    }
  };

  useEffect(() => {
    fetchTitles(); // Fetch titles on component mount
    fetchshowproduct();
  }, [id]);

  const [toggleWidth, setToggleWidth] = useState("100px");

  const handleToggleWidth = () => {
    if (toggleWidth === "100px") {
      setToggleWidth("50px");
    } else {
      setToggleWidth("100px");
    }
  };

  const handleLinkClick1 = (label) => {
    console.log(`${label} link clicked`);
  };

  const handleShow = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const getLinkClass = (path) => {
    return activeLink === path ? "mobile-link active-link" : "mobile-link";
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function handleLinkClick(item) {
    localStorage.setItem("selectedNavItem", item);
  }

  function handleLinkClicktellusmore(item) {
    localStorage.setItem("selectedtellusmore", item);
  }
  return (
    <>
      <div className={`navbar-area ${isSticky ? "is-sticky" : ""}`}>
        <div className="labto-mobile-nav">
          <div className="logo justify-content-between d-flex align-items-center">
            <Link to="/home" className="logoimage">
              <img src={logo} alt="logo" />
            </Link>
            <div className="d-flex">
              <div className="mt-2">
                {" "}
                <Addtocart />
              </div>
              <div className="mt-2"> {customerId ? <Account /> : null}</div>
            </div>
          </div>
          {/* Hamburger menu */}
          {/* <Hamburger toggled={isOpen} toggle={setOpen}
          
          /> */}

          {/* this is responsive sidebar */}
          <Navbar key={expand} expand={expand ? "sm" : ""}>
            <Container fluid>
              {/* Conditional rendering based on toggleWidth */}
              {toggleWidth === "50px" ? (
                <Navbar.Toggle
                  aria-controls={`offcanvasNavbar-expand-${expand}`}
                  onClick={handleToggleWidth}
                  style={{ width: "50px", left: "auto", right: "15px" }} // Position to right side
                />
              ) : (
                <Navbar.Toggle
                  aria-controls={`offcanvasNavbar-expand-${expand}`}
                />
              )}
              <Navbar.Offcanvas
                id={`offcanvasNavbar-expand-lg`}
                aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
                placement="end"
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title
                    id={`offcanvasNavbarLabel-expand-lg`}
                  ></Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body>
                  <Nav className="justify-content-end flex-grow-1 pe-3">
                    <Link
                      to="/"
                      className={getLinkClass("/")}
                      onClick={() => setActiveLink("/")}
                    >
                      Home
                    </Link>
                    <NavDropdown
                      className={getLinkClass("/network")}
                      title="About"
                      id={`offcanvasNavbarDropdown-expand-lg`}
                    >
                      <Link
                        to="/cms/667e52387a043e58372e16ce"
                        className={getLinkClass(
                          "/cms/667e52387a043e58372e16ce"
                        )}
                      >
                        About Grace Medical Services
                      </Link>
                      <Link
                        to="/Directors"
                        className={getLinkClass("/Directors")}
                      >
                        Directors
                      </Link>
                      <Link
                        to="/Testimonial"
                        className={getLinkClass("/Testimonial")}
                      >
                        Testimonial
                      </Link>
                      <Link to="/awards" className={getLinkClass("/awards")}>
                        Awards and certificate
                      </Link>
                      <Link to="/news" className={getLinkClass("/news")}>
                        News and media
                      </Link>
                      <Link
                        to="/knowledge"
                        className={getLinkClass("/knowledge")}
                      >
                        Knowledge Base
                      </Link>
                    </NavDropdown>

                    <NavDropdown
                      className={getLinkClass(" #")}
                      title="Opportunities"
                      id={`offcanvasNavbarDropdown-expand-lg`}
                    >
                      <li className="nav-item">
                        {titles.map((item) => (
                          <li key={item._id}>
                            <Link
                              to={`/join-handwith-us/${item._id}`}
                              onClick={() =>
                                setActiveLink(`/join-handwith-us/${item._id}`)
                              }
                              className={`nav-link ${getLinkClass(
                                `/join-handwith-us/${item.id}`
                              )}`}
                            >
                              {item.Tittle}
                            </Link>
                          </li>
                        ))}
                      </li>
                    </NavDropdown>
                    <Link
                      to="/camping"
                      className={getLinkClass("/camping")}
                      onClick={() => setActiveLink("/camping")}
                    >
                      Campaign
                    </Link>
                    <NavDropdown
                      className={getLinkClass("/network")}
                      title="Network"
                      id={`offcanvasNavbarDropdown-expand-lg`}
                    >
                      <Link
                        to="/laboratory"
                        onClick={() => {
                          handleLinkClick("laboratory");
                          setActiveLink("/laboratory");
                        }}
                        className={getLinkClass("/laboratory")}
                      >
                        laboratory
                      </Link>

                      <Link
                        to="/pharmacy"
                        onClick={() => {
                          handleLinkClick("Pharmacy");
                          setActiveLink("/pharmacy");
                        }}
                        className={getLinkClass("/pharmacy")}
                      >
                        Pharmacy
                      </Link>

                      <Link
                        to="/doctor"
                        onClick={() => {
                          handleLinkClick("Doctors");
                          setActiveLink("/doctor");
                        }}
                        className={getLinkClass("/doctor")}
                      >
                        Doctors
                      </Link>

                      <Link
                        to="/hospital"
                        onClick={() => {
                          handleLinkClick("Hospital");
                          setActiveLink("/hospital");
                        }}
                        className={getLinkClass("/hospital")}
                      >
                        Hospital
                      </Link>
                      <Link
                        to="/home-service"
                        onClick={() => {
                          handleLinkClick("HomeService");
                          setActiveLink("/home-service");
                        }}
                        className={getLinkClass("/home-service")}
                      >
                        Medical Services at Home
                      </Link>
                      <Link
                        to="/home-equipment"
                        onClick={() => {
                          handleLinkClick("HomeEquipment");
                          setActiveLink("/home-equipment");
                        }}
                        className={getLinkClass("/home-equipment")}
                      >
                        Medical Equipments On Rent
                      </Link>

                      <Link
                        to="/patient-login"
                        onClick={() => {
                          handleLinkClick("Patients");
                          setActiveLink("/patient-login");
                        }}
                        className={getLinkClass("/patient-login")}
                      >
                        Members
                      </Link>
                      <Link
                        to="/affiliate"
                        onClick={() => {
                          handleLinkClick("Affiliate");
                          setActiveLink("/affiliate");
                        }}
                        className={getLinkClass("/affiliate")}
                      >
                        Affiliate
                      </Link>
                      <Link
                        to="/associates-list"
                        onClick={() => {
                          handleLinkClick("Associates");
                          setActiveLink("/associates");
                        }}
                        className={getLinkClass("/associates")}
                      >
                        Associates
                      </Link>
                      {/* <Tooltip
                        isOpen={tooltipOpen}
                        toggle={toggleTooltip}
                        target="affiliate-tooltip"
                        placement="bottom"
                      >
                        This is the description for the Affiliate link.
                      </Tooltip> */}
                      {/* <Link
                        to="/medical-services/service-provider-login"
                        onClick={() => {
                          handleLinkClick("ServiceProviderLogin");
                          setActiveLink("/medical-services/service-provider-login");
                        }}
                        className={getLinkClass("/medical-services/service-provider-login")}
                      >
                       Service Provider
                      </Link> */}
                    </NavDropdown>

                    <Link
                      to="/blog"
                      onClick={() => setActiveLink("/blog")}
                      className={getLinkClass("/blog")}
                    >
                      Blog
                    </Link>

                    <Link
                      to="/product-list"
                      onClick={() => setActiveLink("/product-list")}
                      className={getLinkClass("/product-list")}
                    >
                      Products
                    </Link>

                    <Link
                      to="/service"
                      onClick={() => setActiveLink("/service")}
                      className={getLinkClass("/service")}
                    >
                      Services
                    </Link>

                    {/* <NavDropdown
                      className={getLinkClass("/network")}
                      title="Package"
                      id={`offcanvasNavbarDropdown-expand-lg`}
                    >
                      <Link
                        to="/pregnancy-blood-test"
                        className={getLinkClass("/pregnancy-blood-test")}
                      >
                        Pregnancy Blood Test
                      </Link>
                      <Link
                        to="/blood-test-kids"
                        className={getLinkClass("/blood-test-kids")}
                      >
                        Blood Test For Kids
                      </Link>
                      <Link
                        to="/full-body-checkup"
                        className={getLinkClass("/full-body-checkup")}
                      >
                        Full Body Checkup
                      </Link>
                      <Link
                        to="/senior-citizen-male"
                        className={getLinkClass("/senior-citizen-male")}
                      >
                        Health checkup for senior citizen (male)
                      </Link>
                      <Link
                        to="/senior-citizen-female"
                        className={getLinkClass("/senior-citizen-female")}
                      >
                        Health checkup for senior citizen (Female)
                      </Link>
                      <Link
                        to="/swine-flue"
                        className={getLinkClass("/swine-flue")}
                      >
                        Swine Flue Test In vadodara
                      </Link>
                      <Link
                        to="/serology-blood-test"
                        className={getLinkClass("/serology-blood-test")}
                      >
                        Serology Blood Test
                      </Link>
                      <Link
                        to="/PCOD-pofile-blood-test"
                        className={getLinkClass("/ige-test")}
                      >
                        PCOD Profile Blood Test
                      </Link>
                      <Link
                        to="/ige-test"
                        className={getLinkClass("/ige-test")}
                      >
                        Blood Ige Test in vadodara
                      </Link>
                    </NavDropdown> */}

                    <NavDropdown
                      className={getLinkClass("/network")}
                      title="Contact"
                      id={`offcanvasNavbarDropdown-expand-lg`}
                    >
                      <Link to="/contact" className={getLinkClass("/contact")}>
                        Contact Us
                      </Link>
                      <Link
                        to="/Feedback"
                        className={getLinkClass("/Feedback")}
                      >
                        Feedback
                      </Link>
                      <Link
                        to="/cms/66878d3413d429f45685f7e7"
                        className={getLinkClass(
                          "/cms/66878d3413d429f45685f7e7"
                        )}
                      >
                        Terms and condition
                      </Link>
                      <Link
                        to="/cms/66878d5913d429f45685f7ea"
                        className={getLinkClass(
                          "/cms/66878d5913d429f45685f7ea"
                        )}
                      >
                        Refund Policy
                      </Link>
                      <Link
                        to="/cms/66b5dfea9f6f866057e3073b"
                        className={getLinkClass(
                          "/cms/66b5dfea9f6f866057e3073b"
                        )}
                      >
                        Privacy Policy
                      </Link>
                    </NavDropdown>
                    <br />
                    <Link
                      to={props.navigatelink}
                      className="btn btn-secondary ms-3 btn-login"
                      onClick={(e) =>
                        e.currentTarget.getAttribute("href") === "/" ||
                        e.currentTarget.getAttribute("href") ===
                          "/Registration" ||
                        e.currentTarget.getAttribute("href") === "/Directors"
                          ? handleShow()
                          : handleClose()
                      }
                    >
                      Login / Sign Up
                    </Link>

                    <Modal
                      show={showModal}
                      onHide={handleClose}
                      centered
                      size="lg"
                    >
                      <Modal.Header closeButton>
                        <Modal.Title className="fw-bold mobile-link">
                          Login to our Network
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Row className="justify-content-center" id="industry">
                          <Col lg={3} md={4} sm={6}>
                            <Link
                              to="/laboratory-login"
                              onClick={() => handleLinkClick("Laboratory")}
                            >
                              <Card className="single-services-box-modalpopup text-center">
                                <Card.Body>
                                  <div className="icon">
                                    <Image src={icon1} alt="Service Icon" />
                                  </div>
                                  <Card.Title className="networktitle">
                                    Laboratory
                                  </Card.Title>
                                </Card.Body>
                              </Card>
                            </Link>
                          </Col>
                          <Col lg={3} md={4} sm={6}>
                            <Link
                              to="/pharmacy-signup"
                              onClick={() => handleLinkClick("Pharmacy")}
                            >
                              <Card className="single-services-box-modalpopup text-center">
                                <Card.Body>
                                  <div className="icon">
                                    <Image src={icon2} alt="Service Icon" />
                                  </div>
                                  <Card.Title className="networktitle">
                                    Pharmacy
                                  </Card.Title>
                                </Card.Body>
                              </Card>
                            </Link>
                          </Col>
                          <Col lg={3} md={4} sm={6}>
                            <Link
                              to="/doctor-signup"
                              onClick={() => handleLinkClick("Doctors")}
                            >
                              <Card className="single-services-box-modalpopup text-center">
                                <Card.Body>
                                  <div className="icon">
                                    <Image src={icon3} alt="Service Icon" />
                                  </div>
                                  <Card.Title className="networktitle">
                                    Doctors
                                  </Card.Title>
                                </Card.Body>
                              </Card>
                            </Link>
                          </Col>
                          <Col lg={3} md={4} sm={6}>
                            <Link
                              to="/hospital-signup"
                              onClick={() => handleLinkClick("Hospital")}
                            >
                              <Card className="single-services-box-modalpopup text-center">
                                <Card.Body>
                                  <div className="icon">
                                    <Image src={icon4} alt="Service Icon" />
                                  </div>
                                  <Card.Title className="networktitle">
                                    Hospital
                                  </Card.Title>
                                </Card.Body>
                              </Card>
                            </Link>
                          </Col>
                          <Col lg={3} md={4} sm={6}>
                            <Link
                              to="/patient-login"
                              onClick={() => handleLinkClick("Patients")}
                            >
                              <Card className="single-services-box-modalpopup text-center">
                                <Card.Body>
                                  <div className="icon">
                                    <Image src={icon5} alt="Service Icon" />
                                  </div>
                                  <Card.Title className="networktitle">
                                    Member
                                  </Card.Title>
                                </Card.Body>
                              </Card>
                            </Link>
                          </Col>
                          <Col lg={3} md={4} sm={6}>
                            <Link
                              to="/affiliate-signup"
                              onClick={() => handleLinkClick("Affiliate")}
                            >
                              <Card className="single-services-box-modalpopup text-center">
                                <Card.Body>
                                  <div className="icon">
                                    <Image src={icon6} alt="Service Icon" />
                                  </div>
                                  <Card.Title className="networktitle">
                                    Affiliate
                                  </Card.Title>
                                </Card.Body>
                              </Card>
                            </Link>
                            {/* <Tooltip
                              isOpen={tooltipOpen}
                              toggle={toggleTooltip}
                              target="affiliate-tooltip"
                              placement="bottom"
                            >
                              This is the description for the Affiliate link.
                            </Tooltip> */}
                          </Col>
                        </Row>
                      </Modal.Body>
                    </Modal>
                  </Nav>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          </Navbar>
        </div>

        {/* this is main screen sidebar */}
        <div className={`main-headr labto-nav ${isOpen ? "active" : ""}`}>
          <div className="container">
            <nav className="navbar navbar-expand-md navbar-light">
              <Link className="navbar-brand logoimage" to="/">
                <img src={logo} alt="logo" />
              </Link>
              <div
                className="collapse navbar-collapse mean-menu"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav align-items-center">
                  <li className="nav-item">
                    <Link to="/" className="nav-link">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="#" className="nav-link">
                      About Us <FaAngleDown />
                    </Link>
                    <ul className="dropdown-menu">
                      <li className="nav-item">
                        <Link
                          to="/cms/667e52387a043e58372e16ce"
                          className="nav-link"
                        >
                          About Grace Medical Services
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/Directors" className="nav-link">
                          Directors
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/Testimonial" className="nav-link">
                          Testimonial
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/awards" className="nav-link">
                          Awards & Certificate
                        </Link>
                      </li>
                      {/* <li className="nav-item">
                        <Link to="/news" className="nav-link">
                          News & Media
                        </Link>
                      </li> */}
                      <li className="nav-item">
                        <Link to="/knowledge" className="nav-link">
                          Knowledge Base
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li className="nav-item">
                    <Link to="/camping" className="nav-link">
                      Campaign
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link to="#" className="nav-link">
                      Network <FaAngleDown />
                    </Link>
                    <ul className="dropdown-menu">
                      <li className="nav-item">
                        <Link
                          to="/laboratory"
                          className="nav-link"
                          id="lab-tooltip"
                          onClick={() => handleLinkClick("Laboratory")}
                        >
                          Laboratory
                        </Link>
                        <Tooltip
                          isOpen={tooltipOpenLab}
                          toggle={() => setTooltipOpenLab(!tooltipOpenLab)}
                          target="lab-tooltip"
                          placement="bottom"
                          className="bg-light"
                        >
                          Schedule your lab tests effortlessly and get them done
                          from the comfort of your home!
                        </Tooltip>
                      </li>

                      <li className="nav-item">
                        <Link
                          to="/pharmacy"
                          className="nav-link"
                          id="phar-tooltip"
                          onClick={() => handleLinkClick("Pharmacy")}
                        >
                          Pharmacy
                        </Link>
                        <Tooltip
                          isOpen={tooltipOpenPharmacy}
                          toggle={() =>
                            setTooltipOpenPharmacy(!tooltipOpenPharmacy)
                          }
                          target="phar-tooltip"
                          placement="bottom"
                          className="bg-light"
                        >
                          Conveniently order your medicines online from our
                          pharmacy. Stay healthy and enjoy hassle-free service
                          at your fingertips!
                        </Tooltip>
                      </li>
                      <li className="nav-item">
                        <Link
                          to="/doctor"
                          className="nav-link"
                          id="doc-tooltip"
                          onClick={() => handleLinkClick("Doctors")}
                        >
                          Doctors
                        </Link>
                        <Tooltip
                          isOpen={tooltipOpenDoc}
                          toggle={() => setTooltipOpenDoc(!tooltipOpenDoc)}
                          target="doc-tooltip"
                          placement="bottom"
                          className="bg-light"
                        >
                          Schedule your appointment with the doctor and consult
                          via video conferencing at your convenience.
                        </Tooltip>
                      </li>

                      <li className="nav-item">
                        <Link
                          to="/hospital"
                          className="nav-link"
                          id="hos-tooltip"
                          onClick={() => handleLinkClick("Hospital")}
                        >
                          Hospital
                        </Link>
                        <Tooltip
                          isOpen={tooltipOpenHos}
                          toggle={() => setTooltipOpenHos(!tooltipOpenHos)}
                          target="hos-tooltip"
                          placement="bottom"
                          className="bg-light"
                        >
                          Avail benefits under Grace Reference and online
                          services. Please contact us via the provided numbers
                          or email for seamless coordination.
                        </Tooltip>
                      </li>
                      <li className="nav-item">
                        <Link
                          className="nav-link"
                          to="/home-service"
                          onClick={() => {
                            handleLinkClick("HomeService");
                            setActiveLink("/home-service");
                          }}
                        >
                          Medical Services at Home
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          to="/home-equipment"
                          className="nav-link"
                          id="equipment-tooltip"
                          onClick={() => {
                            handleLinkClick("HomeEquipment");
                            setActiveLink("/home-equipment");
                          }}
                        >
                          Medical Equipments On Rent
                        </Link>
                      </li>

                      <li className="nav-item">
                        <Link
                          to="/patient-login"
                          className="nav-link"
                          id="patient-tooltip"
                          onClick={() => handleLinkClick("Patients")}
                        >
                          Member
                        </Link>
                        <Tooltip
                          isOpen={tooltipOpenPatient}
                          toggle={() =>
                            setTooltipOpenPatient(!tooltipOpenPatient)
                          }
                          target="patient-tooltip"
                          placement="bottom"
                          className="bg-light"
                        >
                          Grace members can avail all end to end solution from
                          this online integrated network health related
                          platform.
                        </Tooltip>
                      </li>
                      {/* <li className="nav-item">
                        <Link
                          to="/affiliate"
                          className="nav-link"
                          onClick={() => handleLinkClick("Affiliate")}
                        >
                          Affiliate
                        </Link>
                      </li> */}
                      <li className="nav-item">
                        <Link
                          to="/affiliate"
                          className="nav-link"
                          id="affiliate-tooltip"
                          onClick={() => handleLinkClick("Affiliate")}
                        >
                          Affiliate
                        </Link>
                        <Tooltip
                          isOpen={tooltipOpen}
                          toggle={toggleTooltip}
                          target="affiliate-tooltip"
                          placement="bottom"
                          className="bg-light"
                        >
                          An affiliate refers to a third-party entity, such as a
                          hotel, mall, or restaurant, where grace members can
                          redeem their loyalty points.
                        </Tooltip>
                      </li>
                      <li className="nav-item">
                        <Link
                          to="/associates-list"
                          className="nav-link"
                          id="associates-tooltip"
                          onClick={() => handleLinkClick("Associates")}
                        >
                          Associates
                        </Link>
                        <Tooltip
                          isOpen={tooltipOpen}
                          toggle={toggleTooltip}
                          target="associates-tooltip"
                          placement="bottom"
                          className="bg-light"
                        >
                          Text will be coming soon...
                        </Tooltip>
                      </li>

                      {/* <li className="nav-item">
                        <Link
                          className="nav-link"
                          to="/medical-services/service-provider-login"
                          onClick={() => {
                            handleLinkClick("ServiceProviderLogin");
                            setActiveLink("/medical-services/service-provider-login");
                          }}
                           
                        >
                          Service Provider
                        </Link>
                      </li> */}
                    </ul>
                  </li>

                  <li className="nav-item">
                    <Link to="#" className="nav-link">
                      Opportunities <FaAngleDown />
                    </Link>
                    <ul className="dropdown-menu">
                      <li className="nav-item">
                        {titles.map((item) => (
                          <li key={item._id}>
                            <Link
                              to={`/join-handwith-us/${item._id}`}
                              onClick={() =>
                                setActiveLink(`/join-handwith-us/${item._id}`)
                              }
                              className={`nav-link ${getLinkClass(
                                `/join-handwith-us/${item.id}`
                              )}`}
                            >
                              {item.Tittle}
                            </Link>
                          </li>
                        ))}
                      </li>
                    </ul>
                  </li>

                  {/* <li className="nav-item">
                    <Link to="#" className="nav-link">
                      Package <FaAngleDown />
                    </Link>
                    <ul className="dropdown-menu">
                      <li className="nav-item">
                        <Link to="/pregnancy-blood-test" className="nav-link">
                          Pregnancy Blood Test
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/blood-test-kids" className="nav-link">
                          Blood Test For Kids
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/full-body-checkup" className="nav-link">
                          Full Body Checkup
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/senior-citizen-male" className="nav-link">
                          Health checkup for senior citizen (male)
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/senior-citizen-female" className="nav-link">
                          Health checkup for senior citizen (Female)
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/swine-flue" className="nav-link">
                          Swine Flue Test In vadodara
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/serology-blood-test" className="nav-link">
                          Serology Blood Test
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/PCOD-pofile-blood-test" className="nav-link">
                          PCOD Profile Blood Test
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/ige-test" className="nav-link">
                          Blood Ige Test in vadodara
                        </Link>
                      </li>
                    </ul>
                  </li> */}

                  <li className="nav-item">
                    <Link to="/product-list" className="nav-link">
                      Products
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/Service" className="nav-link">
                      Services
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link to="/blog" className="nav-link">
                      Blog
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link to="#" className="nav-link">
                      Contact <FaAngleDown />
                    </Link>
                    <ul className="dropdown-menu">
                      <li className="nav-item">
                        <Link to="/contact" className="nav-link">
                          Contact Us
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/Feedback" className="nav-link">
                          Feedback
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          to="/cms/66878d3413d429f45685f7e7"
                          className="nav-link"
                        >
                          Terms and condition
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          to="/cms/66878d5913d429f45685f7ea"
                          className="nav-link"
                        >
                          Refund Policy
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          to="/cms/66b5dfea9f6f866057e3073b"
                          className="nav-link"
                        >
                          Privacy Policy
                        </Link>
                      </li>
                      {/* <li className="nav-item">
                        <Link to="/center" className="nav-link">
                          Center
                        </Link>
                      </li> */}
                    </ul>
                  </li>
                  {/* <li className="nav-item"><Link to="/sterling-hospital" className="nav-link">hospital</Link></li> */}
                  {/* <li className="nav-item">
                    <Link to="/contact" className="nav-link">
                      Contact
                    </Link>
                  </li> */}
                  <li>
                    <div className="d-flex">
                      <Addtocart />
                      {customerId ? <Account /> : null}
                    </div>
                  </li>
                </ul>
                <Link
                  to={props.navigatelink}
                  className="btn btn-secondary ms-3 btn-login"
                  onClick={(e) =>
                    e.currentTarget.getAttribute("href") === "/" ||
                    e.currentTarget.getAttribute("href") ===
                      "/cms/667e52387a043e58372e16ce" ||
                    e.currentTarget.getAttribute("href") === "/Directors" ||
                    e.currentTarget.getAttribute("href") === "/Directors" ||
                    e.currentTarget.getAttribute("href") === "/Testimonial" ||
                    e.currentTarget.getAttribute("href") === "/awards" ||
                    e.currentTarget.getAttribute("href") === "/news" ||
                    e.currentTarget.getAttribute("href") === "/blog" ||
                    e.currentTarget.getAttribute("href") ===
                      "/pregnancy-blood-test" ||
                    e.currentTarget.getAttribute("href") ===
                      "/blood-test-kids" ||
                    e.currentTarget.getAttribute("href") ===
                      "/full-body-checkup" ||
                    e.currentTarget.getAttribute("href") ===
                      "/senior-citizen-male" ||
                    e.currentTarget.getAttribute("href") ===
                      "/senior-citizen-female" ||
                    e.currentTarget.getAttribute("href") === "/swine-flue" ||
                    e.currentTarget.getAttribute("href") ===
                      "/serology-blood-test" ||
                    e.currentTarget.getAttribute("href") === "/ige-test" ||
                    e.currentTarget.getAttribute("href") ===
                      "/PCOD-pofile-blood-test" ||
                    e.currentTarget.getAttribute("href") === "/contact" ||
                    e.currentTarget.getAttribute("href") === "/Feedback" ||
                    e.currentTarget.getAttribute("href") ===
                      "/cms/66878d3413d429f45685f7e7" ||
                    e.currentTarget.getAttribute("href") ===
                      "/cms/66878d5913d429f45685f7ea" ||
                    e.currentTarget.getAttribute("href") ===
                      "/cms/66b5dfea9f6f866057e3073b" ||
                    e.currentTarget.getAttribute("href") === "/center" ||
                    e.currentTarget.getAttribute("href") === "/camping" ||
                    e.currentTarget.getAttribute("href") === "/join-handwith-us"
                      ? handleShow()
                      : handleClose()
                  }
                >
                  Login / Sign Up
                </Link>

                <Modal show={showModal} onHide={handleClose} centered size="lg">
                  <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">
                      Login to our Network
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Row className="justify-content-center" id="industry">
                      <Col lg={3} md={4} sm={6}>
                        <Link
                          to="/laboratory-login"
                          onClick={() => handleLinkClick("Laboratory")}
                        >
                          <Card className="single-services-box-modalpopup text-center">
                            <Card.Body>
                              <div className="icon">
                                <Image src={icon1} alt="Service Icon" />
                              </div>
                              <Card.Title className="networktitle">
                                Laboratory
                              </Card.Title>
                            </Card.Body>
                          </Card>
                        </Link>
                      </Col>
                      <Col lg={3} md={4} sm={6}>
                        <Link
                          to="/pharmacy-signup"
                          onClick={() => handleLinkClick("Pharmacy")}
                        >
                          <Card className="single-services-box-modalpopup text-center">
                            <Card.Body>
                              <div className="icon">
                                <Image src={icon2} alt="Service Icon" />
                              </div>
                              <Card.Title className="networktitle">
                                Pharmacy
                              </Card.Title>
                            </Card.Body>
                          </Card>
                        </Link>
                      </Col>
                      <Col lg={3} md={4} sm={6}>
                        <Link
                          to="/doctor-signup"
                          onClick={() => handleLinkClick("Doctors")}
                        >
                          <Card className="single-services-box-modalpopup text-center">
                            <Card.Body>
                              <div className="icon">
                                <Image src={icon3} alt="Service Icon" />
                              </div>
                              <Card.Title className="networktitle">
                                Doctors
                              </Card.Title>
                            </Card.Body>
                          </Card>
                        </Link>
                      </Col>

                      <Col lg={3} md={4} sm={6}>
                        <Link
                          to="/hospital-signup"
                          onClick={() => handleLinkClick("Hospital")}
                        >
                          <Card className="single-services-box-modalpopup text-center">
                            <Card.Body>
                              <div className="icon">
                                <Image src={icon4} alt="Service Icon" />
                              </div>
                              <Card.Title className="networktitle">
                                Hospital
                              </Card.Title>
                            </Card.Body>
                          </Card>
                        </Link>
                      </Col>
                      <Col lg={3} md={4} sm={6}>
                        <Link
                          to="/patient-login"
                          onClick={() => handleLinkClick("Patients")}
                        >
                          <Card className="single-services-box-modalpopup text-center">
                            <Card.Body>
                              <div className="icon">
                                <Image src={icon5} alt="Service Icon" />
                              </div>
                              <Card.Title className="networktitle">
                                Member
                              </Card.Title>
                            </Card.Body>
                          </Card>
                        </Link>
                      </Col>
                      <Col lg={3} md={4} sm={6}>
                        <Link
                          to="/affiliate-signup"
                          onClick={() => handleLinkClick("Affiliate")}
                        >
                          <Card className="single-services-box-modalpopup text-center">
                            <Card.Body>
                              <div className="icon">
                                <Image src={icon6} alt="Service Icon" />
                              </div>
                              <Card.Title className="networktitle">
                                Affiliate
                              </Card.Title>
                            </Card.Body>
                          </Card>
                        </Link>
                      </Col>
                    </Row>
                  </Modal.Body>
                </Modal>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modalnavigationbar;
