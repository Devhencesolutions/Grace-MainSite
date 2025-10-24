import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  Container,
} from "react-bootstrap";
import { RiLogoutBoxLine } from "react-icons/ri";
import network from "../img/network.jpg";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import { MdArrowForwardIos } from "react-icons/md";
import axios from "axios";
import CommonSec from "../navbar/CommonSec";
import ScrollToTop from "../scrolltop/Scrolltop";
import Cookies from "js-cookie";
import LoginComponent from "./loginComponent";
import { Tooltip } from "reactstrap";
import { BsGlobe2 } from "react-icons/bs";
import Pagetitle from "./Pagetitle";

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
} from "reactstrap";

function AssociatesList() {
     const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [associateDetail, setAssociateDetail] = useState({
    name: "",
    email: "",
    _id: ""
  })
  const [modal_list, setmodal_list] = useState(false);
  const [values, setValues] = useState({
    associateId: "",
    loyaltyPointTransaction: 0,
    isApproved: false,
    approvedTime: "",
    remarks: "",
    amount: ""
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const {
    remarks,
    amount
  } = values;


  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [temp, setshowModalappoitment] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggleTooltip = () => {
    setTooltipOpen(!tooltipOpen);
  };

  useEffect(()=>{
    let userEmail = Cookies.get("associateEmail");
    let userName = Cookies.get("associateName");
    let userId = Cookies.get("associateId");
    setAssociateDetail({
      name: userName,
      email: userEmail,
      _id: userId
    })
    if(!userName)
    {
        navigate("/associates-login")
    }
    else
    {
      getdata(userId);
      getAssociate(userId);
    }

  },[]);

  const getdata=(userId)=>{
    axios.get(
      `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/getAssociateTransactionListByassociateId/${userId}`
    ).then((res)=>{
      console.log("response",res);
      setDataList(res.data);
    }).catch((err)=>{
      console.log("Error:",err)
    })
  }

  const getAssociate  = async (_id) => {
    axios.get(
      `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/associate/${_id}`
    ).then((res)=>{
      setTotalPoints(res.data.loyaltyPoints);
    }).catch((err)=>{
      console.log("Error:",err)
    })
  };


  const tog_list = () => {
    setmodal_list(!modal_list);
    setValues({
      associateId: associateDetail._id,
      loyaltyPointTransaction: 0,
      isApproved: false,
      approvedTime: "",
      remarks: "",
      amount: ""
    });
    setIsSubmit(false);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClick = (e) => {
    e.preventDefault();
    setFormErrors({});
    let erros = validate(values);
    setFormErrors(erros);
    setIsSubmit(true);

    if (Object.keys(erros).length === 0) {
      const currentDateTime = new Date().toISOString();

      const formdata = {};

      formdata.associateId = values.associateId;
      formdata.loyaltyPointTransaction = values.loyaltyPointTransaction;
      formdata.isApproved = values.isApproved;
      formdata.remarks = values.remarks;
      formdata.amount = values.amount;
      formdata.approvedTime = currentDateTime;

      axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/create/associateTransaction`,
        formdata)
        .then((res) => {
          setmodal_list(!modal_list);
          setIsSubmit(false);
          setFormErrors({});
          getdata(associateDetail._id);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const PhotoUpload = (e) => {
    if (e.target.files.length > 0) {
      setValues({ ...values, myFile: e.target.files[0] });
    }
  };

  const [errLN, setErrLN] = useState(false);
  const [errEM, setErrEM] = useState(false);
  const [errPA, setErrPA] = useState(false);
  const [errBI, setErrBI] = useState(false);
  const [errFL, setErrFL] = useState(false);
  const validate = (values) => {
    const errors = {};

    if (values.amount === "") {
      errors.email = "amount is required!";
      setErrEM(true);
    }
    if (values.amount !== "") {
      setErrEM(false);
    }

    return errors;
  };

  const validClassLN =
    errLN && isSubmit ? "form-control is-invalid" : "form-control";

  const validClassEM =
    errEM && isSubmit ? "form-control is-invalid" : "form-control";

  const validClassFL =
    errFL && isSubmit ? "form-control is-invalid" : "form-control";

  const handleLogout = () =>{
    Cookies.remove("associateEmail");
    Cookies.remove("associateName");
    Cookies.remove("associateId");
    navigate("/associates-login");
  }

  return (
    <>
      <CommonSec />
      <ScrollToTop />
      <Modalnavigationbar />

      <div className="page-title-area">
        <Pagetitle
          heading="Associates Transactions"
          pagetitlelink="/associates-list"
          title1="Home"
          title2="Network"
          IconComponent={MdArrowForwardIos}
        />
      </div>

      {/* section start */}
      <section className="services-area ptb-70 pb-5">
        <Container>
          <div
          style={{
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
          >
            <div>
            <h5><span style={{color: "#e8278e"}}>Associate Name :</span> <span style={{color:"#666666"}}>{associateDetail.name}</span></h5>
            <h5><span style={{color: "#e8278e"}}>Associate Email :</span> <span style={{color: "#666666"}}>{associateDetail.email}</span></h5>
            </div>
            <div>
            <h5><span style={{color: "#e8278e"}}>Loyalty Points :</span> <span style={{color:"#666666"}}>{totalPoints}</span></h5>
            </div>
            <div style={{display: "flex", gap: "10px"}}>
            {/* <button
              onClick={() => tog_list()}
              style={{
                border: "none",
                borderRadius: "5px",
                padding: "10px",
                backgroundColor: "#e8278e",
                color: "white",
                boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px"
              }}
            >
              Add Transaction
            </button> */}
            <button
              onClick={handleLogout}
              id="logout-button"
              style={{
                border: "none",
                borderRadius: "5px",
                padding: "10px",
                backgroundColor: "#e8278e",
                color: "white",
                boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px"
              }}
            >
              <RiLogoutBoxLine/>
              <Tooltip
                                        isOpen={tooltipOpen}
                                        toggle={toggleTooltip}
                                        target="logout-button"
                                        placement="bottom"
                                        className="bg-light"
                                      >
                                        Logout
                                      </Tooltip>
            </button>
            </div>
          </div>
          <div className="opd-times mt-3">
               {dataList.length > 0 &&  <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>SR. NO.</th>
                      <th>TRANSACTION POINTS</th>
                      <th>AMOUNT</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataList.length > 0 && dataList.map((item, index)=>
                      <tr>
                        <td style={{display: "flex", justifyContent: "center"}}>{index + 1}</td>
                        <td>{item.loyaltyPointTransaction}</td>
                        <td>{item.amount}</td>
                        <td style={{display: "flex", justifyContent: "center"}}>{item.isApproved ? 
                        <button
                        style={{
                          border: "none",
                          borderRadius: "5px",
                          padding: "5px",
                          backgroundColor: "#28a745",
                          color: "white",
                          cursor: "default"
                        }}
                      >
                        Approved
                      </button> : 
                      <button
                      style={{
                        border: "none",
                        borderRadius: "5px",
                        padding: "5px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        cursor: "default"
                      }}
                    >
                      Not Approved
                    </button>
                        }</td>
                      </tr>
                    )}
                  </tbody>
                </table>}
                {dataList.length == 0 && 
                <h2 style={{textAlign: "center", marginTop: "50px", marginBottom: "50px"}}>Transaction Not Available!</h2>
                }
              </div>
        </Container>
      </section>
      <LoginComponent setShowLoginModal={setShowLoginModal} showLoginModal={showLoginModal} setshowModalappoitment={setshowModalappoitment} />
      <Modal
        isOpen={modal_list}
        toggle={() => {
          tog_list();
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_list(false);
            setIsSubmit(false);
          }}
        >
          Add Transaction
        </ModalHeader>
        <form>
          <ModalBody>

            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassEM}
                placeholder="Enter email "
                required
                name="amount"
                value={amount}
                onChange={handleChange}
              />
              <Label>
                Amount <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.amount}</p>}
            </div>

            {/* <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassLN}
                placeholder="Enter last Name"
                required
                name="remarks"
                value={remarks}
                onChange={handleChange}
              />
              <Label>
                Remarks
              </Label>
            </div> */}

            {/* <div className="form-floating mb-3">
  <Input
    type="file"
    className={validClassFL}
    placeholder="Enter email"
    required
    accept="application/pdf"
    name="myFile"
    onChange={PhotoUpload}
  />
  <Label>
    File <span className="text-danger">*</span>
  </Label>
  {isSubmit && <p className="text-danger">{formErrors.myFile}</p>}
</div>
<Button
              color="primary"
              onClick={handleShowFileBlob}
              className="btn btn-md btn-info mb-3"
            >
              View File
            </Button> */}

          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="submit"
                className="btn btn-success"
                id="add-btn"
                onClick={handleClick}
                style={{backgroundColor: "#e8278e"}}
              >
                Submit
              </button>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => {
                  setmodal_list(false);
                  setIsSubmit(false);
                }}
              >
                Cancel
              </button>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}

export default AssociatesList;