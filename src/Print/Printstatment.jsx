import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import logo from "../img/logo.jpg";

const PrintStatement = () => {
  const { id } = useParams();
  const url = `${process.env.REACT_APP_API_URL_GRACELAB}`;
  const [orderData, setOrderData] = useState({});
  const [productData, setProductData] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({});
  const [todayDate, setTodayDate] = useState("");
  const [loading, setLoading] = useState(false);
  const shippingCharge = 30;

  const getOrderById = async (id) => {
    try {
      const res = await axios.get(`${url}/api/getorderbyid/${id}`);
      if (res.data) {
        setOrderData(res.data);
        setProductData(res.data.products || []); // Default to an empty array if products are null
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  const getCustomerById = async (customerId) => {
    try {
      const res = await axios.get(`${url}/api/orders/${customerId}`);
      if (res.data) {
        setCustomerInfo(res.data);
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };

  useEffect(() => {
    getOrderById(id);
  }, [id]);

  useEffect(() => {
    if (orderData.customer && orderData.customer._id) {
      getCustomerById(orderData.customer._id);
    }
    setTodayDate(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    );
  }, [orderData.customer]);

  const printInvoice = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url}/api/orders/invoice/${id}`, {
        responseType: "blob",
      });
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(pdfUrl, "_blank");
      if (printWindow) {
        printWindow.focus();
      }
    } catch (error) {
      console.error("Error fetching or printing invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ensure productData is an array before using map
  const isProductDataArray = Array.isArray(productData);

  // Calculate totals
  const totalPrice = isProductDataArray
    ? productData.reduce((acc, item) => {
        if (item.product) {
          const price = parseFloat(
            item.product.discountedPrice || item.product.originalPrice || 0
          );
          const quantity = parseFloat(item.quantity || 0);
          return acc + price * quantity;
        }
        return acc;
      }, 0)
    : 0;

  const totalWithGST = isProductDataArray
    ? productData.reduce((acc, item) => {
        if (item.product) {
          const price = parseFloat(
            item.product.discountedPrice || item.product.originalPrice || 0
          );
          const gst = parseFloat(item.product.gst || 0);
          const quantity = parseFloat(item.quantity || 0);
          return acc + price * quantity * (1 + gst / 100);
        }
        return acc;
      }, 0)
    : 0;

  return (
    <>
      <section className="blog-area pb-2">
        <div className="container">
          <div className="row m-0" id="printablediv">
            <div className="col-sm-12 checkout-login">
              <div className="row align-items-center">
                <div className="col-md-7">
                  <div className="invoice-address">
                    <h4>The Direct Deal</h4>
                    <p>Barodaweb, Vadodara, Gujarat 390005.</p>
                    <p>info@thedirectdeals.com</p>
                    <p>+91(1800)888-8888</p>
                    <p>www.thedirectdeals.com</p>
                    <p>GST/HST Registration No.: 73520 0081 RC0001</p>
                    <p>Business Number: 735200081</p>
                  </div>
                </div>
                <div className="col-md-5">
                  <img
                    src={logo}
                    className="center-block text-center print-logo"
                    style={{ width: "200px" }}
                    alt="Company Logo"
                  />
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-md-6">
                  <h5 className="order-ttl">BILL TO</h5>
                  <p>
                  <p>
                    {orderData?.FirstName} {orderData?.LastName}, <br />
                    {orderData.shippingAddress ||
                      "Customer information not available"}
                  </p>
                    {/* {customerInfo?.PatientName ? (
                      <>
                        {customerInfo.PatientName}, <br />
                        {orderData.shippingAddress ||
                          "Shipping address not available"}
                      </>
                    ) : (
                      "Customer information not available"
                    )} */}
                  </p>
                </div>
                <div className="col-md-6">
                  <h5 className="order-ttl">SHIP TO</h5>
                  <p>
                    {orderData?.FirstName} {orderData?.LastName}, <br />
                    {orderData.shippingAddress ||
                      "Shipping address not available"}
                  </p>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-md-12">
                  <table className="table table-bordered table-tacb">
                    <thead>
                      <tr>
                        <th>Commercial Invoice #</th>
                        <th>Date</th>
                        <th>Total Amount</th>
                        <th>Due Date</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{orderData?.invoiceNumber}</td>
                        <td>{orderData?.formattedDate}</td>
                        <td>₹{totalWithGST}</td>
                        <td>Due on Delivery</td>
                        <td>{orderData?.paymentMethod}</td>
                        <td>{orderData?.status}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-sm-12">
                  <div className="table table-responsive table-tacb">
                    <table className="meta-1 table table-bordered order-summary mb-0">
                      <thead>
                        <tr>
                          <th>Item No</th>
                          <th>Description</th>
                          <th>Qty</th>
                          <th>Rate</th>
                          <th className="text-center">Total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isProductDataArray &&
                          productData.map((product, index) => (
                            <tr key={index}>
                              <td className="text-left">{index + 1}</td>
                              <td>
                                <div className="description-p text-left">
                                  <p className="product-category">
                                    {product?.product?.name ||
                                      "Product name unavailable"}
                                  </p>
                                </div>
                              </td>
                              <td>{product?.quantity || 0}</td>
                              <td>
                                ₹
                                {product?.product?.discountedPrice ||
                                  product?.product?.originalPrice ||
                                  0}
                              </td>
                              <td className="text-right">
                                ₹
                                {product.quantity *
                                  (product?.product?.discountedPrice ||
                                    product?.product?.originalPrice ||
                                    0)}
                              </td>
                            </tr>
                          ))}
                        <tr>
                          <td colSpan="4" className="text-right fw-700">
                            Subtotal :
                          </td>
                          <td className="text-right">₹{totalPrice}</td>
                        </tr>
                        <tr>
                          <td colSpan="4" className="text-right fw-700">
                            GST @ 18% :
                          </td>
                          <td className="text-right">₹{orderData?.gst || 0}</td>
                        </tr>
                        <tr>
                          <td colSpan="4" className="text-right fw-700">
                            Shipping Charge :
                          </td>
                          <td className="text-right">₹{shippingCharge}</td>
                        </tr>
                        <tr>
                          <td colSpan="4" className="text-right fw-700">
                            Total :
                          </td>
                          <td className="text-right">
                            ₹{totalWithGST + shippingCharge}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Loader and Print button */}
              <div className="text-center mt-4 no-print">
                {loading ? (
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <button className="btn btn-primary" onClick={printInvoice}>
                    Print Invoice
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrintStatement;
