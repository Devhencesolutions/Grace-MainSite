import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../css/responsive.css";
import "../css/style.css";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import Pagetitle from "../patients/Pagetitle";
import CommonSec from "../navbar/CommonSec";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

function Acceptpatient() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const status = searchParams.get("status");

  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("ID from URL:", id);
    console.log("Status from URL:", status);

    const fetchAppointmentDetails = async () => {
      if (id) {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/appointments/${id}/patientAction`,
            {
              params: { status },
            }
          );
          setAppointmentDetails(res.data);
        } catch (error) {
          console.error("Error fetching appointment details:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [id,status]);

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    const requestData = {
      params: {
        status, // Ensure `status` is defined in the scope
      },
    };
    axios
      .post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/patientappointments/${id}/reschedule?status=reschedule`,
        {
          appointmentDate: rescheduleDate,
          appointmentTime: rescheduleTime,
          action: "reschedule",
          ...requestData, // Add any additional data you might be sending
        }
      )
      .then((response) => {
        console.log("Appointment rescheduled successfully:", response.data);
        // Handle success, maybe show a success message or redirect
        Swal.fire({
          icon: "success",
          title: "Appointment Rescheduled",
          text: "Your appointment has been rescheduled successfully!",
          confirmButtonText: "OK",
        });

        // Reset the form or any other state changes if needed
        setRescheduleDate("");
        setRescheduleTime("");
      })
      .catch((error) => {
        console.error("Error rescheduling appointment:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "There was an error rescheduling the appointment. Please try again later.",
          confirmButtonText: "OK",
        });
        // Handle error, maybe show an error message
      })
      .finally(() => {
        setLoading(false); // Stop loader regardless of success or failure
      });
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!status || !id) {
    return <div>Error: Missing required parameters.</div>;
  }

  return (
    <>
      <CommonSec />
      <Modalnavigationbar navigatelink="/" />
      <div className="page-title-area">
        <Pagetitle heading="Appointment Status" title1="Home" />
      </div>
      <section className="services-area ptb-120">
        <div className="container">
          <div className="row justify-content-center">
            {status === "accept" && (
              <h5 className="text-center">Your appointment has been booked.</h5>
            )}

            {status === "reject" && (
              <h5 className="text-center">
                Your appointment has been rejected.
              </h5>
            )}

            {status === "reschedule" && (
              <>
                <h5 className="text-center">
                  Please select a new date and time for rescheduling.
                </h5>
                <Form onSubmit={handleRescheduleSubmit} className="mt-4">
                  <div className="form-group mb-3">
                    <label htmlFor="rescheduleDate">Select Date:</label>
                    <input
                      type="date"
                      id="rescheduleDate"
                      className="form-control"
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="rescheduleTime">Select Time:</label>
                    <input
                      type="time"
                      id="rescheduleTime"
                      className="form-control"
                      value={rescheduleTime}
                      onChange={(e) => setRescheduleTime(e.target.value)}
                      required
                    />
                  </div>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Rescheduling..." : "Reschedule Appointment"}
                  </Button>
                </Form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Acceptpatient;
