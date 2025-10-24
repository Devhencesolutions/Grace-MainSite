import React, { useState, useEffect } from "react";
import axios from "axios";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import Pagetitle from "../patients/Pagetitle";
import { Container, Row, Col, Form, Button, Table, Modal } from "react-bootstrap";
import pharmacylogin from "../img/pharmacy-login2.jpg";
import { RxSlash } from "react-icons/rx";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Link, useNavigate, useParams } from "react-router-dom";
import CommonSec from "../navbar/CommonSec";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import moment from "moment/moment";
const validationSchema = Yup.object({
  password: Yup.string().required("Password is required"),
  email: Yup.string().email("Invalid Email").required("Shop Email is required"),
});

function HomeServiceProviderPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const initialValues = {
    password: "",
    email: "",
  };

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadProvider();
  }, []);

  const loadProvider = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/get/order-by-provider/${id}`
      );
      setOrders(res.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);


  const handleClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setFeedback("");
    setSelectedOrder(null);
  };

  const handleSubmit = async () => {
    if (!feedback) {
      toast.error("Feedback cannot be empty");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL_GRACELAB}/api/submit-feedback/${selectedOrder._id}`, {
        feedback,
      });
      toast.success("Feedback submitted successfully");
      handleClose();
      loadProvider();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
    }
  };

  return (
    <>
      <CommonSec />
      <Modalnavigationbar />
      <ToastContainer />

      <div className="page-title-area">
        <Pagetitle
          heading="Medical Services At Home"
          pagetitlelink=">"
          title1="Feedback"
          title2="Service Provider"
          IconComponent={RxSlash}
        />
      </div>

      <section className="services-area ptb-70 pb-5">
        <Container>
        <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Service Name</th>
                <th>Quantity</th>
                <th>Total Amount</th>
                <th>Date & Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.name}</td>
                  <td>{order.contact}</td>
                  <td>{order.email}</td>
                  <td>{order.service?.ServiceName}</td>
                <th>{order.quantity}</th>
                  <td>{order.totalAmount}</td>
                  <td>{moment(new Date(new Date(order.createdAt).getTime())).format(
              "DD-MM-YYYY hh:mm A"
            )}</td>
                <td> { order?.serviceProviderFeedBack ? order?.serviceProviderFeedBack :  <Button className="btn btn-primary"  
                onClick={(e) => { 
                    e.preventDefault();
                    handleClick(order);
                 }} >Feedback</Button> } </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </section>


      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Feedback</Form.Label>
              <Form.Control
                as="textarea"
                style={{ height: "100px" }}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default HomeServiceProviderPage;
