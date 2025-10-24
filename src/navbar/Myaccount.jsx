import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Modalnavigationbar from "./Modalnavigationbar";
import Pagetitle from "../patients/Pagetitle";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Printstatment from "../Print/Printstatment";
import PrintStatement from "../Print/Printstatment";
// import { useLocation } from "react-router-dom";

function Myaccount() {
  const [activeSection, setActiveSection] = useState("accountInfo"); // State to toggle between sections
  const [cartData, setCartData] = useState(null);
  const [ordersData, setOrdersData] = useState([]); // State to hold orders data
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const customerId = Cookies.get("CustomerId");
  const shippingCost = 30.0;
  const { id } = useParams(); // Assuming you have access to the ID of the order

  const handleDownloadClick = (id) => {
    const url = `/print-statement/${id}`; // Pass the order ID to the URL
    window.open(url, "_blank"); // Open the PrintStatement in a new tab
  };

  // Fetch cart data from the API
  const fetchCartData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/customer/getcart/${customerId}`
      );
      const cart = response.data.cart;
      setCartData(cart);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch orders data from the API
  const fetchOrdersData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/orders/${customerId}`
      ); // Call the endpoint to get all orders
      const orders = response.orders;
      console.log("Fetched orders:", response);
      setOrdersData(response.data || []);
    } catch (error) {
      console.error("Error fetching orders data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user info from localStorage
  useEffect(() => {
    const userName = Cookies.get("PatientName"); // Retrieves the value of 'usermail' cookie
    const userEmail = Cookies.get("username"); // Retrieves the value of 'username' cookie

    if (userName) {
      setUserName(userName);
      setNewUserName(userName); // Initialize newUserName with the current name
    }
    if (userEmail) {
      setUserEmail(userEmail);
      setNewUserEmail(userEmail); // Initialize newUserEmail with the current email
    }
  }, []);

  // Fetch cart data on component mount
  useEffect(() => {
    fetchCartData();
  }, []);

  useEffect(()=>{
    fetchOrdersData()
  },[customerId])
  const location = useLocation();

  useEffect(() => {
    // Access the state from the location object
    const state = location.state;
    console.log(state); // Should log "myOrders" if navigated from the Link
    if(state)
    {
      setActiveSection(state)
    }
  }, [location]);

  // Handle section change
  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section === "myOrders") {
      fetchOrdersData(); // Fetch orders data when switching to 'myOrders'
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options); // 'en-GB' for dd-mm-yyyy format
  };

  // Handle edit mode toggle
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  // Handle form submission
  const handleSaveChanges = () => {
    Cookies.set("usermail", newUserName);
    Cookies.set("username", newUserEmail);
    setUserName(newUserName);
    setUserEmail(newUserEmail);
    setIsEditing(false);
  };

  // Handle logout
  const handleLogout = () => {
    // Check if the "updatedCart" cookie exists and remove it if it does
    const updatedCart = Cookies.get("updatedCart");
    if (updatedCart) {
      Cookies.remove("updatedCart");
    }

    // Remove other user-related cookies
    Cookies.remove("CustomerId");
    Cookies.remove("username");
    Cookies.remove("Password");
    Cookies.remove("useremail");
    Cookies.remove("PatientName");

    // Show logout success alert
    Swal.fire({
      title: "Logged out successfully!",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      // Redirect to home or login page
      window.location.href = "/";
    });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Modalnavigationbar />
      {/* <div className="text-end stored-name">
        {userName && <span className="patient-name">Welcome {userName}</span>}
      </div> */}
      <div className="page-title-area">
        <Pagetitle heading="My Account" title1="Home" />
      </div>
      <section className="cart-area ptb-120">
        <div className="container">
          <div className="row">
            {/* Sidebar Section */}
            <div className="col-lg-4 col-md-12">
              <div className="cart-buttons">
                <div className="cart-totals">
                  <h5>Account Dashboard</h5>
                  <br />
                  <h6
                    onClick={() => handleSectionChange("accountInfo")}
                    style={{ cursor: "pointer" }}
                  >
                    My Account
                  </h6>
                  <hr />
                  <h6
                    onClick={() => handleSectionChange("myOrders")}
                    style={{ cursor: "pointer" }}
                  >
                    My Orders
                  </h6>
                  <hr />
                  <h6 onClick={handleLogout} style={{ cursor: "pointer" }}>
                    Logout
                  </h6>
                  <hr />
                </div>
              </div>
            </div>

            {/* Main Content Section */}
            <div className="col-lg-8 col-md-12">
              <div className="cart-buttons">
                <div className="cart-totals">
                  {/* Render content based on the active section */}
                  {activeSection === "accountInfo" ? (
                    <>
                      <h3>Account Information</h3>
                      <hr />
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            placeholder="Enter new name"
                          />
                          <input
                            type="email"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            placeholder="Enter new email"
                          />
                          <button onClick={handleSaveChanges}>
                            Save Changes
                          </button>
                          <button onClick={handleEditClick}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <p>
                            <strong>Name:</strong> {userName}
                          </p>
                          <p>
                            <strong>Email:</strong> {userEmail}
                          </p>
                          {/* <button
                            className="btn btn-primary btn-login update-cart-btn"
                            onClick={handleEditClick}
                          >
                            Edit
                          </button> */}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <h3>My Orders</h3>
                      <hr />
                      {/* Display orders data */}
                      <div className="table-container">
                        {Array.isArray(ordersData) && ordersData.length > 0 ? (
                          <table className="responsive-table">
                            <thead>
                              <tr>
                                <th>Order ID</th>
                                <th>Order on</th>
                                <th>Payment</th>
                                <th>Total</th>
                                <th>Invoice Download</th>
                              </tr>
                            </thead>
                            <tbody>
                              {ordersData.map((order, index) => (
                                <tr key={index}>
                                  <td>{order?.orderId}</td>{" "}
                                  {/* Assuming order ID is _id */}
                                  <td>{formatDate(order?.createdAt)}</td>
                                  <td>{order?.paymentMethod == "billdesk" ? "Online" : "Cash"}</td>
                                  <td>
                                    Rs.
                                    {order?.totalAmount
                                      ? order.totalAmount.toFixed(2)
                                      : "0.00"}
                                  </td>{" "}
                                  {/* Assuming total is totalAmount */}
                                  <td>
                                    <button
                                      className="btn btn-secondary ms-3 btn-login-invoice"
                                      onClick={() =>
                                        handleDownloadClick(order._id)
                                      }
                                    >
                                      Download Invoice
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p>No orders found.</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Myaccount;
