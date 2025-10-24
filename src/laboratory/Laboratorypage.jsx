import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Carousel, Col, Collapse, Container, Image, Row } from "react-bootstrap";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import { IoIosArrowBack, IoIosArrowForward, IoIosMail } from "react-icons/io";
import { IoCall, IoSearch } from "react-icons/io5";
import { MdArrowForwardIos } from "react-icons/md";
import { Link } from "react-router-dom";
import { Hospitallable } from "../hospital/Hospitallable";
import placeholder from "../img/placeholder-banner-panel.png";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import Pagetitle from "../patients/Pagetitle";
import Labsec from "./Labsec";

function Laboratorypage() {
  const [loc, setLoc] = useState([]);
  const [labTest, setLabTest] = useState([]);
  const [labListAll, setLabListAll] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedTest, setSelectedTest] = useState([]);
  const [open1, setOpen1] = useState(true);
  const [open2, setOpen2] = useState(true);
  const [open3, setOpen3] = useState(true);
  const [laboratoryShowMore, laboratorySetShowMore] = useState(false);
  const [popularTestShowMore, popularTestSetShowMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLabs, setSelectedLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adsData, setAdsData] = useState([]);
  const [hospitalad, setHospitalad] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuertest, setSearchQuerytest] = useState("");
  const [advertisement, setadvertisement] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5); // Initialize with 5 locations
  const [showMore, setShowMore] = useState(false); // Track whether to show more locations

  // this is show more button
  const itemsPerPage = 5; // Number of items per page

  const userNameFromCookies = Cookies.get("PatientName");
  // Declare your state variables

  // Filter labs based on the search query
  const filteredLabs = labListAll?.filter(
    (lab) =>
      lab.LabName.toLowerCase().includes(query.toLowerCase()) ||
      lab.address.toLowerCase().includes(query.toLowerCase())
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredLabs.length / itemsPerPage);

  // Get the labs for the current page
  const currentLabs = filteredLabs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [advertisementImages, setAdvertisementImages] = useState([]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/listLaborateriesByLocation`,
          {
            skip: 0,
            per_page: 10000,
            sorton: "LabName",
            sortdir: "asc",
            match: {
              City: selectedCities.length > 0 ? selectedCities : undefined,
              LabTests: selectedTest.length > 0 ? selectedTest : undefined,
            },
            isActive: true,
          }
        );
        const laboratories = response.data;
        setLabListAll(laboratories);
      } catch (error) {
        console.error("Error fetching laboratories:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLaboratoryTest = async () => {
      try {
        const test = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/getAllLabTests`
        );
        const laboratoryTest = test.data.filter(
          (laboratoryTestActive) => laboratoryTestActive.IsActive
        );
        setLabTest(laboratoryTest);
      } catch (error) {
        console.error("Error fetching laboratory tests:", error);
      }
    };

    const labLocation = async () => {
      try {
        const labt = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/location/city`
        );
        const allLabListIsActive = labt.data.filter(
          (laboratoruisActive) => laboratoruisActive.isActive
        );
        setLoc(allLabListIsActive);
      } catch (error) {
        console.error("Error fetching laboratory list:", error);
      }
    };

    // const fetchAdsData = async () => {
    //   try {
    //     const response = await axios.get(
    //       `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/customize-advertisement?type=Laboratory`
    //     );
    //     // Filter for active ads and extract image URLs
    //     const activeAds = response.data.filter((ad) => ad.IsActive);
    //     const imageUrls = activeAds.map(
    //       (ad) =>
    //         `${process.env.REACT_APP_API_URL_GRACELAB}/${ad.CustomAdsImage}`
    //     );
    //     setAdvertisementImages(imageUrls);
    //   } catch (error) {
    //     console.error("Error fetching ads:", error);
    //   }
    // };

    const fetchAdsData = async (adType = "Laboratory") => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/customize-advertisement?type=${adType}`
        );

        // Since backend now filters by type, you only need to filter for active ads
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

          // Set images for carousel
          const imageUrls = adsData.map(
            (ad) =>
              `${process.env.REACT_APP_API_URL_GRACELAB}/${ad.CustomAdsImage}`
          );

          console.log("Image URLs:", imageUrls);
          setAdvertisementImages(imageUrls); // ✅ Set carousel images
          setAdsData(adsData);
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    const Laboratoryimage = async () => {
      try {
        // Define parameters for pagination, sorting, and filtering
        const pageNo = 1; // Example page number
        const perPage = 10; // Example number of items per page
        const column = "LabName"; // Example column to sort on
        const sortDirection = "asc"; // Example sort direction

        const filter = true; // Example filter for active laboratories

        const skip = (pageNo - 1) * perPage;

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list-by-params/listCustomizeAdvertisementByLabSpeciality`,
          {
            skip: 0,
            per_page: 100,
            sorton: "createdAt",
            sortdir: "desc",
            match: {
              Speciality: selectedTest,
            },
            IsActive: true,
          }
        );

        // Assuming the response contains an array of laboratories
        const Laboratoryllist = response.data;
      } catch (error) {
        console.error("Error fetching laboratories:", error);
      }
    };

    Laboratoryimage();
    fetchAdsData("Laboratory");
    fetchData();
    fetchLaboratoryTest();
    labLocation();
  }, [selectedCities, selectedTest]);

  // useEffect(() => {
  //   const Laboratoryimage = async () => {
  //     try {
  //       // Define parameters for pagination, sorting, and filtering
  //       const pageNo = 1; // Example page number
  //       const perPage = 1000; // Example number of items per page
  //       const column = "LabName"; // Example column to sort on
  //       const sortDirection = "asc"; // Example sort direction

  //       const filter = true; // Example filter for active laboratories

  //       const skip = (pageNo - 1) * perPage;

  //       const response = await axios.post(
  //         `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list-by-params/listCustomizeAdvertisementByLabSpeciality`,
  //         {
  //           skip: 0,
  //           per_page: 1000,
  //           sorton: "createdAt",
  //           sortdir: "desc",
  //           match: {
  //             Speciality: selectedTest,
  //           },
  //           IsActive: true,
  //         }
  //       );

  //       // Assuming the response contains an array of laboratories
  //       const Adimage = response.data[0].data[0].CustomAdsImage;
  //       setadvertisement(
  //         `${process.env.REACT_APP_API_URL_GRACELAB}/${Adimage}`
  //       );
  //     } catch (error) {
  //       console.error("Error fetching laboratories:", error);
  //     }
  //   };

  //   Laboratoryimage();
  // }, []);

  // const handleCityChange = (event) => {
  //   const { value, checked } = event.target;
  //   if (checked) {
  //     setSelectedCities([...selectedCities, value]);
  //   } else {
  //     setSelectedCities(selectedCities.filter((city) => city !== value));
  //   }
  //   setLabListAll([]);
  // };

  const [areas, setAreas] = useState([]); // State to store areas
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [allAreas, setAllAreas] = useState([]); // State for the original list of areas

  const fetchAreas = async (cityId, updatedAreas) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/listarea/Lab/${cityId}`
      );
      setAllAreas(response.data.LabAreas);
      setAreas(response.data.LabAreas); // Update the areas state with the fetched data
      console.log("preyash", areas);
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
        `${apiUrl}/api/auth/listLaborateriesByLocation`,
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
      if (response.data && response.data.LabAreas) {
        console.log("Doctor Areas:", response.data.LabAreas);
        setAreas(response.data.LabAreas); // Set areas from API response
        setLabListAll(response.data);
        setAllAreas(response.data.LabAreas); // Set areas from API response
      } else {
        console.log("No valid data found");
        setLabListAll(response.data);
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
    setLabListAll([]);
  };
  const handleTestChange = (event) => {
    const { value, checked } = event.target;

    // Create a copy of selectedTest
    let newSelectedTests = [...selectedTest];

    if (checked) {
      // Add value to newSelectedTests if checked
      newSelectedTests.push(value);
    } else {
      // Remove value from newSelectedTests if unchecked
      newSelectedTests = newSelectedTests.filter((test) => test !== value);
    }

    // Update the state with newSelectedTests
    setSelectedTest(newSelectedTests);

    // Find the last checked test
    if (newSelectedTests.length > 0) {
      // Find the last checked test
      const lastCheckedTest = newSelectedTests[newSelectedTests.length - 1];

      // Find ads that match the selected tests
      const matchedAds = adsData.filter(
        (ad) =>
          newSelectedTests.includes(ad.LaboratorySpeciality) && ad.IsActive
      );

      if (matchedAds.length > 0) {
        // Set multiple images for the matched specialities
        const imageUrls = matchedAds.map(
          (ad) =>
            `${process.env.REACT_APP_API_URL_GRACELAB}/${ad.CustomAdsImage}`
        );
        setAdvertisementImages(imageUrls);
      } else {
        // No matches found, show all active Laboratory ads
        const allLabAds = adsData.filter(
          (ad) => ad.IsActive && ad.Type === "Laboratory"
        );
        const allImageUrls = allLabAds.map(
          (ad) =>
            `${process.env.REACT_APP_API_URL_GRACELAB}/${ad.CustomAdsImage}`
        );
        setAdvertisementImages(allImageUrls);
      }
    } else {
      // No tests selected, show all Laboratory ads
      const allLabAds = adsData.filter(
        (ad) => ad.IsActive && ad.Type === "Laboratory"
      );
      const allImageUrls = allLabAds.map(
        (ad) => `${process.env.REACT_APP_API_URL_GRACELAB}/${ad.CustomAdsImage}`
      );
      setAdvertisementImages(allImageUrls);
    }
  };

  const toggleAccordion1 = (event) => {
    event.preventDefault();
    setOpen1(!open1);
  };

  const toggleAccordion3 = (event) => {
    event.preventDefault();
    setOpen3(!open3);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue); // Update query state on every input change
  };

  const handleCheckboxChange = (e, labo) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedLabs([...selectedLabs, labo]);
    } else {
      setSelectedLabs(selectedLabs.filter((lab) => lab._id !== labo._id));
    }
  };

  // const filteredLabs = labListAll?.filter((lab) =>
  //   lab.LabName.toLowerCase().includes(query.toLowerCase())
  // );

  const filteredLocations =
    loc?.filter((city) =>
      city.Name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteretest =
    labTest?.filter((city) =>
      city.TestName.toLowerCase().includes(searchQuertest.toLowerCase())
    ) || [];

  const handleSearchChangetest = (event) => {
    setSearchQuerytest(event.target.value);
  };
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
      <Modalnavigationbar navigatelink="/laboratory-login" />

      {/* <div className="text-end stored-name">
        {userNameFromCookies ? (
          <span className="patient-name">Welcome {userNameFromCookies}</span>
        ) : null}
      </div> */}
      <div className="page-title-area">
        <Pagetitle
          heading="LABORATORY"
          pagetitlelink="/laboratory-login"
          title1="Home"
          title2="Network"
          registrationTitle="Laboratory Login"
          IconComponent={MdArrowForwardIos}
        />
      </div>

      <section className="services-details-area ptb-50 main-laboratory-section">
        <Container>
          <Row>
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

            <div className="col-lg-4 col-md-12">
              <div className="services-sidebar laboratory-detail">
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
                                <button>
                                  <IoSearch />
                                </button>
                              </form>
                              <div
                                className="row mt-3"
                                style={{
                                  maxHeight: "150px",
                                  overflowY: "auto",
                                }}
                              >
                                {/* {filteredLocations
                                  ?.slice(0, visibleCount)
                                  .map((city) => (
                                    <Col
                                      sm={6}
                                      lg={window.innerWidth >= 1024 ? 12 : 6}
                                      xs={12}
                                      key={city._id}
                                    >
                                      <div className="form-check">
                                        <input
                                          type="checkbox"
                                          className="form-check-input"
                                          id={`city-${city._id}`}
                                          value={city._id}
                                          onChange={handleCityChange}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor={`city-${city._id}`}
                                        >
                                          {city.Name}
                                        </label>
                                      </div>
                                    </Col>
                                  ))} */}
                                {filteredLocations?.map((city) => (
                                  <Col
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={window.innerWidth >= 1024 ? 12 : 6}
                                    key={city._id}
                                  >
                                    <div className="form-check">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={`city-${city._id}`}
                                        value={city._id}
                                        onChange={handleCityChange}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor={`city-${city._id}`}
                                      >
                                        {city.Name}
                                      </label>
                                    </div>
                                  </Col>
                                ))}
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
                      <li className="accordion-item">
                        <Link
                          className="accordion-title"
                          onClick={toggleAccordion3}
                        >
                          {" "}
                          Popular Test
                          {open3 ? (
                            <FiMinus className="hospital-icon" />
                          ) : (
                            <FiPlus className="hospital-icon" />
                          )}
                        </Link>
                        <Collapse in={open3}>
                          <div className="widget-area">
                            <div className="widget widget_search">
                              <form className="search-form">
                                <label>
                                  <span className="screen-reader-text"></span>
                                  <input
                                    type="search"
                                    className="search-field"
                                    placeholder="Search..."
                                    value={searchQuertest}
                                    onChange={handleSearchChangetest}
                                  />
                                </label>
                                <button type="submit">
                                  <IoSearch />
                                </button>
                              </form>
                              <div
                                className="row mt-3"
                                style={{
                                  maxHeight: "200px",
                                  overflowY: "auto",
                                }}
                              >
                                {filteretest?.map((laboratoryTest) => (
                                  <Col xs={6} key={laboratoryTest._id}>
                                    <div className="form-check">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={laboratoryTest._id}
                                        value={laboratoryTest._id}
                                        checked={selectedTest.includes(
                                          laboratoryTest._id
                                        )}
                                        onChange={handleTestChange}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor={laboratoryTest._id}
                                      >
                                        {laboratoryTest.TestName}
                                      </label>
                                    </div>
                                  </Col>
                                ))}
                                {popularTestShowMore &&
                                  labTest?.map((laboratoryTest) => (
                                    <Hospitallable
                                      label={laboratoryTest.TestName}
                                      size="12"
                                    />
                                  ))}
                              </div>
                            </div>
                          </div>
                        </Collapse>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8 col-md-12">
              {loading ? (
                <div>Loading...</div>
              ) : selectedLabs.length > 0 ? (
                <div className="selected-labs">
                  {selectedLabs.map((lab) => (
                    <Labsec
                      key={lab.id}
                      hospitalimage={`${process.env.REACT_APP_API_URL_GRACELAB}/${lab.Labphoto}`}
                      mainheading={lab.LabName}
                      headings={lab.address}
                      starttime1={lab.LabStartTime1}
                      endtime1={lab.LabEndTime1}
                      starttime2={lab.LabStartTime2}
                      endtime2={lab.LabEndTime2}
                      starttime3={lab.LabStartTime3}
                      endtime3={lab.LabEndTime3}
                      dayslab1={lab.DaysLab1}
                      dayslab2={lab.DaysLab2}
                      dayslab3={lab.DaysLab3}
                      locationmap={lab.Location}
                      imagelink={lab.website}
                      Labid={lab._id}
                      averageRating={lab.averageRating ? lab.averageRating : 0}
                    />
                  ))}
                </div>
              ) : (
                <div className="all-labs">
                  <div className="widget-area">
                    <div className="widget widget_search">
                      <form
                        className="search-form"
                        onSubmit={(e) => e.preventDefault()}
                      >
                        <label>
                          <span className="screen-reader-text"></span>
                          <input
                            type="search"
                            className="search-field"
                            placeholder="Search Laboratory..."
                            onChange={(e) => setQuery(e.target.value)}
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
                    <Labsec
                      key={`${lab._id}-${index}`}
                      hospitalimage={`${process.env.REACT_APP_API_URL_GRACELAB}/${lab.Labphoto}`}
                      mainheading={lab.LabName}
                      headings={lab.address}
                      starttime1={lab.LabStartTime1}
                      endtime1={lab.LabEndTime1}
                      starttime2={lab.LabStartTime2}
                      endtime2={lab.LabEndTime2}
                      starttime3={lab.LabStartTime3}
                      endtime3={lab.LabEndTime3}
                      dayslab1={lab.DaysLab1}
                      dayslab2={lab.DaysLab2}
                      dayslab3={lab.DaysLab3}
                      locationmap={lab.Location}
                      imagelink={lab.website}
                      Labid={lab._id}
                      averageRating={lab.averageRating ? lab.averageRating : 0}
                    />
                  ))}

                  {/* Pagination Controls */}
                  <div className="pagination">
                    <button
                      className="page-arrow"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1} // Disable if on the first page
                    >
                      <IoIosArrowBack /> {/* Left Arrow */}
                    </button>

                    {Array.from(
                      { length: Math.min(totalPages, 5) },
                      (_, index) => {
                        const page = index + 1; // Page numbers starting from 1

                        // Adjust page display if more than 5 pages
                        const adjustedPage =
                          totalPages > 5
                            ? Math.max(
                                1,
                                Math.min(
                                  currentPage - 2 + index,
                                  totalPages - 4 + index
                                )
                              )
                            : page;

                        if (adjustedPage > totalPages) return null; // Skip out-of-bound pages

                        return (
                          <button
                            key={adjustedPage}
                            className={`page-button ${
                              currentPage === adjustedPage ? "active" : ""
                            }`}
                            onClick={() => handlePageChange(adjustedPage)} // Change page when clicked
                          >
                            {adjustedPage}
                          </button>
                        );
                      }
                    )}

                    <button
                      className="page-arrow"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages} // Disable if on the last page
                    >
                      <IoIosArrowForward /> {/* Right Arrow */}
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

export default Laboratorypage;
