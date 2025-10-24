import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
// import { Modal } from 'react-bootstrap';
import axios from "axios";
import Cookies from "js-cookie";
import { MdArrowForwardIos } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import { Tooltip } from "reactstrap";
import LoginComponent from "../Components/loginComponent";
import failureImg from "../img/Animation - 1727072299902.json";
import successImg from "../img/Animation - 1727074423053.json";
import logo from "../img/logo.jpg";
import network from "../img/network.jpg";
import CommonSec from "../navbar/CommonSec";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import ScrollToTop from "../scrolltop/Scrolltop";
import Pagetitle from "./Pagetitle";

const handleRedirect = () => {
  window.open("https://patient.gracemedicalservices.in/home/login", "_blank");
};

function Patientlogin() {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const userNameFromCookies = Cookies.get("PatientName");
  const [appointmentId, setAppointmentId] = useState("");
  const [payModal, setPayModal] = useState(false);
  // const handlechange = async(e) =>
  //   {
  //     e.preventDefault();
  //     setloading(true);
  //     seterror('');

  //     try {
  //       const patientlogin = await axios.post(
  //         `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/userLoginPatient`,
  //         {
  //                 email,
  //                 password,
  //         }
  //       )

  //       const patientresult = (patientlogin.data)

  //       if (patientresult.isOk) {
  //         window.open('http://PatientGracelab.barodaweb.in','_blank');
  //       } else {
  //         seterror(patientresult.message);
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
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerStep, setRegisterStep] = useState(1);
  const [registerMobile, setRegisterMobile] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [createdPatientId, setCreatedPatientId] = useState("");
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState("");
  const [selectedPharmacyName, setSelectedPharmacyName] = useState("");
  const [amountToPay, setAmountToPay] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [preferredPharmacy, setPreferredPharmacy] = useState(null);

  const toggleTooltip = () => {
    setTooltipOpen(!tooltipOpen);
  };

  const handleSendOTP = async () => {
    try {
      if (!registerMobile || registerMobile.length !== 10) {
        setRegisterError("Enter valid 10 digit mobile number");
        return;
      }
      setOtpLoading(true);
      setRegisterError("");
      
      // Send OTP for verification regardless of whether patient exists or not
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/send-otp`,
        { phoneNumber: registerMobile }
      );

      if (response.data.isOk) {
        setOtpSent(true);
        setRegisterError("");
        
        // Auto-fill OTP if provided in response (with delay to simulate SMS arrival)
        if (response.data.otp) {
          // Store OTP for delayed auto-fill
          localStorage.setItem(`otp_${registerMobile}`, response.data.otp);
          
          // Add delay to make it look like OTP is coming from SMS
          setTimeout(() => {
            setOtpValue(response.data.otp);
            // Also update the DOM element directly
            const otpInput = document.getElementById("otp");
            if (otpInput) {
              otpInput.value = response.data.otp;
            }
          }, 30000); // 30 second delay
        }
      } else {
        setRegisterError(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setRegisterError("Failed to send OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      if (!otpValue || otpValue.length !== 6) {
        setRegisterError("Enter valid 6 digit OTP");
        return;
      }
      setOtpLoading(true);
      setRegisterError("");
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/verify-otp`,
        { phoneNumber: registerMobile, otp: otpValue }
      );

      if (response.data.isOk) {
        setRegisterError("");
        
        // Clear stored OTP after successful verification
        localStorage.removeItem(`otp_${registerMobile}`);
        
        // Check if patient already exists after OTP verification
        try {
          const existingPatientResponse = await axios.post(
            `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/checkPatientByMobile`,
            { mobileNumber: registerMobile }
          );
          
                     // If patient exists, use existing patient data
           if (existingPatientResponse.data.isOk && existingPatientResponse.data.patient) {
             const existingPatient = existingPatientResponse.data.patient;
             setCreatedPatientId(existingPatient._id);
             Cookies.set("CustomerId", existingPatient._id, { expires: 7 });
             
             // Check if patient has a preferred pharmacy
             if (existingPatient.Pharmacy1 && existingPatient.Pharmacy1._id) {
               // Set preferred pharmacy
               setPreferredPharmacy(existingPatient.Pharmacy1);
               setSelectedPharmacyId(existingPatient.Pharmacy1._id);
               setSelectedPharmacyName(existingPatient.Pharmacy1.PharmacyName || existingPatient.Pharmacy1.LabName || existingPatient.Pharmacy1.name || "Selected Pharmacy");
             }
             
             // Fetch pharmacies and go to step 3 (pharmacy selection)
             const pharmacyListRes = await axios.get(
               `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/listPharmacies`
             );
             setPharmacies(Array.isArray(pharmacyListRes.data) ? pharmacyListRes.data.filter(p=>p?.isActive!==false) : []);
             setRegisterStep(3);
             setRegisterError("");
           } else {
            // If patient doesn't exist, proceed with new registration
            await submitRegisterMobile();
          }
        } catch (checkError) {
          console.log("Patient check failed after OTP verification:", checkError);
          // If checking patient existence fails, proceed with new registration
        await submitRegisterMobile();
        }
      } else {
        setRegisterError(response.data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      setRegisterError("Failed to verify OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  
  const [order_id, setOrder_id] = useState("");
  const [sucessReceipt, setSuccessReceipt] = useState(false);
  const [failurReceipt, setFailurReceipt] = useState(false);
  const [receiptModal, setReceiptModal] = useState(true);
  const [receiptDetails, setReceiptDetails] = useState({});

  const [isLoad, setIsLoad] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData:
      (failurReceipt && failureImg) || (sucessReceipt && successImg),
    renderer: "svg",
  };

  useEffect(() => {
    console.log(order_id);
    if (order_id) {
      fetchOrderByOrderId();
    }
  }, [order_id]);

  // Handle URL parameter to auto-open registration modal
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const registerParam = searchParams.get('register');
    
    if (registerParam === 'mobile') {
      handleStartRegister();
    }
  }, [location]);

  // Auto-fill OTP when received from server response (with delay)
  useEffect(() => {
    if (otpSent && !otpValue) {
      // Check if there's a stored OTP in localStorage (from server response)
      const storedOTP = localStorage.getItem(`otp_${registerMobile}`);
      if (storedOTP && storedOTP.length === 6) {
        // Add delay to make it look more natural
        setTimeout(() => {
          setOtpValue(storedOTP);
          const otpInput = document.getElementById("otp");
          if (otpInput) {
            otpInput.value = storedOTP;
          }
        }, 30000); // 30 second delay
      }
    }
  }, [otpSent, otpValue, registerMobile]);

  // Handle SMS OTP auto-detection using WebOTP API
  useEffect(() => {
    if (otpSent && "OTPCredential" in window) {
      const handleOTPAutoFill = async () => {
        try {
          const ac = new AbortController();
          setTimeout(() => ac.abort(), 180000); // 180 second timeout
          
          const content = await navigator.credentials.get({
            otp: { transport: ["sms"] },
            signal: ac.signal
          });
          
          if (content && content.code) {
            setOtpValue(content.code);
            // Also update the DOM element directly for immediate visual feedback
            const otpInput = document.getElementById("otp");
            if (otpInput) {
              otpInput.value = content.code;
            }
          }
        } catch (error) {
          // Silently handle errors - auto-fill is optional
          console.log('WebOTP auto-fill not available or cancelled:', error);
        }
      };

      handleOTPAutoFill();
    }
  }, [otpSent]);

  const handleRetriveTransaction = async (orderId) => {
    try {
      setIsLoad(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/contact-pharmacy/retrive-transaction`,
        { orderId: orderId }
      );
      console.log("retrive transaction",res);
      if (res.data.decoded) {
        if (res.data.decoded.auth_status == "0300") {
          setSuccessReceipt(true);
          setReceiptModal(true);

          console.log("retrive trans", res);

          const resp = await axios.get(
            `${process.env.REACT_APP_API_URL_GRACELAB}/api/contact-pharmacy/payment/point-transaction/${appointmentId}`
          );

          console.log("point transaction >>>", resp);


          if (resp.data.isOk) {
            setIsLoad(false);
            setPayModal(false);  

            toast.success("Record updated successfully!")

            setShowRegisterModal(false);
            setRegisterStep(1);
 //cal below api after res

            // fetchCategories();
          } else {
            setIsLoad(false);
            window.alert(
              "something went wrong with loyalty points transaction!"
            );
          }
        }
      } else {
        setIsLoad(false);
        window.alert("something went wrong!");
      }
    } catch (error) {
      setIsLoad(false);
      console.log(error);
    }
  };

  const fetchOrderByOrderId = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/contact-pharmacy-by-orderid/${order_id}`
      );
      console.log("gte app by order id", res);
      if (res.data.isOk) {
        setReceiptDetails(res.data.data[0]);
        if (res.data.data[0].auth_status === "transaction is successful") {
          setSuccessReceipt(true);
          setReceiptModal(true);
        }
        if (res.data.data[0].auth_status === "transaction failed") {
          setFailurReceipt(true);
          setReceiptModal(true);
        } else {
          handleRetriveTransaction(res.data.data[0].orderId);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSDKLaunch = (response) => {
    console.log("response in handleSDKLaunch",response);
    var responseHandler = function (txn) {
      console.log("txn in responseHandler",txn);
      setOrder_id(txn.txnResponse.orderid);
    };

    const config = {
      flowConfig: {
        // merchantId: "BDUATV2APT",
        merchantId: "HYDGMPLBAR",
        bdOrderId: response.data.decoded.bdorderid,
        authToken: response.data.decoded.links[1].headers.authorization,
        childWindow: true,
        retryCount: 0,
        prefs: {
          payment_categories: [
            "card",
            "emi",
            "nb",
            "upi",
            "wallets",
            "qr",
            "gpay",
          ],
          allowed_bins: ["459150", "525211"],
        },
        netBanking: {
          showPopularBanks: "N",
          popularBanks: ["Kotak Bank", " AXIS Bank [Retail]"],
        },
      },
      responseHandler: responseHandler,
      flowType: "payments",
      merchantLogo: logo,
    };

    const retryInterval = setInterval(() => {
      if (typeof window.loadBillDeskSdk === "function") {
        clearInterval(retryInterval);
        window.loadBillDeskSdk(config);
      } else {
        console.warn("Retrying: BillDesk SDK is not yet loaded...");
      }
    }, 500); // Retry every 500ms
  };

  const handlePay = async (apId) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/contact-pharmacy/patient-pay/${apId}`
      );

      console.log(res);
      if (res.data.isOk) {
        console.log("res in handle pay",res);
        handleSDKLaunch(res);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStartRegister = () => {
    setRegisterStep(1);
    setRegisterMobile("");
    setRegisterError("");
    setSelectedPharmacyId("");
    setSelectedPharmacyName("");
    setAmountToPay("");
    setOtpSent(false);
    setOtpValue("");
    setPreferredPharmacy(null);
    setShowRegisterModal(true);
  };

  const submitRegisterMobile = async () => {
    try {
      setRegisterLoading(true);
      setRegisterError("");
      if (!registerMobile || registerMobile.length !== 10) {
        setRegisterError("Enter valid 10 digit mobile number");
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/registerPatientByMobileNo`,
        { mobileNumber: registerMobile }
      );

      console.log("step 1", response)

      const isOk = response?.isOk ?? true;
      const patientData = response?.data?.data || response?.data;
      const patientId = patientData?._id;
      if (!isOk || !patientId) {
        setRegisterError(response?.data?.message || "Registration failed");
        return;
      }

      setCreatedPatientId(patientId);
      Cookies.set("CustomerId", patientId, { expires: 7 });

      // fetch pharmacies
      const pharmacyListRes = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/listPharmacies`
      );
      setPharmacies(Array.isArray(pharmacyListRes.data) ? pharmacyListRes.data.filter(p=>p?.isActive!==false) : []);
      setRegisterStep(3);
    } catch (err) {
      console.error(err);
      setRegisterError("Something went wrong. Please try again.");
    } finally {
      setRegisterLoading(false);
    }
  };

  const submitPharmacySelection = async () => {
    try {
      if (!selectedPharmacyId) {
        setRegisterError("Please select a pharmacy");
        return;
      }
      setRegisterLoading(true);
      setRegisterError("");
      // Update patient's pharmacy
      await axios.put(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/updatePatientPharmacy/${createdPatientId}`,
        { pharmacyId: selectedPharmacyId }

      );
      setRegisterStep(4);
    } catch (err) {
      console.error(err);
      setRegisterError("Failed to update pharmacy for patient");
    } finally {
      setRegisterLoading(false);
    }
  };

  const submitCreateOrder = async () => {
    try {
      if (!amountToPay) {
        setRegisterError("Enter amount to pay");
        return;
      }
      setRegisterLoading(true);
      setRegisterError("");

      const formData = new FormData();
      formData.append("Description", `Payment Initiated: Rs ${amountToPay}`);
      formData.append("contactNumber", registerMobile);
      formData.append("email", "");
      formData.append("name", "");
      formData.append("patientId", createdPatientId);
      formData.append("amount", amountToPay);


      const res = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/create/Contactpharmacy/${selectedPharmacyId}`,
        formData
      );

      // console.log(">> 1", res);
      if(res.data.success){
        console.log(">> 1", res?.data?.data?._id);
        setAppointmentId(res?.data?.data?._id);
        handlePay(res?.data?.data?._id);
      }else{
        toast.error("Failed to create order. Please try again.");
      }
     

      //show order created success
      // toast.success("Record updated successfully!")


      // setShowRegisterModal(false);
      // setRegisterStep(1);
    } catch (err) {
      console.error(err);
      setRegisterError("Failed to create order. Please try again.");
    } finally {
      setRegisterLoading(false);
    }
  };
  return (
    <>
      <CommonSec />
      <ScrollToTop />
      <Modalnavigationbar />
<ToastContainer/>
      {/* <div className="text-end stored-name">
        {userNameFromCookies ? (
          <span className="patient-name">Welcome {userNameFromCookies}</span>
        ) : null}
      </div> */}
      <div className="page-title-area">
        <Pagetitle
          heading="MEMBERS"
          pagetitlelink="/patient-signup"
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
                    Click Here to sign into our Website
                    </Tooltip>
                  {/* {error && <Alert variant="danger">{error}</Alert>}
                <Form className="signin-form" onSubmit={handlechange}>
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text"
                     placeholder="Username" 
                     required
                     value={email}
                     onChange={(e) => setemail(e.target.value)} />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password"
                     placeholder="Password"
                      required
                      value={password}
                      onChange={(e)=>setpassword(e.target.value)} />
                  </Form.Group>
                  <Row className="mb-4">
                    <Col className="text-start" xs={6}>
                    <Form.Check type="checkbox"  label="Remember Me"/>

                    </Col>
                    <Col className="text-end" xs={6}>
                      <Link to="/forgotpassword">Forgot Password?</Link>
                    </Col>
                  </Row> */}
                  
                  <div className="d-flex gap-3">
                    <Button
                      id="websiteLink"
                      onClick={() => setShowLoginModal(true)}
                      type="button"
                      className="form-control btn btn-sign-in rounded submit px-3"
                    >
                      SIGN IN into Website
                    </Button>

                    <Button
                      onClick={handleRedirect}
                      type="button"
                      className="form-control btn btn-sign-in rounded submit px-3"
                    >
                      SIGN IN into panel
                    </Button>
                  </div>
                  {/* <div className="d-flex justify-content-center mt-3">
                    <Button
                      onClick={handleStartRegister}
                      type="button"
                      className="form-control btn btn-sign-in rounded submit px-3"
                      style={{ maxWidth: 300 }}
                    >
                      Register with Mobile No
                    </Button>
                  </div> */}

                  {/* </Form> */}
                  <p className="text-center accounttop">
                    Don't have an account?{" "}
                    <Link
                      to="/patient-signup"
                      className="d-inline-block register-here"
                    >
                      Register here
                    </Link>
                  </p>
                  <p className="text-center fw-bold">
                    <Link
                      to="#"
                      onClick={handleShow}
                      style={{ color: "#eb268f" }}
                    >
                      Why Registered with us
                    </Link>

                    <Modal
                      show={showModal}
                      onHide={handleClose}
                      size="lg"
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Why Registered with us</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p>
                          <strong>Accurate Diagnosis:</strong> Laboratory tests
                          provide precise results that help in diagnosing
                          various medical conditions accurately. This allows
                          healthcare providers to initiate appropriate treatment
                          plans promptly.
                        </p>
                        <p>
                          <strong>Early Detection:</strong> Many diseases can be
                          detected early through laboratory tests, even before
                          symptoms manifest. Early detection facilitates timely
                          intervention, potentially improving patient outcomes.
                        </p>
                        <p>
                          <strong>Monitoring Treatment Progress:</strong>{" "}
                          Laboratory tests enable healthcare providers to
                          monitor the effectiveness of treatments over time. By
                          tracking changes in biomarkers or other indicators,
                          they can adjust treatment plans as necessary.
                        </p>
                      </Modal.Body>
                    </Modal>
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

      <Modal show={showRegisterModal} onHide={() => setShowRegisterModal(false)} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {registerStep === 1 ? "Continue with Mobile Number" : 
             registerStep === 3 ? "Select Pharmacy" : 
             "Complete Registration"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {registerError && (
            <Alert variant="danger" className="mb-3">{registerError}</Alert>
          )}

          {registerStep === 1 && (
            <Form>
              <Form.Group className="mb-3" controlId="regMobile">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter 10 digit mobile number"
                  value={registerMobile}
                  onChange={(e) => setRegisterMobile(e.target.value.replace(/[^0-9]/g, ""))}
                  maxLength={10}
                />
              </Form.Group>
              {!otpSent ? (
                <div className="d-flex justify-content-end">
                  <Button disabled={otpLoading || !registerMobile || registerMobile.length !== 10} onClick={handleSendOTP}>
                    {otpLoading ? "Checking..." : "Continue"}
                  </Button>
                </div>
              ) : (
                <>
                  <Form.Group className="mb-3" controlId="regOTP">
                    <Form.Label>Enter OTP</Form.Label>
                    <Form.Control
                      id="otp"
                      name="one-time-code"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="\d{6}"
                      type="text"
                      placeholder={otpValue ? otpValue : "Enter 6 digit OTP"}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/[^0-9]/g, ""))}
                      maxLength={6}
                    />
                   
                  </Form.Group>
                  <div className="d-flex justify-content-between">
                    {/* <Button variant="secondary" onClick={() => setOtpSent(false)}>
                      Change Number
                    </Button> */}
                    <Button disabled={otpLoading || !otpValue || otpValue.length !== 6} onClick={handleVerifyOTP}>
                      {otpLoading ? "Verifying..." : "Verify OTP"}
                    </Button>
                  </div>
                </>
              )}
            </Form>
          )}

          {registerStep === 3 && (
            <Form>
               {preferredPharmacy && (
                 <Alert variant="info" className="mb-3">
                   <strong>Your Preferred Pharmacy:</strong> {preferredPharmacy.PharmacyName || preferredPharmacy.LabName || preferredPharmacy.name}
                   <br />
                   <small className="text-muted">
                     💎 <strong>Loyalty Points:</strong> You will earn loyalty points when you select this pharmacy!
                   </small>
                 </Alert>
               )}
              <Form.Group className="mb-3" controlId="selectPharmacy">
                <Form.Label>Select Pharmacy</Form.Label>
                <Form.Select
                  value={selectedPharmacyId}
                   onChange={(e) => {
                     const selectedId = e.target.value;
                     setSelectedPharmacyId(selectedId);
                     
                     // Check if selected pharmacy is the preferred one
                     if (preferredPharmacy && selectedId === preferredPharmacy._id) {
                       setSelectedPharmacyName(preferredPharmacy.PharmacyName || preferredPharmacy.LabName || preferredPharmacy.name);
                     } else {
                       const selectedPharmacy = pharmacies.find(p => p._id === selectedId);
                       setSelectedPharmacyName(selectedPharmacy ? (selectedPharmacy.PharmacyName || selectedPharmacy.LabName || selectedPharmacy.name) : "");
                     }
                   }}
                >
                  <option value="">Choose pharmacy</option>
                  {pharmacies.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.PharmacyName || p.LabName || p.name}
                       {preferredPharmacy && p._id === preferredPharmacy._id ? " (Your Preferred)" : ""}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
               {selectedPharmacyId && preferredPharmacy && selectedPharmacyId === preferredPharmacy._id && (
                 <Alert variant="success" className="mb-3">
                   <strong>Great Choice!</strong> You've selected your preferred pharmacy. You'll earn loyalty points on this transaction.
                 </Alert>
               )}
              <div className="d-flex justify-content-end">
                {/* <Button variant="secondary" onClick={() => setRegisterStep(1)}>Back</Button> */}
                <Button disabled={registerLoading} onClick={submitPharmacySelection}>
                  {registerLoading ? "Saving..." : "Continue"}
                </Button>
              </div>
            </Form>
          )}

          {registerStep === 4 && (
            <Form>
               {selectedPharmacyName && (
                 <Form.Group className="mb-3" controlId="selectedPharmacy">
                   <Form.Label>Selected Pharmacy</Form.Label>
                   <Form.Control
                     type="text"
                     value={selectedPharmacyName}
                     readOnly
                     className="bg-light"
                   />
                   {preferredPharmacy && selectedPharmacyId === preferredPharmacy._id && (
                     <small className="text-success">
                       💎 You'll earn loyalty points on this transaction!
                     </small>
                   )}
                 </Form.Group>
               )}
              <Form.Group className="mb-3" controlId="amountToPay">
                <Form.Label>Amount to Pay</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  placeholder="Enter amount"
                  value={amountToPay}
                  onChange={(e) => setAmountToPay(e.target.value)}
                />
              </Form.Group>
              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={() => setRegisterStep(3)}>Back</Button>
                <Button disabled={registerLoading} onClick={submitCreateOrder}>
                  {registerLoading ? "Submitting..." : "Pay & Create Order"}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

    </>
  );
}

export default Patientlogin;
