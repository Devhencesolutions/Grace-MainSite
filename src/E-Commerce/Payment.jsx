import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import { Link, useNavigate } from "react-router-dom";
import Pagetitle from "../patients/Pagetitle";
import { RxSlash } from "react-icons/rx";
import Cookies from "js-cookie";
import Swal from "sweetalert2"; // Import SweetAlert
import { Puff } from "react-loader-spinner";
import { Modal } from "react-bootstrap";
import Lottie from "react-lottie";
import failureImg from "../img/Animation - 1727072299902.json";
import successImg from "../img/Animation - 1727074423053.json";
import logo from "../img/logo.jpg";
const jsrsasign = require("jsrsasign");

// If you're using npm, import it

function Payment() {
  const [updatedCart, setUpdatedCart] = useState([]);
  const [cartData, setCartData] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(""); // State to store selected payment method
  const [savedAddress, setSavedAddress] = useState(null);
  const [saveAddress, setSaveAddress] = useState(false);
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    state: "",
    country: "",
  });

  const customerId = Cookies.get("CustomerId");
  const shippingCost = 30.0; // Adjust as needed
  const navigate = useNavigate();

  // Fetch cart data from API
  const fetchCartData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/customer/getcart/${customerId}`
      );
      const cart = response.data.cart;
      setCartData(cart);
      setUpdatedCart(cart.products.map((item) => ({ ...item })));
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSavedAddress = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/customer/getcart/${customerId}`
      );
      if (response.data && response.data.address) {
        setSavedAddress(response.data.address); // Save the fetched address
        // Optionally, you can populate the form fields with the saved address data
        setFormData({
          FirstName: response.data.address.FirstName || "",
          LastName: response.data.address.LastName || "",
          phone: response.data.address.phone || "",
          address: response.data.address.address || "",
          city: response.data.address.city || "",
          postalCode: response.data.address.postCode || "",
          state: response.data.address.state || "",
          country: response.data.address.country || "",
        });
      }
    } catch (error) {
      console.error("Error fetching saved address:", error);
    }
  };

  useEffect(() => {
    fetchCartData();
    fetchSavedAddress();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value); // Set selected payment method
  };

  // Checkout API call
  const Checkout = async () => {
    setIsLoading(true);
    try {
      console.log("Placing order..."); // Add console log for debugging
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/orders/create`,
        {
          ...formData,
          products: updatedCart.map((item) => ({
            product: item.product._id,
            quantity: item.count,
          })),
          totalAmount:
            updatedCart.reduce(
              (acc, item) => acc + item?.product?.discountedPrice * item.count,
              0
            ) + shippingCost,
          paymentMethod: paymentMethod,
          shippingAddress: formData.address,
          shippingCharge: shippingCost,
          city: formData.city,
          state: formData.state,
          postCode: formData.postalCode,
          country: formData.country,
          customer: customerId,
          isPaid: false,
        }
      );

      if (response.status === 201) {
        setIsLoading(false);
        try {
          const empty = await axios.delete(
            `${process.env.REACT_APP_API_URL_GRACELAB}/api/customer/removeallfromcart/${customerId}`
          );
          console.log(empty);
        } catch (error) {
          console.log(error);
        }
      }
      // console.log(response)
      setCheckout(response.data);
      console.log("Order placed:", response.data); // Success log
    } catch (error) {
      console.error("Error placing order:", error); // Error log
    }
  };

  // Handle place order logic

  const handlePlaceOrder = () => {
    console.log("Placing order with method:", paymentMethod); // Debug payment method
    console.log("Form Data:", formData); // Debug form data

    if (
      paymentMethod === "cash" &&
      Object.values(formData).every((value) => value.trim() !== "")
    ) {
      // Logic to save the address if the checkbox is checked
      if (saveAddress) {
        // Save the address logic
        saveAddressData(formData);
      }

      // SweetAlert for Cash on Delivery
      Swal.fire({
        title: "Order Placed!",
        text: "Your order has been placed successfully. You will pay cash on delivery.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(async () => {
        await Checkout(); // Wait for Checkout to finish
        navigate("/"); // Redirect after successful order placement
      });
    } else if (
      paymentMethod === "billdesk" &&
      Object.values(formData).every((value) => value.trim() !== "")
    ) {
      // Handle billdesk payment here
      handleBillDeskPayment();
      // alert("Redirecting to billdesk payment gateway...");
    } else {
      Swal.fire({
        title: "Form Incomplete",
        text: "Please fill in all required fields and select a valid payment method.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
  };
  const generateUniqueOrderId = () => {
    const datePart = new Date()
      .toISOString()
      .replace(/[-:T.]/g, "")
      .slice(0, 14); // YYYYMMDDHHMMSS
    const randomPart = Math.floor(Math.random() * 100000); // Random 5-digit number
    return `ORD-${datePart}-${randomPart}`;
  };

  // Utility function to generate a unique trace ID
  // const generateUniqueTraceId =async() => {
  //   let unique = false;
  //   let traceId;

  //  while (!unique) {
  //   traceId = generateRandomAlphanumeric(16);
  //   const existingTrace = await Order.findOne({ traceId: traceId });
  //   if (!existingTrace) {
  //     unique = true;
  //   }
  // }
  //   console.log(traceId)
  //   return traceId;
  // };

  const generateRandomAlphanumeric = (length) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const getCurrentTimestamp = async () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2); // Months are zero-based
    const day = `0${date.getDate()}`.slice(-2);
    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);
    const seconds = `0${date.getSeconds()}`.slice(-2);

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  };
  // Function to sign data using HMAC with SHA-256
  async function signDataWithWebCrypto(key, data) {
    const enc = new TextEncoder();
    const dataBuffer = enc.encode(data);

    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      key,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    );

    const signatureBuffer = await window.crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      dataBuffer
    );
    const signatureArray = new Uint8Array(signatureBuffer);
    return btoa(String.fromCharCode.apply(null, signatureArray)); // base64 encoded signature
  }

  // Encrypt data using AES from CryptoJS
  function encryptData(data, secretKey) {
    const encrypted = CryptoJS.AES.encrypt(data, secretKey).toString(); // Encrypting data using AES
    return encrypted; // Return encrypted data in base64 format
  }
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://pay.billdesk.com/jssdk/v1/dist/billdesksdk.js";
    // script.src = "https://uat1.billdesk.com/merchant-uat/sdk/dist/billdesksdk.js"; // Replace with the actual URL
    script.async = true;
    script.onload = () => {
      console.log("BillDesk SDK loaded");
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Main function to handle BillDesk payment
  const handleBillDeskPayment = async () => {
    setIsLoading(true);
    try {
      console.log("Placing order..."); // Add console log for debugging
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/create/order-by-billdesk`,
        {
          ...formData,
          products: updatedCart.map((item) => ({
            product: item.product._id,
            quantity: item.count,
          })),
          totalAmount:
            updatedCart.reduce(
              (acc, item) => acc + item?.product?.discountedPrice * item.count,
              0
            ) + shippingCost,
          // totalAmount: 0.00,
          paymentMethod: paymentMethod,
          shippingAddress: formData.address,
          shippingCharge: shippingCost,
          city: formData.city,
          state: formData.state,
          postCode: formData.postalCode,
          country: formData.country,
          customer: customerId,
          isPaid: false,
        }
      );
      if (response.data.isOk) {
        handleSDKLaunch(response);
      }

      // if (response.status === 201) {
      setIsLoading(false);
      //   try {
      //     const empty = await axios.delete(`${process.env.REACT_APP_API_URL_GRACELAB}/api/customer/removeallfromcart/${customerId}`,)
      //     console.log(empty)
      //   }
      //   catch (error) {
      //     console.log(error)
      //   }
      // }
      console.log(response);
      // setCheckout(response.data);
    } catch (error) {
      console.error("Error placing order:", error); // Error log
    }
  };
  const handleSDKLaunch = (response) => {
    var responseHandler = function (txn) {
      console.log(txn);
      console.log("callback received status:: ", txn.status);
      console.log("callback received response:: ", txn.response);
      setOrder_id(txn.txnResponse.orderid);
    };

    const config = {
      flowConfig: {
        // merchantId: "BDUATV2APT",
        merchantId: "HYDGMPLBAR",
        bdOrderId: response.data.decoded.bdorderid,
        authToken: response.data.decoded.links[1].headers.authorization,
        childWindow: true,
        // returnUrl: "http://localhost:8021/api/test",
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

  const EmptyCart = async (id) => {
    try {
      const res = axios.delete(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/customer/removeallfromcart/${id}`
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const [sucessReceipt, setSuccessReceipt] = useState(false);
  const [failurReceipt, setFailurReceipt] = useState(false);
  const [receiptModal, setReceiptModal] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState({});

  const [order_id, setOrder_id] = useState("");
  useEffect(() => {
    console.log(order_id);
    const fetchOrderByOrderId = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/order/order-by-orderId/${order_id}`
        );
        console.log(res);
        if (res.data.isOk) {
          setReceiptDetails(res.data.customer);
          // EmptyCart(res.data.customer.customer._id)
          //   setSuccessReceipt(true)
          //   setReceiptModal(true)
          if (res.data.customer.auth_status === "transaction is successful") {
            EmptyCart(res.data.customer.customer._id);
            setSuccessReceipt(true);
            setReceiptModal(true);
          }
          if (res.data.customer.auth_status === "transaction failed") {
            setFailurReceipt(true);
            setReceiptModal(true);
          } else if (
            res.data.customer.auth_status ===
              "transaction is pending for authorization" ||
            res.data.customer.status === "pending"
          ) {
            // console.log(res.data.customer.auth_status)
            console.log(res.data.customer.status === "pending");
            handleRetriveTransaction(
              res.data.customer.orderId,
              res.data.customer.customer._id
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrderByOrderId();   
  }, [order_id]);

  const handleRetriveTransaction = async (orderId, customerId) => {
    console.log(orderId);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/retrive-transaction`,
        { orderId: orderId }
      );
      if (res.data.decoded) {
        if (res.data.decoded.auth_status == "0300") {
          EmptyCart(customerId);
          try {
            await axios.post(
              `${process.env.REACT_APP_API_URL_GRACELAB}/api/send-order-notifications`,
              { orderId }
            );
          } catch (notifyErr) {
            console.log("Notification sending failed", notifyErr);
          }
          setSuccessReceipt(true);
          setReceiptModal(true);
        }
      } else {
        window.alert("something went wrong!");
      }
      console.log("retrive trans", res);
    } catch (error) {
      console.log(error);
    }
  };
  // Function to save address data (you'll need to implement this according to your logic)
  const saveAddressData = (addressData) => {
    // Example: save address data in local storage or make an API call
    localStorage.setItem("savedAddress", JSON.stringify(addressData));
    console.log("Address saved:", addressData);
  };

  const userNameFromCookies = Cookies.get("PatientName");

  // Checkbox change handler
  const handleCheckboxChange = () => {
    setSaveAddress(!saveAddress); // Toggle the save address state
  };

  if (isLoading) {
    return (
      <div className="loader-container">
        <Puff
          color="#ed268e"
          height={50}
          width={50}
          timeout={0} // 0 means no timeout, loader will be displayed until setIsLoading(false) is called
        />
      </div>
    );
  }

  if (!updatedCart || updatedCart.length === 0) {
    return <p>No products found in the cart.</p>;
  }

  const subtotal = updatedCart.reduce(
    (acc, item) => acc + item?.product?.discountedPrice || 0 * item?.count || 0,
    0
  );
  const total = subtotal + shippingCost;

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData:
      (failurReceipt && failureImg) || (sucessReceipt && successImg),
    renderer: "svg",
  };
  return (
    <>
      <Modalnavigationbar />
      {/* <div className="text-end stored-name">
        {userNameFromCookies ? (
          <span className="patient-name">Welcome {userNameFromCookies}</span>
        ) : null}
      </div> */}
      <div className="page-title-area">
        <Pagetitle
          heading="Process To Checkout"
          pagetitlelink="/"
          title1="Home"
          // title2="Signup"
          // IconComponent={RxSlash}
        />
      </div>
      <section className="cart-area ptb-120">
        <div className="container">
          <div className="row">
            {/* Cart Section */}

            <div className="col-lg-6">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card shadow-lg border-0 rounded">
                    <div className="card-body p-4">
                      <h4 className="card-title text-center mb-4 product-details-css">
                        Shipping Information
                      </h4>

                      <form className="form-border-class">
                        {/* Row for First Name and Last Name */}
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>First Name</label>
                              <input
                                type="text"
                                name="FirstName"
                                className="form-control form-border-class"
                                placeholder="Enter your first name"
                                value={formData.FirstName}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Last Name</label>
                              <input
                                type="text"
                                name="LastName"
                                className="form-control form-border-class"
                                placeholder="Enter your last name"
                                value={formData.LastName}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Phone number</label>
                              <input
                                type="text"
                                name="phone"
                                className="form-control form-border-class"
                                placeholder="Enter your Phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Address</label>
                              <input
                                type="text"
                                name="address"
                                className="form-control form-border-class"
                                placeholder="Enter your Address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>City</label>
                              <input
                                type="text"
                                name="city"
                                className="form-control form-border-class"
                                placeholder="Enter your city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Postal Code</label>
                              <input
                                type="text"
                                name="postalCode"
                                className="form-control form-border-class"
                                placeholder="Enter your postal code"
                                value={formData.postalCode}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>State</label>
                              <input
                                type="text"
                                name="state"
                                className="form-control form-border-class"
                                placeholder="Enter your State"
                                value={formData.state}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Country</label>
                              <input
                                type="text"
                                name="country"
                                className="form-control form-border-class"
                                placeholder="Enter your country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* address store  */}

                  {savedAddress && (
                    <div className="card shadow-lg border-0 rounded mt-3">
                      <div className="card-body p-4">
                        <h4 className="card-title text-center mb-4 product-details-css">
                          Saved Address
                        </h4>
                        <p>
                          <strong>Name: </strong>
                          {savedAddress?.FirstName} {savedAddress?.LastName}
                        </p>
                        <p>
                          <strong>Phone: </strong>
                          {savedAddress?.phone}
                        </p>
                        <p>
                          <strong>Address: </strong>
                          {savedAddress?.address}, {savedAddress?.city},{" "}
                          {savedAddress?.state}, {savedAddress?.postalCode}{" "}
                          {savedAddress?.country}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-12">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="cart-buttons">
                    <div className="cart-totals">
                      <form>
                        <div className="cart-table table-responsive">
                          {/* <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th scope="col">Product</th>
                                <th scope="col">Name</th>
                                <th scope="col">Unit Price</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {updatedCart.map((item, index) => (
                                <tr key={item?.product?.id}>
                                  <td className="product-thumbnail">
                                    <img
                                      src={item.product?.imageGallery?.length > 0 
                                        && `${process.env.REACT_APP_API_URL_GRACELAB}/${item.product.imageGallery[0]}`}
                                      alt={item?.product?.name}
                                      width="50"
                                      height="50"
                                    />
                                  </td>
                                  <td className="product-name">
                                    <a href="#">{item?.product?.name}</a>
                                  </td>
                                  <td className="product-price">
                                    <span className="unit-amount">
                                      Rs.{item?.product?.discountedPrice || "N/A"}
                                    </span>
                                  </td>
                                  <td className="product-quantity">
                                    <div className="input-counter">
                                      <input
                                        type="text"
                                        readOnly
                                        value={item?.count}
                                      />
                                    </div>
                                  </td>
                                  <td className="product-subtotal">
                                    <span className="subtotal-amount">
                                      Rs.
                                      {(
                                        item?.product?.discountedPrice *
                                        item?.count
                                      ).toFixed(2)}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table> */}

                           <table className="table table-bordered">
                                                  <thead>
                                                    <tr>
                                                      <th scope="col">Product</th>
                                                      <th scope="col">Name</th>
                                                      <th scope="col">Unit Price</th>
                                                      <th scope="col">Quantity</th>
                                                      <th scope="col">Total</th>
                                                      {/* <th scope="col">Actions</th>{" "} */}
                                                      {/* New column for delete icon */}
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {updatedCart.length > 0 ? (
                                                      updatedCart.map(
                                                        (item, index) =>
                                                          item.product ? (
                                                            <tr key={item.product.id}>
                                                              <td className="product-thumbnail">
                                                                <img
                                                                  src={`${process.env.REACT_APP_API_URL_GRACELAB}/${item.product.imageGallery[0]}`}
                                                                  alt={item.product.name}
                                                                  width="50"
                                                                  height="50"
                                                                />
                                                              </td>
                                                              <td className="product-name">
                                                                <a href="#">{item.product.name}</a>
                                                              </td>
                                                              <td className="product-price">
                                                                <span className="unit-amount">
                                                                  Rs.{item.product.discountedPrice}
                                                                </span>
                                                              </td>
                                                              <td className="product-quantity">
                                                                <div className="input-counter">
                                                                  {/* <span
                                                                    className="minus-btn"
                                                                    onClick={() => handleDecrement(index , item)}
                                                                  >
                                                                    <FaMinus />
                                                                  </span> */}
                                                                  <input
                                                                    type="text"
                                                                    readOnly
                                                                    value={item.count}
                                                                  />
                                                                  {/* <span
                                                                    className="plus-btn"
                                                                    onClick={() => handleIncrement(index , item)}
                                                                  >
                                                                    <FaPlus />
                                                                  </span> */}
                                                                </div>
                                                              </td>
                                                              <td className="product-subtotal">
                                                                <span className="subtotal-amount">
                                                                  Rs.
                                                                  {(
                                                                    item.product.discountedPrice *
                                                                    item.count
                                                                  ).toFixed(2)}
                                                                </span>
                                                              </td>
                                                             
                                                            </tr>
                                                          ) : null // Skip rendering if product is null
                                                      )
                                                    ) : (
                                                      <tr>
                                                        <td colSpan="6" className="text-center">
                                                          Your cart is empty.
                                                        </td>
                                                      </tr>
                                                    )}
                                                  </tbody>
                                                </table>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12 mt-5">
                  <div className="cart-buttons">
                    <div className="cart-totals">
                      <h3>Cart Totals</h3>
                      <ul>
                        <li>
                          Subtotal <span>Rs.{subtotal?.toFixed(2)}</span>
                        </li>
                        <li>
                          Shipping <span>Rs.{shippingCost?.toFixed(2)}</span>
                        </li>
                        <li>
                          Total{" "}
                          <span>
                            <b>Rs.{total?.toFixed(2)}</b>
                          </span>
                        </li>
                      </ul>

                      {/* <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={paymentMethod === "cash"}
                          onChange={handlePaymentMethodChange}
                        />
                        <label className="form-check-label">
                          Cash on Delivery
                        </label>
                      </div> */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          value="billdesk"
                          checked={paymentMethod === "billdesk"}
                          onChange={handlePaymentMethodChange}
                        />
                        <label className="form-check-label">Bill Desk</label>
                      </div>

                      <div className="text-end payment-process">
                        <Link
                          to="/payment"
                          className="btn btn-primary btn-login"
                          onClick={handlePlaceOrder}
                        >
                          {paymentMethod === "billdesk"
                            ? `Pay Rs.${total.toFixed(2)}`
                            : "Proceed to Checkout"}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid">
            <div className="d-flex justify-content-end"></div>
          </div>
        </div>
      </section>
      <Modal
        size="md"
        show={receiptModal}
        onHide={() => {
          setReceiptModal(false);
          setSuccessReceipt(false);
          setFailurReceipt(false);
        }}
      >
        <Modal.Header>
          <img
            src={logo}
            alt="Logo"
            style={{ width: "57px", height: "auto" }} // Adjust size as needed
          />
        </Modal.Header>
        <Modal.Body>
          <h6 className="text-center">
            {failurReceipt && "Your transaction has been failed"}
            {sucessReceipt &&
              "Your transaction has been successfully processed"}{" "}
          </h6>
          <div
            style={{ marginRight: "auto", marginLeft: "auto", width: "250px" }}
          >
            <Lottie options={defaultOptions} />
          </div>
          {receiptDetails.invoiceGenrationDate && (
            <div style={{ textTransform: "capitalize" }}>
              {/* <p><strong>Status Description :</strong>{receiptDetails && receiptDetails.auth_status}</p> */}
              <p>
                <strong>Payment Mode:</strong>Online
              </p>
              {/* <p><strong>Purpose of Payment:</strong>Product Purchase Payment</p> */}
              <p>
                <strong>Amount:</strong>
                {receiptDetails && receiptDetails.totalAmount}
              </p>
              {/* {failurReceipt &&  <p><strong>Error Description : </strong>{receiptDetails && receiptDetails.transaction_error_desc}</p>} */}

              <p>
                <strong>Date:</strong>{" "}
                {receiptDetails &&
                  new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }).format(new Date(receiptDetails.invoiceGenrationDate))}
              </p>
              {/* <p><strong>Transaction Id :</strong>{receiptDetails && receiptDetails.transactionid}</p> */}
              <p>
                <strong>Order Id :</strong>
                {receiptDetails && receiptDetails.orderId}
              </p>
            </div>
          )}

          <div className="w-100 d-flex justify-content-center">
            <button
              className="btn btn-md btn-success m-2"
              style={{ marginRight: "auto", marginLeft: "auto"}}
              onClick={() => navigate("/")}
            >
              OK
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Payment;
