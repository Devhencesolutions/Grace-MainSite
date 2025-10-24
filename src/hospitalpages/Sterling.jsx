import React from "react";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import Pagetitle from "../patients/Pagetitle";
import { MdArrowForwardIos } from "react-icons/md";
import {
  Hospitalad,
  Hospitallable,
  Hospitalname,
} from "../hospital/Hospitallable";
import hospitalad from "../img/hospitalad.jpg";
import { Container, Row, Col, Image } from "react-bootstrap";
import sterling from "../img/sterling_logo.jpg";
import direction from "../img/direction.png";
import calander from "../img/calendar.svg";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { FaRegSquare } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaSquare } from "react-icons/fa6";
import Doctorsec from "../doctor/Doctorsec";
import drimage from "../img/drimage.jpg";
import {
  Common,
  Gallary,
  Joinournetwoek,
  Joinournetwork,
  Morehospital,
  Sterlingicon,
} from "./Common";
import aminities from "../img/aminities.png";
import { TbDeviceImacCode, TbWorldWww } from "react-icons/tb";
import { MdBloodtype } from "react-icons/md";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
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

function Sterling() {
  return (
    <>
      <Modalnavigationbar navigatelink="" />
      <div className="page-title-area">
        <Pagetitle
          heading="STERLING HOSPITAL"
          pagetitlelink="/"
          title1="Home"
          title2="Hospital"
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
                          <img src={sterling} class="img-fluid" />
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="hospital-info">
                          <h5 class="hospital-name"> Sterling Hospital</h5>
                          <p class="hospital-location">Racecourse, Vadodara</p>
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
                    <FaSquare className="tab_icon" /> Doctors
                  </Tab>
                  <Tab>
                    <FaSquare className="tab_icon" /> Treatments
                  </Tab>
                  <Tab>
                    <FaSquare className="tab_icon" /> Amenities
                  </Tab>
                  <Tab>
                    <FaSquare className="tab_icon" /> Contact
                  </Tab>
                  <Tab>
                    <FaSquare className="tab_icon" /> Gallery
                  </Tab>
                </TabList>

                <TabPanel>
                  <div className="products-details-tab-content">
                    <h3 className="title">About Sterling Hospital</h3>
                    <p>
                      Sterling Hospital, a unit of Sterling Add Life India Pvt
                      Ltd., a 220 bedded multi specialty and tertiary Care
                      Centre, situated at Race Course Circle (west) Vadodara.
                      Sterling Hospital has state-of-the art infrastructure and
                      is equipped to offer healthcare services in specialties,
                      and Super specialties backed by specialised facilities,
                      value added services and 24 hour services. The hospital is
                      one place diagnostic and treatment center with excellence
                      & patient-friendly ambience. With medical expertise
                      supported by the latest equipments, offer healthcare
                      treatment of International standards including diagnostics
                      tests at the hospital.
                    </p>
                    <p>
                      Care with compassion has been the guiding principle of
                      hospital. By bringing together all the patient services &
                      activities, the hospital builds a unified atmosphere that
                      helps to provide patients with the most effective
                      personalised care. With a team of some of the finest
                      medical talent, the latest equipment and state-of-the-art
                      facilities, Sterling hospital, Vadodara has raised the
                      National standards for healthcare, placing Gujarat on the
                      Global healthcare map. Sterling hospital has now become
                      the first preference for Gujarat born NRIs from the US, UK
                      and African countries, for their healthcare needs. Over
                      the years, Sterling Hospitals has gained astounding
                      success in the provision and advancement of tertiary
                      healthcare in Gujarat. Ever since its inception (2006);
                      Sterling Hospital has a good reputation for its humane and
                      patient centric staff as well as precise and accurate
                      management. We are working in close co-operation to take
                      care of the patient in an empathetic manner.
                    </p>
                    <h3 className="title">Salient Features:</h3>
                    <ul className="about-features-list" style={{padding:0}}>
                      <li>
                        <FaCheck style={{ color: "#eb268f" }} /> First corporate
                        hospital to be accredited with NABH in South Gujarat.
                      </li>
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
                    <div class="col-lg-4 col-md-6 col-12">
                      <Doctorsec
                        drimage={drimage}
                        drname="Dr. Name"
                        drlocation=" Gynaecologist, Zydus Hospital"
                        location="Alkapuri"
                      />
                    </div>
                    <div class="col-lg-4 col-md-6 col-12">
                      <Doctorsec
                        drimage={drimage}
                        drname="Dr. Name"
                        drlocation="ENT Speciality, Sterling Hospital"
                        location="Alkapuri"
                      />
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div class="products-details-tab-content">
                    <div class="product-review-form">
                      <div class="review-comments row">
                        <div class="col-lg-6 col-12">
                          <Common />
                        </div>
                        <div class="col-lg-6 col-12">
                          <Common />
                        </div>
                        <div class="col-lg-6 col-12">
                          <Common />
                        </div>
                        <div class="col-lg-6 col-12">
                          <Common />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div class="products-details-tab-content">
                    <div class="col-lg-12 col-md-12">
                      <div class="research-details-features">
                        <div class="row">
                          <div class="col-lg-3 col-md-6 col-sm-6 sterling_icon">
                            <Sterlingicon
                              image={aminities}
                              icons={<TbDeviceImacCode />}
                            />
                          </div>
                          <div class="col-lg-3 col-md-6 col-sm-6 sterling_icon">
                            <Sterlingicon
                              image={aminities}
                              icons={<MdBloodtype />}
                            />
                          </div>

                          <div class="col-lg-3 col-md-6 col-sm-6 sterling_icon">
                            <Sterlingicon
                              image={aminities}
                              icons={<HiOutlineComputerDesktop />}
                            />
                          </div>
                          <div class="col-lg-3 col-md-6 col-sm-6 sterling_icon">
                            <Sterlingicon
                              image={aminities}
                              icons={<TbDeviceImacCode />}
                            />
                          </div>

                          <div class="col-lg-3 col-md-6 col-sm-6 sterling_icon">
                            <Sterlingicon
                              image={aminities}
                              icons={<MdBloodtype />}
                            />
                          </div>

                          <div class="col-lg-3 col-md-6 col-sm-6 sterling_icon">
                            <Sterlingicon
                              image={aminities}
                              icons={<HiOutlineComputerDesktop />}
                            />
                          </div>
                          <div class="col-lg-3 col-md-6 col-sm-6 sterling_icon">
                            <Sterlingicon
                              image={aminities}
                              icons={<TbDeviceImacCode />}
                            />
                          </div>

                          <div class="col-lg-3 col-md-6 col-sm-6 sterling_icon">
                            <Sterlingicon
                              image={aminities}
                              icons={<MdBloodtype />}
                            />
                          </div>
                          <div class="col-lg-3 col-md-6 col-sm-6 sterling_icon">
                            <Sterlingicon
                              image={aminities}
                              icons={<HiOutlineComputerDesktop />}
                            />
                          </div>

                          <div class="col-lg-3 col-md-6 col-sm-6 sterling_icon">
                            <Sterlingicon
                              image={aminities}
                              icons={<TbDeviceImacCode />}
                            />
                          </div>

                          <div class="col-lg-3 col-md-6 col-sm-6 sterling_icon">
                            <Sterlingicon
                              image={aminities}
                              icons={<MdBloodtype />}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <dic class="row">
                    <div class="col-lg-6 col-12">
                      <div class="products-details-tab-content">
                        <div className="contact">
                          <div class="single-footer-widget">
                            <h3>Contact Info</h3>

                            <ul class="footer-contact-info">
                              <li>
                                <FaPhoneAlt className="phone_icon" />
                                <a href="tel:+91&nbsp;93138&nbsp;03441">
                                  +91&nbsp;93138&nbsp;03441
                                </a>
                              </li>
                              <li>
                                <IoIosMailUnread className="phone_icon" />
                                <a href="mailto:bharat.gracemedicalservices@gmail.com">
                                  bharat.gracemedicalservices@gmail.com
                                </a>
                              </li>
                              <li>
                                <TbWorldWww className="phone_icon" />
                                <a
                                  href="www.sterlinghospitals.com"
                                  target="_blank"
                                >
                                  www.sterlinghospitals.com
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-6 col-12">
                      <div class="products-details-tab-content">
                        <div className="content">
                          <div class="single-footer-widget">
                            <h3>Our Location</h3>

                            <ul class="footer-contact-info">
                              <li>
                             
                                
                                <h5 className="sterling_title">
                                <FaLocationDot className="sterling_icon1" />
                                  Sterling Addlife India Private Limited
                                </h5>
                                <p className="steling_p">
                                  <span>Registered Office:</span>
                                  Sterling Hospital, Sterling Hospital Road,
                                  Memnagar, Ahmedabad-380052, Gujarat, India
                                </p>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </dic>
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

export default Sterling;
