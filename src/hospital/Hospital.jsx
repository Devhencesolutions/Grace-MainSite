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
import placeholder from "../img/placeholder-banner-panel.png";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import Pagetitle from "../patients/Pagetitle";
import Hospitaldesc from "./Hospitaldesc";

function Hospital() {
  const [open1, setOpen1] = useState(true);
  const [open2, setOpen2] = useState(true);
  const [open3, setOpen3] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [hospitalshowMore, hospitalsetShowMore] = useState(false);
  const [specialityshowMore, specialitysetShowMore] = useState(false);
  const [location, setlocation] = useState(null);
  const [doctorspecialist, setdoctorspecialist] = useState(null);
  const [symptomwise, setsymptomwise] = useState(null);
  const [hospitalalllist, sethospitalalllist] = useState(null);
  const [query, setQuery] = useState("");
  const [hospitalallparms, sethospitalallparms] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [hospitalName, sethospitalName] = useState([]);
  const [adsData, setAdsData] = useState([]);
  const [hospitalad, setHospitalad] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [specilitysearchQuery, specilitysetSearchQuery] = useState("");
  const [hospitalsearchQuery, sethospitalsearchQuery] = useState("");
  const [hospitalimage, sethospitalimage] = useState(null);
  const [advertisementImages, setAdvertisementImages] = useState([]);

  const itemsPerPage = 5; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  //  const [hospitalsearchQuery, setHospitalsearchQuery] = useState(""); // Search query state
  const [loading, setLoading] = useState(true); // Track loading state
  const userNameFromCookies = Cookies.get("PatientName");

  // Filter hospitals based on the search query

  const filterespecilityhospitalname =
    hospitalalllist?.filter((city) =>
      city.HospitalName.toLowerCase().includes(
        hospitalsearchQuery.toLowerCase()
      )
    ) || [];
  const filteredHospitals = filterespecilityhospitalname?.filter(
    (hospital) =>
      hospital.HospitalName.toLowerCase().includes(
        hospitalsearchQuery.toLowerCase()
      ) ||
      hospital.address.toLowerCase().includes(hospitalsearchQuery.toLowerCase())
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredHospitals.length / itemsPerPage);

  // Get hospitals for the current page
  const currentHospitals = filteredHospitals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    const Locationfetch = async () => {
      try {
        const locationcity = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/location/city`
        );
        const docotorlocation = locationcity.data.filter(
          (doctorisactive) => doctorisactive.IsActive
        );

        setlocation(docotorlocation);
      } catch (error) {
        console.log("doctor error :", error);
      }
    };
    Locationfetch();

    const Hospitalspecilist = async () => {
      try {
        const SpecilityHoapital = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/HospitalSpeciality`
        );

        const specilityisactive = SpecilityHoapital.data.filter(
          (specialityisactive) => specialityisactive.IsActive
        );
        setdoctorspecialist(specilityisactive);
      } catch (error) {
        console.log("Hospital Speciality error  :", error);
      }
    };
    Hospitalspecilist();

    const Doctorsymptom = async () => {
      try {
        const Symptom = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api//auth/list/DiseasesSymptoms`
        );
        const symptomisactive = Symptom.data.filter(
          (symptomisactivefetch) => symptomisactivefetch.IsActive
        );
        setsymptomwise(symptomisactive);
      } catch (error) { }
    };
    Doctorsymptom();

    const Hospitalname = async () => {
      try {
        // Define parameters for pagination, sorting, and filtering
        const pageNo = 1; // Example page number
        const perPage = 1000; // Example number of items per page
        const column = "LabName"; // Example column to sort on
        const sortDirection = "asc"; // Example sort direction

        const filter = true; // Example filter for active laboratories

        const skip = (pageNo - 1) * perPage;

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list-by-params/listHospitalSpecialityBySpeciality`,
          {
            skip: skip,
            per_page: 10000,
            sorton: column,
            sortdir: sortDirection,
            match: {
              Speciality: selectedSpecialties,
              City: selectedCities,
              HospitalName: hospitalName,
            },
            isActive: filter,
          }
        );

        const Hospitallist = response;

        const hospitaldata = Hospitallist.data;

        const activeHospitals = hospitaldata.filter(
          (hospital) => hospital.isActive
        );

        sethospitalalllist(activeHospitals);
      } catch (error) {
        console.error("Error fetching laboratories:", error);
      }
    };
    Hospitalname();

    const Hospitalparms = async () => {
      try {
        // Define parameters for pagination, sorting, and filtering
        const pageNo = 1; // Example page number
        const perPage = 10; // Example number of items per page
        const column = "LabName"; // Example column to sort on
        const sortDirection = "asc"; // Example sort direction

        const filter = true; // Example filter for active laboratories

        const skip = (pageNo - 1) * perPage;

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list-by-params/listHospitalSpecialityBySpeciality`,
          {
            skip: skip,
            per_page: 10000,
            sorton: column,
            sortdir: sortDirection,
            match: {
              Speciality: selectedSpecialties,
              City: selectedCities,
              HospitalName: hospitalName,
            },
            isActive: filter,
          }
        );

        const Hospitallist = response.data[0];

        const hospitaldata = Hospitallist.data;

        const activeHospitals = hospitaldata.filter(
          (hospital) => hospital.isActive
        );

        sethospitalallparms(activeHospitals);
      } catch (error) {
        console.error("Error fetching laboratories:", error);
      }
    };
    Hospitalparms();

    const fetchAdsData = async (adType = "Hospital") => {
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
            (ad) => `${process.env.REACT_APP_API_URL_GRACELAB}/${ad.CustomAdsImage}`
          );
          setAdvertisementImages(imageUrls);
          setAdsData(adsData);
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };
    fetchAdsData();

    const Hospitaladimage = async () => {
      try {
        // Define parameters for pagination, sorting, and filtering
        const pageNo = 1; // Example page number
        const perPage = 10; // Example number of items per page
        const column = "LabName"; // Example column to sort on
        const sortDirection = "asc"; // Example sort direction

        const filter = true; // Example filter for active laboratories

        const skip = (pageNo - 1) * perPage;

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list-by-params/listCustomizeAdvertisementByHospitalSpeciality`,
          {
            skip: 0,
            per_page: 1000,
            sorton: "createdAt",
            sortdir: "desc",
            match: {
              Speciality: selectedSpecialties,
            },
            IsActive: true,
          }
        );

        const Hospitallist = response;
      } catch (error) {
        console.error("Error fetching laboratories:", error);
      }
    };
    Hospitaladimage();
  }, [query, selectedSpecialties, selectedCities, hospitalName]);

  useEffect(() => {
    const Hospitaladimage = async () => {
      try {
        // Define parameters for pagination, sorting, and filtering
        const pageNo = 1; // Example page number
        const perPage = 1000; // Example number of items per page
        const column = "LabName"; // Example column to sort on
        const sortDirection = "asc"; // Example sort direction

        const filter = true; // Example filter for active laboratories

        const skip = (pageNo - 1) * perPage;

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list-by-params/listCustomizeAdvertisementByHospitalSpeciality`,
          {
            skip: 0,
            per_page: 1000,
            sorton: "createdAt",
            sortdir: "desc",
            match: {
              Speciality: selectedSpecialties,
            },
            IsActive: true,
          }
        );

        const hospitalimage = response.data[0].data[0].CustomAdsImage;

        sethospitalimage(
          `${process.env.REACT_APP_API_URL_GRACELAB}/${hospitalimage}`
        );
      } catch (error) {
        console.error("Error fetching laboratories:", error);
      }
    };
    Hospitaladimage();
  }, []);

  const handleSpecialtyChange = (event) => {
    const { value, checked } = event.target;

    // Create a copy of selectedSpecialties
    let newSelectedSpecialties = [...selectedSpecialties];

    if (checked) {
      // Add value to newSelectedSpecialties if checked
      newSelectedSpecialties.push(value);
    } else {
      // Remove value from newSelectedSpecialties if unchecked
      newSelectedSpecialties = newSelectedSpecialties.filter(
        (specialty) => specialty !== value
      );
    }

    // Update the state with newSelectedSpecialties
    setSelectedSpecialties(newSelectedSpecialties);

    // Find the last checked specialty
    const lastCheckedSpecialty =
      newSelectedSpecialties[newSelectedSpecialties.length - 1];

    // Find an ad that matches the last checked specialty
    const matchedAd = adsData.find(
      (ad) => ad.HospitalSpeciality === lastCheckedSpecialty
    );

    if (matchedAd) {
      // Set the advertisement image path based on the matched ad
      const imagePath = matchedAd.CustomAdsImage;
      setHospitalad(imagePath);
    } else {
      setHospitalad(""); // Set to empty string or default image path
    }
  };

  // const handleCityChange = (event) => {
  //   const { value, checked } = event.target;
  //   if (checked) {
  //     setSelectedCities([...selectedCities, value]);
  //   } else {
  //     setSelectedCities(selectedCities.filter((city) => city !== value));
  //   }
  // };
  const [areas, setAreas] = useState([]); // State to store areas
  const [selectedAreas, setSelectedAreas] = useState([]);

  const fetchAreas = async (cityId, updatedAreas) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/listarea/Hospital/${cityId}`
      );
      setAreas(response.data.HospitalAreas); // Update the areas state with the fetched data
      console.log("preyash", response);
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
        `${apiUrl}/api/auth/list-by-params/listHospitalSpecialityBySpeciality`,
        {
          skip: 0,
          per_page: 10000,
          sorton: "",
          sortdir: "",
          match: {
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
        sethospitalalllist(response.data);
      } else {
        console.log("No valid data found");
        sethospitalalllist(response.data);
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
    }
    sethospitalalllist([]);

  };
  const filteredLocations =
    location?.filter((city) =>
      city.Name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterespecility =
    doctorspecialist?.filter((city) =>
      city.Speciality.toLowerCase().includes(specilitysearchQuery.toLowerCase())
    ) || [];

  const handlespeciality = (event) => {
    specilitysetSearchQuery(event.target.value);
  };

  const handleHospitalnameChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      sethospitalName([...hospitalName, value]);
    } else {
      sethospitalName(
        hospitalName.filter((HospitalName) => HospitalName !== value)
      );
    }
  };

  const toggleShowMore = (event) => {
    event.preventDefault();
    setShowMore(!showMore);
  };
  const hospitaltoggleShowMore = (event) => {
    event.preventDefault();
    hospitalsetShowMore(!hospitalshowMore);
  };
  const specialitytoggleShowMore = (event) => {
    event.preventDefault();
    specialitysetShowMore(!specialityshowMore);
  };

  // const handlespecialityhospitalname = (event) => {
  //   hospitalsetSearchQuery(event.target.value);
  // };
  const toggleAccordion1 = (event) => {
    event.preventDefault();
    setOpen1(!open1);
  };
  const toggleAccordion2 = (event) => {
    event.preventDefault();
    setOpen2(!open2);
  };
  const toggleAccordion3 = (event) => {
    event.preventDefault();
    setOpen3(!open3);
  };
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
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
                to="mailto:info@gracemedicalservices.in"
                className="d-flex align-items-center text-white text-decoration-none"
              >
                <IoIosMail className="location" style={{ fontSize: 20 }} />
                <p className="mb-0 ms-2 text-white">bharat.gracemedicalservices@gmail.com</p>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
      <Modalnavigationbar navigatelink="/hospital-login" />

      {/* <div className="text-end stored-name">
        {userNameFromCookies ? (
          <span className="patient-name">Welcome {userNameFromCookies}</span>
        ) : null}
      </div> */}
      <div className="page-title-area">
        <Pagetitle
          heading="HOSPITAL"
          pagetitlelink="/hospital-signup"
          title1="Home"
          title2="Network"
          registrationTitle="Hospital Registration"
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
          </Row>
        </Container>
      </section>

      <section className="services-details-area ptb-50 main-laboratory-section">
        <Container>
          <Row>
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
                                <button type="submit">
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
                                {selectedCities.length === 0 ? (
                                  <p>Please Select City</p>
                                ) :
                                areas?.length > 0 ? (
                                  <div
                                    className="row mt-3"
                                    style={{
                                      maxHeight: "150px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    {areas
                                    .slice()
                                    .sort((a,b) => a.localeCompare(b))
                                    .map((area, index) => (
                                      <Col
                                        xs={12}
                                        sm={6}
                                        md={6}
                                        lg={window.innerWidth >= 1024 ? 12 : 6}
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
                          Speciality{" "}
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
                                    value={specilitysearchQuery}
                                    onChange={handlespeciality}
                                  />
                                </label>
                                <button type="submit">
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
                                {filterespecility?.map((specialty) => (
                                  <Col
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={window.innerWidth >= 1024 ? 12 : 6}
                                    key={specialty._id}
                                  >
                                    <div className="form-check">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={specialty._id}
                                        value={specialty._id}
                                        checked={selectedSpecialties.includes(
                                          specialty._id
                                        )}
                                        onChange={handleSpecialtyChange}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor={specialty._id}
                                      >
                                        {specialty.Speciality}
                                      </label>
                                    </div>
                                  </Col>
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
              {selectedLabs.length > 0 ? (
                <div className="selected-labs">
                  {selectedLabs.map((hospital, index) => (
                    <Hospitaldesc
                      key={`${hospital._id}-${index}`}
                      hospitalimage={`${process.env.REACT_APP_API_URL_GRACELAB}/${hospital.Hospitalphoto}`}
                      mainheading={hospital.HospitalName}
                      headings={hospital.address}
                      discount={hospital.Discount}
                      starttime1={hospital.OPD1StartTime}
                      endtime1={hospital.OPD1EndTime}
                      starttime2={hospital.OPD2StartTime}
                      endtime2={hospital.OPD2EndTime}
                      starttime3={hospital.OPD3StartTime}
                      endtime3={hospital.OPD3EndTime}
                      dayslab1={hospital.DaysHospital1}
                      dayslab2={hospital.DaysHospital2}
                      dayslab3={hospital.DaysHospital3}
                      locationmap={hospital.Location}
                      imagelink={hospital.website}
                      Labid={hospital._id}
                      averageRating={hospital.averageRating}
                      SpecialityDetails={hospital.SpecialityDetails}
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
                            placeholder="Search Hospital..."
                            value={hospitalsearchQuery}
                            onChange={(e) =>
                              sethospitalsearchQuery(e.target.value)
                            }
                          />
                        </label>
                        <button type="submit">
                          <IoSearch />
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Display the hospitals for the current page */}
                  {currentHospitals.map((hospital, index) => (
                    <Hospitaldesc
                      key={`${hospital._id}-${index}`}
                      hospitalimage={`${process.env.REACT_APP_API_URL_GRACELAB}/${hospital.Hospitalphoto}`}
                      mainheading={hospital.HospitalName}
                      headings={hospital.address}
                      discount={hospital.Discount}
                      starttime1={hospital.OPD1StartTime}
                      endtime1={hospital.OPD1EndTime}
                      starttime2={hospital.OPD2StartTime}
                      endtime2={hospital.OPD2EndTime}
                      starttime3={hospital.OPD3StartTime}
                      endtime3={hospital.OPD3EndTime}
                      dayslab1={hospital.DaysHospital1}
                      dayslab2={hospital.DaysHospital2}
                      dayslab3={hospital.DaysHospital3}
                      locationmap={hospital.Location}
                      imagelink={hospital.website}
                      Labid={hospital._id}
                      averageRating={hospital.averageRating}
                      discInfo={hospital.discInfo}
                      SpecialityDetails={hospital.SpecialityDetails}
                      
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

                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index + 1}
                        className={`page-button ${currentPage === index + 1 ? "active" : ""
                          }`}
                        onClick={() => handlePageChange(index + 1)} // Change page when clicked
                      >
                        {index + 1}
                      </button>
                    ))}

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

export default Hospital;
