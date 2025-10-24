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
import ProductSlider from "../E-Commerce/SampleProducts";
import placeholder from "../img/placeholder-banner-panel.png";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import Pagetitle from "../patients/Pagetitle";
import Doctordes from "./Doctordes";

function Doctor() {
  const [open1, setOpen1] = useState(true);
  const [open2, setOpen2] = useState(true);
  const [open3, setOpen3] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [areaSearchQuery, setAreaSearchQuery] = useState(""); // New state for the area search

  const [symtomsearchQuery, setsymtomSearchQuery] = useState("");
  const [open4, setOpen4] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [hospitalshowMore, hospitalsetShowMore] = useState(false);
  const [specialityshowMore, specialitysetShowMore] = useState(false);
  const [symptomshowMore, symptomsetShowMore] = useState(false);
  const [location, setlocation] = useState(null);
  const [doctorspecialist, setdoctorspecialist] = useState(null);
  const [symptomwise, setsymptomwise] = useState(null);
  const [doctorlist, setdoctorlist] = useState([]);
  const [DoctorAllList, setDoctorAllList] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedsymtoms, setSelectedsymtoms] = useState([]);
  const [adsData, setAdsData] = useState([]);
  const [hospitalad, setHospitalad] = useState(null);
  const [filteredDoctorslab, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specilitysearchQuery, specilitysetSearchQuery] = useState("");
  const [doctorad, setdoctorad] = useState(null);
  const itemsPerPage = 5; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [doctorSearchQuery, setDoctorSearchQuery] = useState(""); // Search query state
  const [loading, setLoading] = useState(true); // Track loading state
  const [advertisementImages, setAdvertisementImages] = useState([]);

  // Filter doctors based on the search query
  const filteredDoctors = doctorlist?.filter(
    (doc) =>
      doc.DoctorName.toLowerCase().includes(doctorSearchQuery.toLowerCase()) ||
      doc.address.toLowerCase().includes(doctorSearchQuery.toLowerCase())
  );

  const userNameFromCookies = Cookies.get("PatientName");

  // Calculate total pages
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);

  // Get doctors for the current page
  const currentDoctors = filteredDoctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setFilteredDoctors(doctorlist); // Initialize filtered list with full list on component mount
  }, [doctorlist]);

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

    const Doctorspecilist = async () => {
      try {
        const Specilitydoctor = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/DoctorSpeciality`
        );

        const specilityisactive = Specilitydoctor.data.filter(
          (specialityisactive) => specialityisactive.IsActive
        );
        setdoctorspecialist(specilityisactive);
      } catch (error) {
        console.log("Doctor Speciality error  :", error);
      }
    };
    Doctorspecilist();

    const Doctorlistall = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/listDoctorsBySpeciality`,
          {
            skip: 0,
            per_page: 10000,
            sorton: "DoctorName",
            sortdir: "asc",
            match: {
              Speciality: selectedSpecialties,
              City: selectedCities.length > 0 ? selectedCities : undefined,
              DiseasesSymptoms: selectedsymtoms,
              area: selectedAreas.length > 0 ? selectedAreas : undefined, // Area-wise filtering in API
            },
            isActive: true,
          }
        );

        // Filter doctors further on the frontend based on selectedAreas (if needed)
        const filteredDoctors = response.data.filter((doctor) =>
          selectedAreas.length > 0
            ? selectedAreas.includes(doctor.area.trim())
            : true
        );

        // Set the filtered list to state
        setdoctorlist(filteredDoctors);
        console.log("filter doctors", filteredDoctors);
      } catch (error) {
        console.log("Symptom wise data error: ", error);
      }
    };

    Doctorlistall();

    const Doctorlist = async () => {
      try {
        const pageNo = 1;
        const perPage = 1000;
        const column = "DoctorName";
        const sortDirection = "asc";
        const filter = true;
        const skip = (pageNo - 1) * perPage;

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/listDoctorsBySpeciality`,
          {
            skip: skip,
            per_page: perPage,
            sorton: column,
            sortdir: sortDirection,
            match: {
              Speciality:
                selectedSpecialties.length > 0
                  ? selectedSpecialties
                  : undefined,
              City: selectedCities.length > 0 ? selectedCities : undefined,
              DiseasesSymptoms:
                selectedsymtoms.length > 0 ? selectedsymtoms : undefined,
              area: selectedAreas.length > 0 ? selectedAreas : undefined, // Area-wise filtering in API
            },
            isActive: filter,
          }
        );

        const laboratories = response.data[0];
        const labdata = laboratories.data;
        const activeLaboratories = labdata?.filter((lab) => lab.isActive);
        setDoctorAllList(activeLaboratories);
      } catch (error) {
        console.error("Error fetching laboratories:", error);
      }
    };
    Doctorlist();

    const Doctorsymtoms = async () => {
      try {
        const Doctorsymtoms = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/DiseasesSymptoms`
        );

        const specilityisactive = Doctorsymtoms.data.filter(
          (specialityisactive) => specialityisactive.IsActive
        );
        setsymptomwise(specilityisactive);
      } catch (error) {
        console.log("doctor symtoms  :", error);
      }
    };
    Doctorsymtoms();

    const fetchAdsData = async (adType = "Doctor") => {
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
    fetchAdsData();

    const Doctoradimage = async () => {
      try {
        // Define parameters for pagination, sorting, and filtering
        const pageNo = 1; // Example page number
        const perPage = 1000; // Example number of items per page
        const column = "LabName"; // Example column to sort on
        const sortDirection = "asc"; // Example sort direction

        const filter = true; // Example filter for active laboratories

        const skip = (pageNo - 1) * perPage;

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list-by-params/listCustomizeAdvertisementByDoctorSpeciality`,
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

        const doctorlist = response;
      } catch (error) {
        console.error("Error fetching laboratories:", error);
      }
    };
    Doctoradimage();
  }, [query, selectedSpecialties, selectedCities, selectedsymtoms]);

  useEffect(() => {
    const Doctoradimage = async () => {
      try {
        // Define parameters for pagination, sorting, and filtering
        const pageNo = 1; // Example page number
        const perPage = 1000; // Example number of items per page
        const column = "LabName"; // Example column to sort on
        const sortDirection = "asc"; // Example sort direction

        const filter = true; // Example filter for active laboratories

        const skip = (pageNo - 1) * perPage;

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list-by-params/listCustomizeAdvertisementByDoctorSpeciality`,
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

        const doctoradimage = response.data[0].data[0].CustomAdsImage;
        setdoctorad(
          `${process.env.REACT_APP_API_URL_GRACELAB}/${doctoradimage}`
        );
      } catch (error) {
        console.error("Error fetching laboratories:", error);
      }
    };
    Doctoradimage();
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
    setdoctorlist([]);

    // Update the state with newSelectedSpecialties
    setSelectedSpecialties(newSelectedSpecialties);

    // Find the last checked specialty
    const lastCheckedSpecialty =
      newSelectedSpecialties[newSelectedSpecialties.length - 1];

    // Find an ad that matches the last checked specialty
    const matchedAd = adsData.find(
      (ad) => ad.DoctorSpeciality === lastCheckedSpecialty
    );

    if (matchedAd) {
      const imagePath = matchedAd.CustomAdsImage;
      setHospitalad(imagePath);
    } else {
      setHospitalad("");
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
    setdoctorlist([]);
  };
  const [areas, setAreas] = useState([]); // State to store areas

  const [selectedAreas, setSelectedAreas] = useState([]);

  // Fetch areas when a city is selected
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
        `${apiUrl}/api/auth/listDoctorsBySpeciality`,
        {
          skip: 0,
          per_page: 10000,
          sorton: "area",
          sortdir: "asc",
          match: {
            Speciality: selectedSpecialties,
            City: selectedCities.length > 0 ? selectedCities : undefined,
            DiseasesSymptoms: selectedsymtoms,
            area: updatedAreas.length > 0 ? updatedAreas : undefined,
          },
          isActive: true,
        }
      );

      console.log("API Response:", response.data); // Log API response

      // Check if response contains expected data
      if (response.data && response.data.DoctorArea) {
        console.log("Doctor Areas:", response.data.DoctorArea);
        setAreas(response.data.DoctorArea); // Set areas from API response
        setdoctorlist(response.data);
      } else {
        console.log("No valid data found");
        setdoctorlist(response.data);
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
      // setAreas([]); // Clear areas if an error occurs
    }
  };

  // Modify fetchAreas to accept updated selected areas
  const fetchAreas = async (cityId, updatedAreas) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/listarea/doctor/${cityId}`
      );
      setAreas(response.data.DoctorArea); // Update the areas state with the fetched data
      console.log("preyash", response);
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };

  const handlesymtomsChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedsymtoms([...selectedsymtoms, value]);
    } else {
      setSelectedsymtoms(
        selectedsymtoms.filter((symtoms) => symtoms !== value)
      );
    }
    // setdoctorlist([])
  };

  const filterespecility =
    doctorspecialist?.filter((city) =>
      city.Speciality.toLowerCase().includes(specilitysearchQuery.toLowerCase())
    ) || [];

  const handlespeciality = (event) => {
    specilitysetSearchQuery(event.target.value);
  };

  const filtersymtom =
    symptomwise?.filter((city) =>
      city.Symptom.toLowerCase().includes(symtomsearchQuery.toLowerCase())
    ) || [];

  const handlespecialitysymtom = (event) => {
    setsymtomSearchQuery(event.target.value);
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
  const symptomtoggleShowMore = (event) => {
    event.preventDefault();
    symptomsetShowMore(!symptomshowMore);
  };

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
  const toggleAccordion4 = (event) => {
    event.preventDefault();
    setOpen4(!open4);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue); // Update query state on every input change
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

  const filteredLocations =
    location?.filter((city) => {
      const isCityMatch = city.Name.toLowerCase().includes(
        searchQuery.toLowerCase()
      );
      const isAreaMatch = city.area
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      return isCityMatch || isAreaMatch; // Match either city or area
    }) || [];

  const filteredAreas = areas?.filter((area) =>
    area.toLowerCase().includes(areaSearchQuery.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAreaSearchChange = (event) => {
    setAreaSearchQuery(event.target.value); // Update the search query when typing
  };

  useEffect(() => {
    // Filter pharmacies whenever searchTerm changes
    const filtered = doctorlist.filter((doctor) =>
      doctor.DoctorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchTerm, doctorlist]);

  useEffect(() => {
    // Filter pharmacies whenever query changes
    const filtered = doctorlist?.filter((doctor) =>
      doctor.DoctorName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [query, doctorlist]);

  // const filteredDoctors = doctorlist?.filter((doctor) =>
  //   doctor.DoctorName.toLowerCase().includes(query.toLowerCase())
  // );

  const options = filteredLocations?.map((city) => ({
    value: city._id,
    label: `${city.Name} || ${city.area}`,
  }));

  const handleCitySelectChange = (selectedOptions) => {
    const selectedCities = selectedOptions.map((option) => option.value);
    // Call the same handler you used for checkboxes but now with selected values
    handleCityChange(selectedCities);
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

      <Modalnavigationbar navigatelink="/doctor-login" />

      {/* <div className="text-end stored-name">
        {userNameFromCookies ? (
          <span className="patient-name">Welcome {userNameFromCookies}</span>
        ) : null}
      </div> */}
      <div className="page-title-area">
        <Pagetitle
          heading="Doctor"
          pagetitlelink="/doctor-signup"
          title1="Home"
          title2="Network"
          registrationTitle="Doctor Registration"
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
                          Location{" "}
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
                                  <Col sm={6} lg={6} xs={12} key={city._id}>
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
                          onClick={toggleAccordion4}
                        >
                          Areas{" "}
                          {open4 ? (
                            <FiMinus className="hospital-icon" />
                          ) : (
                            <FiPlus className="hospital-icon" />
                          )}
                        </Link>
                        <Collapse in={open4}>
                          <div className="widget-area">
                            <div className="widget widget_search">
                              <div className="">
                                {/* Area Search Form */}
                                <form className="search-form">
                                  <label>
                                    <span className="screen-reader-text"></span>
                                    <input
                                      type="search"
                                      className="search-field"
                                      placeholder="Search Areas..."
                                      value={areaSearchQuery}
                                      onChange={handleAreaSearchChange} // Bind the search change function
                                    />
                                  </label>
                                  <button type="submit">
                                    <IoSearch />
                                  </button>
                                </form>

                                {/* Display the filtered areas */}
                                {selectedCities.length === 0 ? (
                                  <p>Please Select City</p>
                                ) : filteredAreas?.length > 0 ? (
                                  <div
                                    className="row mt-3"
                                    style={{
                                      maxHeight: "150px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    {filteredAreas
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
                                          key={index}
                                        >
                                          <div className="form-check">
                                            <input
                                              type="checkbox"
                                              className="form-check-input"
                                              id={`area-${index}`}
                                              value={area}
                                              checked={selectedAreas.includes(
                                                area
                                              )}
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

                      <li className="accordion-item">
                        <Link
                          className="accordion-title"
                          onClick={toggleAccordion4}
                        >
                          Symtoms{" "}
                          {open4 ? (
                            <FiMinus className="hospital-icon" />
                          ) : (
                            <FiPlus className="hospital-icon" />
                          )}
                        </Link>
                        <Collapse in={open4}>
                          <div className="widget-area">
                            <div className="widget widget_search">
                              <form className="search-form">
                                <label>
                                  <span className="screen-reader-text"></span>
                                  <input
                                    type="search"
                                    className="search-field"
                                    placeholder="Search..."
                                    value={symtomsearchQuery}
                                    onChange={handlespecialitysymtom}
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
                                {filtersymtom?.map((specialty) => (
                                  <Col
                                    xs={12}
                                    sm={6}
                                    lg={6}
                                    md={6}
                                    key={specialty._id}
                                  >
                                    <div className="form-check">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={specialty._id}
                                        value={specialty._id}
                                        checked={selectedsymtoms.includes(
                                          specialty._id
                                        )}
                                        onChange={handlesymtomsChange}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor={specialty._id}
                                      >
                                        {specialty.Symptom}
                                      </label>
                                    </div>
                                  </Col>
                                ))}

                                {/* {specialityshowMore && doctorspecialist?.map((special) => (
                          <Hospitallable label={special.Speciality} />
                        ))}
                
                {specialityshowMore ? (
        <Link onClick={specialitytoggleShowMore} className='view-more'>View Less</Link>
      ) : (
        <Link onClick={specialitytoggleShowMore} className='view-more'>View More</Link>
      )} */}
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
              {selectedLabs.length > 0 ? (
                <div className="selected-labs">
                  {selectedLabs.map((doc, index) => (
                    <Doctordes
                      key={`${doc._id}-${index}`}
                      hospitalimage={`${process.env.REACT_APP_API_URL_GRACELAB}/${doc.Doctorphoto}`}
                      mainheading={doc.DoctorName}
                      DoctorSpeciality={doc.Speciality}
                      headings={doc.address}
                      starttime1={doc.OPD1StartTime}
                      endtime1={doc.OPD1EndTime}
                      starttime2={doc.OPD2StartTime}
                      endtime2={doc.OPD2EndTime}
                      starttime3={doc.OPD3StartTime}
                      endtime3={doc.OPD3EndTime}
                      slot2start1={doc.OPD1Slot2StartTime}
                      slot2end1={doc.OPD1Slot2EndTime}
                      slot2start2={doc.OPD2Slot2StartTime}
                      slot2end2={doc.OPD2Slot2EndTime}
                      slot2start3={doc.OPD3Slot2StartTime}
                      slot2end3={doc.OPD3Slot2EndTime}
                      slot3start1={doc.OPD1Slot3StartTime}
                      slot3end1={doc.OPD1Slot3EndTime}
                      slot3start2={doc.OPD2Slot3StartTime}
                      slot3end2={doc.OPD2Slot3EndTime}
                      slot3start3={doc.OPD3Slot3StartTime}
                      slot3end3={doc.OPD3Slot3EndTime}
                      dayslab1={doc.DaysDoctor1}
                      dayslab2={doc.DaysDoctor2}
                      dayslab3={doc.DaysDoctor3}
                      locationmap={doc.Location}
                      imagelink={doc.website}
                      Labid={doc._id}
                      averageRating={doc.averageRating}
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
                            placeholder="Search Doctor..."
                            value={doctorSearchQuery}
                            onChange={(e) =>
                              setDoctorSearchQuery(e.target.value)
                            }
                          />
                        </label>
                        <button type="submit">
                          <IoSearch />
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Display the doctors for the current page */}
                  {currentDoctors.map((doc, index) => (
                    <Doctordes
                      key={`${doc._id}-${index}`}
                      hospitalimage={`${process.env.REACT_APP_API_URL_GRACELAB}/${doc.Doctorphoto}`}
                      mainheading={doc.DoctorName}
                      averageRating={doc.averageRating}
                      DoctorSpeciality={doc.Specialityname}
                      headings={doc.address}
                      slot1start1={doc.OPD1StartTime}
                      slot1end1={doc.OPD1EndTime}
                      slot1start2={doc.OPD2StartTime}
                      slot1end2={doc.OPD2EndTime}
                      slot1start3={doc.OPD3StartTime}
                      slot1end3={doc.OPD3EndTime}
                      slot2start1={doc.OPD1Slot2StartTime}
                      slot2end1={doc.OPD1Slot2EndTime}
                      slot2start2={doc.OPD2Slot2StartTime}
                      slot2end2={doc.OPD2Slot2EndTime}
                      slot2start3={doc.OPD3Slot2StartTime}
                      slot2end3={doc.OPD3Slot2EndTime}
                      slot3start1={doc.OPD1Slot3StartTime}
                      slot3end1={doc.OPD1Slot3EndTime}
                      slot3start2={doc.OPD2Slot3StartTime}
                      slot3end2={doc.OPD2Slot3EndTime}
                      slot3start3={doc.OPD3Slot3StartTime}
                      slot3end3={doc.OPD3Slot3EndTime}
                      dayslab1={doc.DaysDoctor1}
                      dayslab2={doc.DaysDoctor2}
                      dayslab3={doc.DaysDoctor3}
                      locationmap={doc.Location}
                      imagelink={doc.website}
                      Labid={doc._id}
                      fee={doc.appointmentAmount}
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
                        className={`page-button ${
                          currentPage === index + 1 ? "active" : ""
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
            <ProductSlider />
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Doctor;
