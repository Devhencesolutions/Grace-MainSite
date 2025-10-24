import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Carousel, Col, Collapse, Container, Image, Row } from "react-bootstrap";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import { IoIosArrowBack, IoIosArrowForward, IoIosMail } from "react-icons/io";
import { IoCall, IoSearch } from "react-icons/io5";
import { MdArrowForwardIos } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import placeholder from "../img/placeholder-banner-panel.png";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import Pagetitle from "../patients/Pagetitle";
import Pharmacysec from "./Pharmacysec";

function Pharmacy() {
  const navigate = useNavigate();
  const [pharmacylist, setpharmacylist] = useState([]);
  const [pharmacylocation, setpharmacylocation] = useState(null);
  const [pharmacylaballlist, setpharmacylaballlist] = useState([]);
  const [PharmacyList, setPharmacyList] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPharmacies, setFilteredPharmacies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pharmacyad, setpharmacyad] = useState(null);
  const userNameFromCookies = Cookies.get("PatientName");
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [advertisementImages, setAdvertisementImages] = useState([]);

  const filteredLabs = PharmacyList?.filter(
    (lab) =>
      lab.PharmacyName.toLowerCase().includes(query.toLowerCase()) ||
      lab.address.toLowerCase().includes(query.toLowerCase())
  );
  const totalPages = Math.ceil(filteredLabs.length / itemsPerPage);
  const currentLabs = filteredLabs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const Pharmacylist = async () => {
      try {
        // Define parameters for pagination, sorting, and filtering
        const pageNo = 1; // Example page number
        const perPage = 1000; // Example number of items per page
        const column = "LabName"; // Example column to sort on
        const sortDirection = "asc"; // Example sort direction

        const filter = true; // Example filter for active laboratories

        const skip = (pageNo - 1) * perPage;

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/listPharmaciesByCity`,
          {
            skip: skip,
            per_page: perPage,
            sorton: column,
            sortdir: sortDirection,
            match: {
              City: selectedCities.length > 0 ? selectedCities : undefined,
            },
            isActive: filter,
          }
        );

        // Assuming the response contains an array of laboratories
        const laboratories = response;

        const labdata = laboratories.data;

        // Filter active laboratories (if needed)
        const activeLaboratories = labdata.filter((lab) => lab.isActive);

        setPharmacyList(activeLaboratories);
      } catch (error) {
        console.error("Error fetching laboratories:", error);
      }
    };
    Pharmacylist();

    const lablist = async () => {
      try {
        // Define parameters for pagination, sorting, and filtering
        const pageNo = 1; // Example page number
        const perPage = 10; // Example number of items per page
        const column = "LabName"; // Example column to sort on
        const sortDirection = "asc"; // Example sort direction

        const filter = true; // Example filter for active laboratories

        const skip = (pageNo - 1) * perPage;

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/listPharmaciesByCity`,
          {
            skip: skip,
            per_page: 10000,
            sorton: column,
            sortdir: sortDirection,
            match: {
              City: selectedCities,
            },
            isActive: filter,
          }
        );

        // Assuming the response contains an array of laboratories
        const laboratories = response.data[0];

        const labdata = laboratories.data;

        const activeLaboratories = labdata.filter((lab) => lab.isActive);

        setpharmacylist(activeLaboratories);
      } catch (error) {
        console.error("Error fetching laboratories:", error);
      }
    };
    lablist();

    // const pharmacyad = async () => {
    //   try {
    //     // Define parameters for pagination, sorting, and filtering
    //     const pageNo = 1; // Example page number
    //     const perPage = 10; // Example number of items per page
    //     const column = "LabName"; // Example column to sort on
    //     const sortDirection = "asc"; // Example sort direction

    //     const filter = true; // Example filter for active laboratories

    //     const skip = (pageNo - 1) * perPage;

    //     const response = await axios.post(
    //       `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list-by-params/listCustomizeAdvertisementByPharmacyLocation`,
    //       {
    //         skip: 0,
    //         per_page: 100000,
    //         sorton: "",
    //         sortdir: "",
    //         match: {
    //           Speciality: selectedCities,
    //         },
    //         IsActive: true,
    //       }
    //     );

    //     // Assuming the response contains an array of laboratories
    //     const laboratories = response.data[0].data[0].CustomAdsImage;
    //     setpharmacyad(`${laboratories}`);

    //     const labdata = laboratories;

    //     // Filter active laboratories (if needed)
    //     const activeLaboratories = labdata.filter((lab) => lab.isActive);

    //     setpharmacylist(activeLaboratories);
    //   } catch (error) {
    //     console.error("Error fetching laboratories:", error);
    //   }
    // };
    // pharmacyad();

    const fetchAdsData = async (adType = "Pharmacy") => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/customize-advertisement?type=${adType}`
        );
        // const adsData = response.data.filter((item) => item.IsActive);
        const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

        const adsData = response.data.filter((item) => {
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
        
        if (adsData.length > 0) {
          console.log("Found ads:", adsData.length);
          const imageUrls = adsData.map(
            (ad) =>
              `${process.env.REACT_APP_API_URL_GRACELAB}/${ad.CustomAdsImage}`
          );
          setAdvertisementImages(imageUrls);
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAdsData("Pharmacy");
    const Pharmacylocation = async () => {
      try {
        const locationp = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/location/city`
        );
        const pharmacylocation = locationp.data.filter(
          (pharmacylocationfetch) => pharmacylocationfetch.IsActive
        );
        setpharmacylocation(pharmacylocation);
      } catch (error) {
        console.log("Error :", error);
      }
    };
    Pharmacylocation();

    const Pharmacylistall = async () => {
      try {
        const pharmacylist = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/listPharmacies`
        );

        const Allisactivepharmacy = pharmacylist.data.filter(
          (post) => post.isActive
        );

        setpharmacylaballlist(Allisactivepharmacy);
      } catch (error) {
        console.log("Error :", error);
      }
    };
    Pharmacylistall();
  }, [query, selectedCities]);

  useEffect(() => {
    setFilteredPharmacies(pharmacylist); // Initialize filtered list with full list on component mount
  }, [pharmacylist]);

  

  // const handleCityChange = (event) => {
  //   const { value, checked } = event.target;
  //   if (checked) {
  //     setSelectedCities([...selectedCities, value]);
  //   } else {
  //     setSelectedCities(selectedCities.filter((city) => city !== value));
  //   }

  //   setPharmacyList([]);
  //   // setCurrentPage(1);
  // };
  const [areas, setAreas] = useState([]); // State to store areas
  const [allAreas, setAllAreas] = useState([]); // State for the original list of areas

  const [selectedAreas, setSelectedAreas] = useState([]);

  const fetchAreas = async (cityId, updatedAreas) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/listarea/pharmacy/${cityId}`
      );
      setAreas(response.data.PharmacyArea); // Update the areas state with the fetched data
      console.log("preyash", response);
      setAllAreas(response.data.PharmacyArea);
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };
  const handleCheckboxChangearea = async (area, checked) => {
    let updatedAreas;

    // If checkbox is checked, add the area to the selected list
    if (checked) {
      updatedAreas = [...selectedAreas, area];
    } else {
      // If checkbox is unchecked, remove the area from the selected list
      updatedAreas = selectedAreas.filter(
        (selectedArea) => selectedArea !== area
      );
    }

    // Update the selected areas state
    console.log("Updated selected areas:", updatedAreas);
    setSelectedAreas(updatedAreas);

    // Fetch areas based on the updated selected areas
    await fetchLocations(updatedAreas);
  };
  const fetchLocations = async (updatedAreas) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL_GRACELAB;

      const response = await axios.post(
        `${apiUrl}/api/auth/listPharmaciesByCity`,
        {
          skip: 0,
          per_page: 10000,
          sorton: "area",
          sortdir: "asc",
          match: {
            Speciality: selectedCities,
            City: selectedCities.length > 0 ? selectedCities : undefined,
            area: updatedAreas.length > 0 ? updatedAreas : undefined,
          },
          isActive: true,
        }
      );

      console.log("API Response:", response.data); // Log API response

      // Check if response contains expected data
      if (response.data && response.data.PharmacyArea) {
        console.log("Doctor Areas:", response.data.PharmacyArea);
        setAreas(response.data.PharmacyArea); // Set areas from API response
        setPharmacyList(response.data);
        setAllAreas(response.data.PharmacyArea);
      } else {
        console.log("No valid data found");
        setPharmacyList(response.data);
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
      // setAreas([]); // Clear areas if an error occurs
    }
  };
  const handleCityChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedCities([...selectedCities, value]);
      fetchAreas(value); // Fetch areas based on the selected city ID
    } else {
      setSelectedCities(selectedCities.filter((city) => city !== value));
      setAreas([]); // Clear areas if no city is selected
      setAllAreas([]);
    }
    setPharmacyList([]);
  };
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue); // Update query state on every input change
  };

  const [open1, setOpen1] = useState(true);
  const [open2, setOpen2] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [pharmacyshowMore, pharmacysetShowMore] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");

  const filteredLocations =
    pharmacylocation?.filter((city) =>
      city.Name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleShowMore = (event) => {
    event.preventDefault();
    setShowMore(!showMore);
  };
  const pharmacytoggleShowMore = (event) => {
    event.preventDefault();
    pharmacysetShowMore(!pharmacyshowMore);
  };

  const toggleAccordion1 = (event) => {
    event.preventDefault();
    setOpen1(!open1);
  };
  const toggleAccordion2 = (event) => {
    event.preventDefault();
    setOpen2(!open2);
  };

  const [selectedLabs, setSelectedLabs] = useState([]);

  const handleCheckboxChange = (e, labo) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      // Add labo to selectedLabs if checked
      setSelectedLabs([...selectedLabs, labo]);
    } else {
      // Remove labo from selectedLabs if unchecked
      setSelectedLabs(selectedLabs.filter((lab) => lab._id !== labo._id));
    }
  };

  useEffect(() => {
    // Filter pharmacies whenever searchTerm changes
    const filtered = pharmacylist.filter(
      (pharmacy) =>
        pharmacy.PharmacyName.toLowerCase().includes(
          searchTerm.toLowerCase()
        ) || pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPharmacies(filtered);
  }, [searchTerm, pharmacylist]);

  useEffect(() => {
    // Filter pharmacies whenever query changes
    const filtered = pharmacylist.filter((pharmacy) =>
      pharmacy.PharmacyName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPharmacies(filtered);
  }, [query, pharmacylist]);


  const [areaSearchQuery, setAreaSearchQuery] = useState(""); // New state for the area search

  const handleAreaSearchChange = (event) => {
    const searchQuery2 = event.target.value;
    setAreaSearchQuery(searchQuery2);
    console.log(searchQuery2);
    if (searchQuery2 === "") {
      // If the search query is cleared, show the original list
      setAreas(allAreas);
    } else {
      // Filter areas based on the search query
      const filteredAreas = allAreas.filter((area) =>
        area.toLowerCase().includes(searchQuery2.toLowerCase())
      );
      setAreas(filteredAreas);
    }
  };

  const handleFastRegistration = () => {
    navigate("/patient-login?register=mobile");
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

      <Modalnavigationbar navigatelink="/pharmacy-login" />
      {/* <div className="text-end stored-name">
        {userNameFromCookies ? (
          <span className="patient-name">Welcome {userNameFromCookies}</span>
        ) : null}
      </div> */}
      <div className="page-title-area">
        <Pagetitle
          heading="PHARMACY"
          pagetitlelink="/pharmacy-signup"
          title1="Home"
          title2="Network"
          registrationTitle="Pharmacy Registration"
          IconComponent={MdArrowForwardIos}
        />
      </div>

      {/* section start */}

      <section className="services-details-area ptb-50 main-laboratory-section">
        <Container>
          <Row>
            {/* <Col lg={12} md={12} xs={12} className="mb-0">
              <div
                className="ad-image position-relative"
                style={{ paddingBottom: 40 }}
              >
                <Image
                  src={
                    pharmacyad
                      ? `${process.env.REACT_APP_API_URL_GRACELAB}/${pharmacyad}`
                      : ""
                  }
                  onError={(e) => {
                    e.target.src = placeholder;
                  }}
                  fluid
                />{" "}

                <div className="span-title">
                  <span>Ad</span>
                </div>
              </div>
            </Col> */}

            <Col lg={12} md={12} xs={12} className="mb-0">
              <div
                className="ad-image position-relative"
                style={{ paddingBottom: 40 }}
              >
                {advertisementImages.length > 0 ? (
                  <>
                     <Carousel
                      controls={advertisementImages.length > 1}
                      indicators={advertisementImages.length > 1}
                      interval={4000}
                      prevIcon={
                        advertisementImages.length > 1 && (
                          <FaChevronCircleLeft
                            className="custom-carousel-icon"
                            style={{ fontSize: "40px", color: "#EB268F" }}
                          />
                        )
                      }
                      nextIcon={
                        advertisementImages.length > 1 && (
                          <FaChevronCircleRight
                            className="custom-carousel-icon"
                            style={{ fontSize: "40px", color: "#EB268F" }}
                          />
                        )
                      }
                    >
                      {advertisementImages.map((imageUrl, index) => (
                        <Carousel.Item key={index}>
                          <Image
                            src={imageUrl}
                            onError={(e) => {
                              console.error(
                                `Image failed to load: ${imageUrl}`
                              );
                              e.target.src = placeholder;
                            }}
                            onLoad={() => {
                              console.log(
                                `Image loaded successfully: ${imageUrl}`
                              );
                            }}
                            fluid
                            className="d-block w-100"
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </>
                ) : (
                  <>
                    <Image src={placeholder} fluid className="d-block w-100" />
                  </>
                )}
                <div className="span-title">
                  <span>Ad</span>
                </div>
              </div>
            </Col>

            {/* left side section start */}

            <div className="col-lg-4 col-md-12">
              <div className="services-sidebar laboratory-detail">
                {/* Fast Registration Scrolling Marquee */}
                <div 
                  className="fast-registration-marquee" 
                  onClick={handleFastRegistration}
                  style={{
                    backgroundColor: "#eb268f",
                    color: "white",
                    padding: "10px 0",
                    marginBottom: "20px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    position: "relative",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#d91c7a";
                    e.target.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#eb268f";
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  <div 
                    className="marquee-text"
                    style={{
                      display: "block",
                      textAlign: "center",
                      fontSize: "16px",
                      fontWeight: "bold",
                      padding: "0 10px"
                    }}
                  >
                    🚀 Fast Purchase - Click here to register with mobile number! 🚀
                  </div>
                </div>

                <div className="services-list">
                  <div className="services-details-faq">
                    <ul className="accordion">
                      <li className="accordion-item">
                        <Link
                          className="accordion-title active"
                          onClick={toggleAccordion1}
                        >
                          {" "}
                          Location
                          {open1 ? (
                            <FiMinus className="hospital-icon" />
                          ) : (
                            <FiPlus className="hospital-icon" />
                          )}
                        </Link>
                        <Collapse in={open1}>
                          <div className="widget-area">
                            <div className="widget widget_search">
                              <form className="search-form">
                                <form className="search-form">
                                  <label>
                                    <span className="screen-reader-text"></span>
                                    <input
                                      type="search"
                                      className="search-field"
                                      placeholder="Search..."
                                      value={searchQuery}
                                      onChange={handleSearchChange}
                                    />
                                  </label>
                                  <button type="submit">
                                    <IoSearch />
                                  </button>
                                </form>
                              </form>
                              <div
                                className="row mt-3"
                                style={{
                                  maxHeight: "150px",
                                  overflowY: "auto",
                                }}
                              >
                                {filteredLocations?.map((locationpha) => (
                                  <Col
                                    sm={6}
                                    lg={window.innerWidth >= 1024 ? 12 : 6}
                                    xs={12}
                                    key={locationpha._id}
                                  >
                                    <div className="form-check">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={`city-${locationpha._id}`}
                                        value={locationpha._id}
                                        onChange={handleCityChange}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor={`city-${locationpha._id}`}
                                      >
                                        {locationpha.Name}
                                      </label>
                                    </div>
                                  </Col>
                                ))}
                                {/* Render additional labels only if showMore is true */}

                                {/* {showMore && location.map((label, index) => (
            <Hospitallable key={index} label={label} size="6" />
          ))}
                
                {showMore ? (
        <Link onClick={toggleShowMore} className='view-more'>View Less</Link>
      ) : (
        <Link onClick={toggleShowMore} className='view-more'>View More</Link>
      )} */}
                              </div>
                            </div>
                          </div>
                        </Collapse>
                      </li>
                      <li className="accordion-item">
                        <Link
                          className="accordion-title"
                          onClick={toggleAccordion1}
                        >
                          Areas{" "}
                          {open1 ? (
                            <FiMinus className="hospital-icon" />
                          ) : (
                            <FiPlus className="hospital-icon" />
                          )}
                        </Link>
                        <Collapse in={open1}>
                          <div className="widget-area">
                            <div className="widget widget_search">
                              <div className="mt-3">
                                {/* Display the areas */}

                                <form className="search-form">
                                  <label>
                                    <span className="screen-reader-text"></span>
                                    <input
                                      type="search"
                                      className="search-field"
                                      placeholder="Search..."
                                      value={areaSearchQuery}
                                      onChange={handleAreaSearchChange}
                                    />
                                  </label>
                                  <button type="submit">
                                    <IoSearch />
                                  </button>
                                </form>
                                {selectedCities.length === 0 ? (
                                  <p>Please Select City</p>
                                ) : areas?.length > 0 ? (
                                  <div
                                    className="row mt-3"
                                    style={{
                                      maxHeight: "150px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    {areas
                                      .slice()
                                      .sort((a, b) => a.localeCompare(b))
                                      .map((area, index) => (
                                        <Col
                                          xs={12}
                                          sm={6}
                                          md={6}
                                          lg={
                                            window.innerWidth >= 1024 ? 12 : 6
                                          }
                                          key={index} // Use index as key since areas are strings
                                        >
                                          <div className="form-check">
                                            <input
                                              type="checkbox"
                                              className="form-check-input"
                                              id={`area-${index}`}
                                              value={area}
                                              checked={selectedAreas.includes(
                                                area
                                              )} // Ensure checkbox reflects selected state
                                              onChange={(e) =>
                                                handleCheckboxChangearea(
                                                  area,
                                                  e.target.checked
                                                )
                                              }
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor={`area-${index}`}
                                            >
                                              {area}
                                            </label>
                                          </div>
                                        </Col>
                                      ))}
                                  </div>
                                ) : (
                                  <p>No records found</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </Collapse>
                      </li>
                      {/* <li className="accordion-item">
          <Link className="accordion-title" onClick={toggleAccordion2}> Pharmacy Name{open2 ? <FiMinus className='hospital-icon' /> : <FiPlus className='hospital-icon' />}</Link>
            <Collapse in={open2}>
             <div className="widget-area">
      <div className="widget widget_search">
        <form className="search-form">
          <label>
            <span className="screen-reader-text">Search Pharmacies</span>
            <input
              type="search"
              className="search-field"
              placeholder="Search..."
              
              onChange={handleInputChange}
            />
          </label>
        </form>
        <div className="row mt-3" style={{ maxHeight: '150px', overflowY: 'auto' }}>
          {filteredLabs?.map((labo) => (
            <Col lg={12} md={12} xs={12} key={labo._id}>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`lab-checkbox-${labo.id}`}
                  checked={selectedLabs.some(lab => lab._id === labo._id)}
                  onChange={(e) => handleCheckboxChange(e, labo)}
                />
                <label className="form-check-label" htmlFor={`lab-checkbox-${labo.id}`}>
                  {labo.PharmacyName}
                </label>
              </div>
            </Col>
          ))}
        </div>
      </div>
    </div>
            </Collapse>
          </li> */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* secound section start */}
            <div className="col-lg-8 col-md-12">
              {/* Check if there are any selected labs */}
              {selectedLabs.length > 0 ? (
                <div className="selected-labs">
                  {selectedLabs.map((lab, index) => (
                    <Pharmacysec
                      key={`${lab._id}-${index}`}
                      hospitalimage={`${process.env.REACT_APP_API_URL_GRACELAB}/${lab.Pharmacyphoto}`}
                      mainheading={lab.PharmacyName}
                      headings={lab.address}
                      starttime1={lab.PharmacyStartTime1}
                      endtime1={lab.PharmacyEndTime1}
                      starttime2={lab.PharmacyStartTime2}
                      endtime2={lab.PharmacyEndTime2}
                      starttime3={lab.PharmacyStartTime3}
                      endtime3={lab.PharmacyEndTime3}
                      dayslab1={lab.DaysPharmacy1}
                      dayslab2={lab.DaysPharmacy2}
                      dayslab3={lab.DaysPharmacy3}
                      locationmap={lab.Location}
                      imagelink={lab.website}
                      Labid={lab._id}
                      averageRating={lab.averageRating}
                    />
                  ))}
                </div>
              ) : (
                <div className="all-labs">
                  {/* Search form */}
                  <div className="widget-area">
                    <div className="widget widget_search">
                      <form className="search-form">
                        <label>
                          <span className="screen-reader-text"></span>
                          <input
                            type="search"
                            className="search-field"
                            placeholder="Search Pharmacy..."
                            onChange={handleInputChange} // Trigger the search input change
                          />
                        </label>
                        <button type="submit">
                          <IoSearch />
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Display the labs for the current page */}
                  {currentLabs.map((lab, index) => (
                    <Pharmacysec
                      key={`${lab._id}-${index}`}
                      hospitalimage={`${process.env.REACT_APP_API_URL_GRACELAB}/${lab.Pharmacyphoto}`}
                      mainheading={lab.PharmacyName}
                      headings={lab.address}
                      starttime1={lab.PharmacyStartTime1}
                      endtime1={lab.PharmacyEndTime1}
                      starttime2={lab.PharmacyStartTime2}
                      endtime2={lab.PharmacyEndTime2}
                      starttime3={lab.PharmacyStartTime3}
                      endtime3={lab.PharmacyEndTime3}
                      dayslab1={lab.DaysPharmacy1}
                      dayslab2={lab.DaysPharmacy2}
                      dayslab3={lab.DaysPharmacy3}
                      locationmap={lab.Location}
                      imagelink={lab.website}
                      Labid={lab._id}
                      averageRating={lab.averageRating}
                    />
                  ))}

                  {/* Pagination Controls */}

                  <div className="pagination">
                    <button
                      className="page-arrow"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1} // Disable if on the first page
                    >
                      <IoIosArrowBack />
                    </button>

                    {/* Generate the page numbers */}
                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                      .slice(
                        Math.max(0, currentPage - 3),
                        Math.min(totalPages, currentPage + 2)
                      )
                      .map((pageNumber) => (
                        <button
                          key={pageNumber}
                          className={`page-button ${
                            currentPage === pageNumber ? "active" : ""
                          }`}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      ))}

                    <button
                      className="page-arrow"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages} // Disable if on the last page
                    >
                      <IoIosArrowForward />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Pharmacy;
