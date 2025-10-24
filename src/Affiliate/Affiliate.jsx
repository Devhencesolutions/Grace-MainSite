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
import AffiliateSec from "./AffiliateSec";

function Affiliate() {
  const [affiliatelist, setaffiliatelist] = useState([]);
  const [Affiliatelocation, setAffiliatelocation] = useState(null);
  const [pharmacylaballlist, setpharmacylaballlist] = useState([]);
  const [AffiliateList, setAffiliateList] = useState([]);
  const [businessCategories, setBusinessCategories] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedBusinessCategories, setSelectedBusinessCategories] = useState(
    []
  );
  const [hospitalad, setHospitalad] = useState(null);
  const [advertisement, setadvertisement] = useState(null);

  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPharmacies, setFilteredPharmacies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm1, setSearchTerm1] = useState("");
  const userNameFromCookies = Cookies.get("PatientName");
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const filteredAffiliate = AffiliateList?.filter(
    (lab) =>
      lab.buisnessName?.toLowerCase().includes(query.toLowerCase()) ||
      lab.address?.toLowerCase().includes(query.toLowerCase())
  );
  const [advertisementImages, setAdvertisementImages] = useState([]);

  const totalPages = Math.ceil(filteredAffiliate.length / itemsPerPage);
  const currentAffiliate = filteredAffiliate.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // console.log("aff", currentAffiliate);

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
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/listAffiliateByCity`,
          {
            skip: skip,
            per_page: perPage,
            sorton: column,
            sortdir: sortDirection,
            match: {
              City: selectedCities.length > 0 ? selectedCities : undefined,
              buisnessCategory:
                selectedBusinessCategories.length > 0
                  ? selectedBusinessCategories
                  : undefined,
            },
            isActive: filter,
          }
        );

        // Assuming the response contains an array of laboratories
        const laboratories = response;

        setAffiliateList(response.data);
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
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/listAffiliateByCity`,
          {
            skip: skip,
            per_page: 10000,
            sorton: column,
            sortdir: sortDirection,
            match: {
              City: selectedCities,
              buisnessCategory: selectedBusinessCategories,
            },
            isActive: filter,
          }
        );
        console.log(response);
        // Assuming the response contains an array of laboratories
        const laboratories = response.data[0];

        const labdata = laboratories.data;

        const activeLaboratories = labdata.filter((lab) => lab.isActive);
        // console.log("22", activeLaboratories);

        setaffiliatelist(activeLaboratories);
      } catch (error) {
        console.error("Error fetching laboratories:", error);
      }
    };

    const Affiliatelocation = async () => {
      try {
        const locationp = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/location/city`
        );
        // console.log("cityy", locationp)
        // const Affiliatelocation = locationp.data.filter(
        //   (Affiliatelocationfetch) => Affiliatelocationfetch.IsActive
        // );
        setAffiliatelocation(locationp.data);
      } catch (error) {
        console.log("Error :", error);
      }
    };
    Affiliatelocation();

    const AffiliateBusinessCategories = async () => {
      try {
        const bcats = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/BuisnessCategory`
        );
        const bcategories = bcats.data.filter((bcats) => bcats.IsActive);
        setBusinessCategories(bcategories);
        // console.log("bcatsssssssssssssssssssssssss", bcategories);
      } catch (error) {
        console.log("Error :", error);
      }
    };
    AffiliateBusinessCategories();
  }, [query, selectedCities, selectedBusinessCategories]);

  useEffect(() => {
    setFilteredPharmacies(affiliatelist); // Initialize filtered list with full list on component mount
  }, [affiliatelist]);

  // const handleCityChange = (event) => {
  //   const { value, checked } = event.target;
  //   if (checked) {
  //     setSelectedCities([...selectedCities, value]);
  //   } else {
  //     setSelectedCities(selectedCities.filter((city) => city !== value));
  //   }

  //   setAffiliateList([]);
  //   // setCurrentPage(1);
  // };
  const [areas, setAreas] = useState([]); // State to store areas
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [allAreas, setAllAreas] = useState([]); // State for the original list of areas

  const fetchAreas = async (cityId, updatedAreas) => {
    try {
      // console.log("selectedCities", selectedCities);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/listarea/affiliate`,
        { cityId: selectedCities }
      );
      setAllAreas(response.data.AffiliateArea);
      setAreas(response.data.AffiliateArea); // Update the areas state with the fetched data
      // console.log("preyash", response);
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
    // console.log("Updated selected areas:", updatedAreas);
    setSelectedAreas(updatedAreas);

    // Fetch areas based on the updated selected areas
    await fetchLocations(updatedAreas);
  };
  const fetchLocations = async (updatedAreas) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL_GRACELAB;

      const response = await axios.post(
        `${apiUrl}/api/auth/listAffiliateByCity`,
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

      // console.log("API Response:", response.data); // Log API response

      // Check if response contains expected data
      if (response.data && response.data.PharmacyArea) {
        // console.log("Doctor Areas:", response.data.PharmacyArea);
        setAreas(response.data.PharmacyArea); // Set areas from API response
        setAffiliateList(response.data);
        setAllAreas(response.data.PharmacyArea);
      } else {
        console.log("No valid data found");
        setAffiliateList(response.data);
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };
  const handleCityChange = (event) => {
    const { value, checked } = event.target;
    // console.log('click', value);

    if (checked) {
      const updatedAreas = [...selectedAreas, value];
      // console.log(updatedAreas);
      setSelectedCities([...selectedCities, value]);
      // fetchAreas(updatedAreas); // Fetch areas based on the selected city ID
    } else {
      setSelectedCities(selectedCities.filter((city) => city !== value));
      setAreas([]); // Clear areas if no city is selected
      setAllAreas([]);
    }
    setAffiliateList([]);
  };
  const handleCatChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      const updatedCategories = [...selectedBusinessCategories, value];
      setSelectedBusinessCategories(updatedCategories);
      const lastCheckedTest = updatedCategories[updatedCategories.length - 1];
      console.log(value);
      console.log(adsData);
      // Find an ad that matches the last checked test
      const matchedAd = adsData.find((ad) => ad.AffiliateSpeciality === value);
      console.log("[[", matchedAd);
      if (matchedAd) {
        // Set the advertisement image path based on the matched ad
        const imagePath = matchedAd.CustomAdsImage;
        setHospitalad(imagePath);
      } else {
        setHospitalad(""); // Set to empty string or default image path
      }
    } else {
      setSelectedBusinessCategories(
        selectedBusinessCategories.filter((cat) => cat !== value)
      );
    }
    setAffiliateList([]);
  };

  useEffect(() => {
    fetchAreas(selectedCities);
  }, [selectedCities]);
  const handleInputChange = (e) => {
    // console.log(e.target.value);
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
    Affiliatelocation?.filter((city) =>
      city.Name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const filteredCategories =
    businessCategories?.filter((x) =>
      x.Name.toLowerCase().includes(searchTerm1.toLowerCase())
    ) || [];

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchTerm1 = (e) => {
    setSearchTerm1(e.target.value);
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
    const filtered = affiliatelist.filter(
      (pharmacy) =>
        pharmacy.PharmacyName.toLowerCase().includes(
          searchTerm.toLowerCase()
        ) || pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPharmacies(filtered);
  }, [searchTerm, affiliatelist]);

  useEffect(() => {
    // Filter pharmacies whenever query changes
    const filtered = affiliatelist.filter((pharmacy) =>
      pharmacy.PharmacyName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPharmacies(filtered);
  }, [query, affiliatelist]);

  const [areaSearchQuery, setAreaSearchQuery] = useState(""); // New state for the area search

  const handleAreaSearchChange = (event) => {
    const searchQuery2 = event.target.value;
    setAreaSearchQuery(searchQuery2);
    // console.log(searchQuery2);
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
  const [adsData, setAdsData] = useState([]);

  const fetchAdsData = async (adType = "Affiliate") => {
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
        setAdsData(adsData);
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };
  useEffect(() => {
    fetchAdsData();
  }, []);

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

      <Modalnavigationbar navigatelink="/affiliate-login" />
      {/* <div className="text-end stored-name">
        {userNameFromCookies ? (
          <span className="patient-name">Welcome {userNameFromCookies}</span>
        ) : null}
      </div> */}
      <div className="page-title-area">
        <Pagetitle
          heading="AFFILIATE"
          pagetitlelink="/affiliate-signup"
          title1="Home"
          title2="Network"
          registrationTitle="Affiliate Registration"
          IconComponent={MdArrowForwardIos}
        />
      </div>

      {/* section start */}

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
            {/* left side section start */}

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
                                  <button
                                    type="button"
                                    onChange={handleAreaSearchChange}
                                  >
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
                          className="accordion-title active"
                          onClick={toggleAccordion2}
                          style={{ backgroundColor: "#eb268f" }}
                        >
                          {" "}
                          Business Category
                          {open2 ? (
                            <FiMinus className="hospital-icon" />
                          ) : (
                            <FiPlus className="hospital-icon" />
                          )}
                        </Link>
                        <Collapse in={open2}>
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
                                      value={searchTerm1}
                                      onChange={handleSearchTerm1}
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
                                {filteredCategories?.map((locationpha) => (
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
                                        onChange={handleCatChange}
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

            {/* secound section start */}
            <div className="col-lg-8 col-md-12">
              {/* Check if there are any selected labs */}
              {selectedLabs.length > 0 ? (
                <div className="selected-labs">
                  {selectedLabs.map((lab, index) => (
                    <AffiliateSec
                      key={`${lab._id}-${index}`}
                      bannerImage={`${process.env.REACT_APP_API_URL_GRACELAB}/${lab.bannerImage}`}
                      mainheading={lab.buisnessName}
                      headings={lab.address}
                      buisnessCategoryDetails={lab.buisnessCategoryDetails}
                      contact={lab.contactNo}
                      email={lab.email}
                      city={lab.cityDetail}
                      area={lab.area}
                      affiliateId={lab._id}
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
                            placeholder="Search Affiliate..."
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
                  {currentAffiliate.map((lab, index) => (
                    <AffiliateSec
                      key={`${lab._id}-${index}`}
                      bannerImage={`${process.env.REACT_APP_API_URL_GRACELAB}/${lab.bannerImage}`}
                      mainheading={lab.buisnessName}
                      headings={lab.address}
                      buisnessCategoryDetails={lab.buisnessCategoryDetails}
                      discount={lab.conversionRatio}
                      points={lab.points}
                      contact={lab.contactNo}
                      email={lab.email}
                      city={lab.cityDetail}
                      area={lab.area}
                      affiliateId={lab._id}
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

export default Affiliate;
