import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarker } from "react-icons/fa";

function Common() {
  return (
    <>
      <div class="review-item bg-pink treatment">
        <h3>Treatment Name</h3>
        <p className="treatment_p">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation.
        </p>
      </div>
    </>
  );
}

export { Common };

function Sterlingicon(props) {
  return (
    <>
      <div class="features-box">
        <div class="icon">
          {/* <i class="flaticon-coding"></i> */}
          {props.icons}
        </div>

        <h3>Amenity Name</h3>

        <img src={props.image} alt="image" />
      </div>
    </>
  );
}

export { Sterlingicon };

function Gallary(props) {
  return (
    <>
      <div class="col-lg-4 col-12 blocks-gallery-item">
        <img src={props.gallaryimage} alt="image" />
      </div>
    </>
  );
}

export { Gallary };

function Joinournetwork(props) {
  return (
    <>
      <div class="col-12">
        <Link to={props.joinnetworklink}>
          <div class="single-services-box text-center">
            <div class="icon">
              <img src={props.network} />
            </div>

            <h3>{props.title}</h3>
          </div>
        </Link>
      </div>
    </>
  );
}

export { Joinournetwork };

function Morehospital(props) {
  return (
    <>
      <div className="single-research-box">
        <div className="research-image">
          <a href="#">
            <img src={props.morehospitalimage} alt="image" />
          </a>
        </div>
        <div className="research-content">
          {/*<span>Oncology</span>*/}
          <h3>
            <a href="#">{props.morehospitaltitle}</a>
          </h3>
          <div className="location-marker-section">
            <h5 className="mt-3 d-inline-block me-2">
            <FaMapMarker className='map-color' /> Alkapuri
            </h5>
            <h5 className="mt-3 d-inline-block">
            <FaMapMarker className='map-color' /> Karelibaug
            </h5>
          </div>
        </div>
      </div>
    </>
  );
}

export { Morehospital };
