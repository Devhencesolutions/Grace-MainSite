import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Checkbox,
  Modal,
  Alert,
} from "react-bootstrap";
// import { Modal } from 'react-bootstrap';
import network from "../img/network.jpg";
import Pagetitle from "./Pagetitle";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import { MdArrowForwardIos } from "react-icons/md";
import axios from "axios";
import { IoCheckmarkDoneSharp, IoLocationSharp, IoCall } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import CommonSec from "../navbar/CommonSec";
import ScrollToTop from "../scrolltop/Scrolltop";
import Cookies from "js-cookie";
import LoginComponent from "./loginComponent";
import { Tooltip } from "reactstrap";
import { BsGlobe2 } from "react-icons/bs";

const handleRedirect = () => {
  window.open("https://Associates.gracemedicalservices.in/home/login", "_blank");
};

function Associateslogin() {
  const [showModal, setShowModal] = useState(false);
  const userNameFromCookies = Cookies.get("AssociatesName");

  // const handlechange = async(e) =>
  //   {
  //     e.preventDefault();
  //     setloading(true);
  //     seterror('');

  //     try {
  //       const Associateslogin = await axios.post(
  //         `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/userLoginAssociates`,
  //         {
  //                 email,
  //                 password,
  //         }
  //       )

  //       const Associatesresult = (Associateslogin.data)

  //       if (Associatesresult.isOk) {
  //         window.open('http://AssociatesGracelab.barodaweb.in','_blank');
  //       } else {
  //         seterror(Associatesresult.message);
  //       }

  //     } catch (err) {
  //       console.error(err);
  //       seterror('An error occurred while logging in.');
  //     } finally {
  //       setloading(false);
  //     }
  //   };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [temp, setshowModalappoitment] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggleTooltip = () => {
    setTooltipOpen(!tooltipOpen);
  };
  return (
    <>
      <CommonSec />
      <ScrollToTop />
      <Modalnavigationbar />

      {/* <div className="text-end stored-name">
        {userNameFromCookies ? (
          <span className="Associates-name">Welcome {userNameFromCookies}</span>
        ) : null}
      </div> */}
      <div className="page-title-area">
        <Pagetitle
          heading="Associates"
          pagetitlelink="/associates-signup"
          title1="Home"
          title2="Network"
          IconComponent={MdArrowForwardIos}
        />
      </div>

      {/* section start */}
      <section className="services-area ptb-70 pb-5">
        <Container>
          <Row className="justify-content-center" id="loginPanel">
            <Col md={12} lg={10}>
              <div className="wrap d-md-flex">
                <div className="login-wrap p-4 p-md-5">
                  <div className="d-block">
                    <div className="w-100 text-center">
                      <h3 className="mb-2 h5 fw-bold">
                        We are The Grace Lab Team
                      </h3>
                      <p className="mb-4">Please login to your account</p>
                    </div>
                  </div>
                  <Tooltip
                      placement="top" // Tooltip position (top, bottom, left, right)
                      isOpen={tooltipOpen}
                      target="websiteLink" // ID of the element the tooltip is attached to
                      toggle={toggleTooltip}
                    >
                    Click Here to sign in
                    </Tooltip>
                  
                  <div className="d-flex gap-3" >

                    <Button
                    id="websiteLink" 
                      onClick={() => setShowLoginModal(true)}
                      type="submit"
                      className="form-control btn btn-sign-in rounded submit px-3"
                    >
                      SIGN IN{" "}
                    </Button>
                  </div>

                  {/* </Form> */}
                  <p className="text-center accounttop">
                    Don't have an account?{" "}
                    <Link
                      to="/associates-signup"
                      className="d-inline-block register-here"
                    >
                      Register here
                    </Link>
                  </p>
                </div>
                <div
                  class="img"
                  style={{ backgroundImage: `url(${network})` }}
                ></div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <LoginComponent setShowLoginModal={setShowLoginModal} showLoginModal={showLoginModal} setshowModalappoitment={setshowModalappoitment} />

    </>
  );
}

export default Associateslogin;
