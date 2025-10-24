import React from "react";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import Pagetitle from "../patients/Pagetitle";
import { MdArrowForwardIos } from "react-icons/md";
import {Hospitalad} from "../hospital/Hospitallable";
import hospitalad from "../img/hospitalad.jpg";
import { Container, Row, Col, Image } from "react-bootstrap";
import doctorlogo from "../img/devhospitallogo.png";

import direction from "../img/direction.png";
import calander from "../img/calendar.svg";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { FaCheck } from "react-icons/fa";
import { FaSquare } from "react-icons/fa6";
import { TbDeviceImacCode, TbWorldWww } from "react-icons/tb";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosMailUnread } from "react-icons/io";
import doctorimage from "../img/doctorimage.jpg";
import icon1 from "../img/icon1.png";
import icon2 from "../img/icon2.png";
import icon3 from "../img/icon3.png";
import icon4 from "../img/icon4.png";
import icon5 from "../img/icon5.png";
import tricolor from "../img/tricolor.jpg";
import zydus from "../img/zydus.jpg";
import gujrat from "../img/gujara-hospital.jpg";
import { FaLocationDot } from "react-icons/fa6";
import { Common ,Sterlingicon,Morehospital,Joinournetwork,Gallary} from "../hospitalpages/Common";
import CommonSec from "../navbar/CommonSec";
function Labpage() {
  return (
    <>
    <CommonSec />
      <Modalnavigationbar navigatelink="" />
      <div className="page-title-area">
        <Pagetitle
          heading="OM CHEMIST AND SUPERSTORE"
          pagetitlelink="/"
          title1="Home"
          title2="Pharmacy"
          IconComponent={MdArrowForwardIos}
        />
      </div>
      {/* section start */}

      <section className="services-details-area ptb-50 main-laboratory-section">
        <Container>
          <Row>
            <Hospitalad hospitaladimage={hospitalad} />

            <div class="col-lg-10 col-md-12">
              <div class="services-sidebar laboratory-detail details">
                <div class="services-list">
                  <div class="hospital-part">
                    <div class="row align-items-center">    
                      <div class="col-md-3">
                        <div class="hospital-logo">
                          <img src={doctorlogo} class="img-fluid" />
                        </div>
                      </div>
                      
                      <div class="col-md-6">
                        <div class="hospital-info">
                          <h5 class="hospital-name">Dev Medical Hospital</h5>
                          <p class="hospital-location">Gotri, Vadodara</p>
                          <p class="hospital-types">
                            Multi-Speciality Hospital •{" "}
                            <span class="text-success fw-bold">
                              {" "}
                              24 x 7 Open{" "}
                            </span>{" "}
                          </p>
                        </div>
                      </div>
                      <div class="col-md-3">
                        <div class="hospital-action">
                          <a href="#" className="btn btn-secondary btn-login">
                            {" "}
                            <img
                              src={direction}
                              style={{ width: 20, height: 20 }}
                            />{" "}
                            Get Directions
                          </a>
                          <a href="#" className="btn btn-secondary btn-login">
                            {" "}
                            <img
                              src={calander}
                              style={{ width: 20, height: 20 }}
                            />{" "}
                            Book Appointment
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs className='hospital-detail'>
                <TabList>
                  <Tab>
                    <FaSquare className="tab_icon" /> Overview
                  </Tab>
                  <Tab>
                    <FaSquare className="tab_icon" /> Location
                  </Tab>
                  <Tab>
                    <FaSquare className="tab_icon" /> Gallery
                  </Tab>
                </TabList>

                <TabPanel>
                  <div className="products-details-tab-content">
                    <h3 className="title">About Dev Medical Hospital</h3>
                    <p>
                    Dr. Parag Rana is undoubtedly the best in class. 
                    He is very intelligent and experienced.
                     He always has been accurate with his diagnoses and treatment.
                      He is also very approachable and kind as well. 
                      We live in United States and have been consulting him since years
                       from minor health issues like cold/flu to life threatening issues
                        like cardiac arrest. He is God to us as he saved my mom's life and
                         I am forever grateful to him. The hospital is amazing clean and reasonable
                          as well.
                    </p>
                    <h3 className="title">Salient Features:</h3>
                    <ul className="about-features-list" style={{padding:0}}>
                     
                      <li>
                        <FaCheck style={{ color: "#eb268f" }} /> Government
                        approved Renal Transplant Unit.
                      </li>
                      <li>
                        <FaCheck style={{ color: "#eb268f" }} /> Pathology
                        Department Vadodara is ISO 9001: 2008.
                      </li>
                      <li>
                        <FaCheck style={{ color: "#eb268f" }} /> Highest
                        dialysis procedure recorded in the region.
                      </li>
                      <li>
                        <FaCheck style={{ color: "#eb268f" }} /> Fully equipped
                        24×7 Emergency services.
                      </li>
                      <li>
                        <FaCheck style={{ color: "#eb268f" }} /> Ultra-modern
                        Diagnostic lab providing facilities for performing 2D
                        Echo, Audiometry, CT Scanning, DSA Lab, EMG, Holter
                      </li>
                      <li>
                        <FaCheck style={{ color: "#eb268f" }} /> Monitoring,
                        Mammography, Spirometry, TMT Ultrasound, Urodynamic
                        Study, X-ray etc.
                      </li>
                      <li>
                        <FaCheck style={{ color: "#eb268f" }} /> Hospital
                        provides Lab & transfusion services like Blood Storage,
                        Blood Transfusion, Clinical Biochemistry, Clinical
                        Microbiology.
                      </li>
                      <li>
                        <FaCheck style={{ color: "#eb268f" }} /> Facility has
                        advanced set-up for Bone Marrow Transplant headed by
                        experienced oncologist providing the broad spectrum of
                        Leukemia.
                      </li>
                    </ul>
                  </div>
                </TabPanel>

                

              

          
                <TabPanel>
                <div class="row">
                                           

                                                <div class="col-lg-6 col-12 ">
                                                <div class="products-details-tab-content contact">
                                                    <div class="single-footer-widget">
                                                        <h3>GOTRI</h3>

                                                        <ul class="footer-contact-info">
                                                            <li><FaLocationDot className="sterling_icon1" />
                                                                <h5>Dev Medical Hospital</h5>
                                                                <p><span>Registered Office:</span>
                                                                Dev Commercial Center, S-9 to 15, Natubhai Circle, Near, Gotri Rd, Hari Nagar, Vadodara, Gujarat 390021
                                                                </p>
                                                            </li>
                                                            <li><FaPhoneAlt className="phone_icon" /> <a
                                                                    href="tel:+91 95122 24477">+91 095122 22561 </a></li>
                                                                    <li><FaPhoneAlt className="phone_icon" /> <a
                                                                        href="tel: +91 87582 24477"> +91 91 82384 45599</a></li>
                                                            <li><IoIosMailUnread className="phone_icon" /> <a
                                                                    href="mailto:omchemist.superstore1@gmail.com">askdrparag@gmail.com
</a>
                                                            </li>
                                                            <li><TbWorldWww className="phone_icon" /> <a
                                                                    href="www.omchemistandsuperstore.com"
                                                                    target="_blank">www.devmedicalhospital.com</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                </div>

                                                </div>
                </TabPanel>

                <TabPanel>
                  <div class="products-details-tab-content">
                    <div class="row" id="gallery">
                      <Gallary gallaryimage={doctorimage} />
                      <Gallary gallaryimage={doctorimage} />
                      <Gallary gallaryimage={doctorimage} />
                    </div>
                  </div>
                </TabPanel>
              </Tabs>
            </div>

            <div class="col-lg-2 col-md-12">
              <div style={{ position: "sticky", top: 0 }}>
                <div class="my-3">
                  <h5
                    style={{
                      fontSize: 17,
                      textAlign: "center",
                      fontWeight: 600,
                    }}
                  >
                    Join Our Network
                  </h5>
                </div>

                <div class="row justify-content-center" id="details-pages">
                  <Joinournetwork
                    network={icon1}
                    title="Laboratory"
                    joinnetworklink="/laboratory"
                  />
                  <Joinournetwork
                    network={icon2}
                    title="Pharmacy"
                    joinnetworklink="/pharmacy"
                  />
                  <Joinournetwork
                    network={icon3}
                    title="Doctors"
                    joinnetworklink="/doctor"
                  />
                  <Joinournetwork
                    network={icon4}
                    title="Hospital"
                    joinnetworklink="/hospital"
                  />
                  <Joinournetwork
                    network={icon5}
                    title="Member"
                    joinnetworklink="/patient-login"
                  />
                </div>
              </div>
            </div>
          </Row>

          <div className="col-lg-12 col-12">
            <div className="related-project">
              <div className="container">
                <div className="section-title text-center">
                  <span>More Hospital</span>
                  <h2>Nearby Hospital</h2>
                </div>
                <div className="row justify-content-center">
                  <div className="col-lg-4 col-md-6 col-12">
                    <Morehospital
                      morehospitalimage={zydus}
                      morehospitaltitle="Zydus Hospital"
                    />
                  </div>
                  <div className="col-lg-4 col-md-6 col-12">
                    <Morehospital
                      morehospitalimage={tricolor}
                      morehospitaltitle="Tricolors Hospital"
                    />
                  </div>
                  <div className="col-lg-4 col-md-6 col-12">
                    <Morehospital
                      morehospitalimage={gujrat}
                      morehospitaltitle="Gujrat Hospital"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export default Labpage;
