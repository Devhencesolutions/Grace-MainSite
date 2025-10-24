import React from "react";
import { Card, ListGroup, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Pagetitle from "../patients/Pagetitle";
import { MdArrowForwardIos } from "react-icons/md";
import "../css/style.css";
import { IoCall } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import { useKnowledgeBase } from "./KnowledgeBaseContext";

// const functionalities = [
//     {
//         name: "How member will register",
//         url: "https://drive.google.com/file/d/YOUR_VIDEO_ID_1/view",
//     },
//     {
//         name: "How doctor will register",
//         url: "https://drive.google.com/file/d/YOUR_VIDEO_ID_2/view",
//     },
//     {
//         name: "How hospital will register",
//         url: "https://drive.google.com/file/d/YOUR_VIDEO_ID_3/view",
//     },
//     {
//         name: "How pharmacy will register",
//         url: "https://drive.google.com/file/d/YOUR_VIDEO_ID_3/view",
//     },
//     {
//         name: "How affiliate will register",
//         url: "https://drive.google.com/file/d/YOUR_VIDEO_ID_3/view",
//     },
//     {
//         name: "How member will book doctor appointment",
//         url: "https://drive.google.com/file/d/YOUR_VIDEO_ID_3/view",
//     },
//     {
//         name: "How member will order pharmacy",
//         url: "https://drive.google.com/file/d/YOUR_VIDEO_ID_3/view",
//     },
//     {
//         name: "How member will book and connect hospital ",
//         url: "https://drive.google.com/file/d/YOUR_VIDEO_ID_3/view",
//     },
//     {
//         name: "How member will book lab test ",
//         url: "https://drive.google.com/file/d/YOUR_VIDEO_ID_3/view",
//     },
//     {
//         name: "How hospital will handle after member book and connect",
//         url: "https://drive.google.com/file/d/YOUR_VIDEO_ID_3/view",
//     },
//     {
//         name: "How pharmacy will handle after member orders ",
//         url: "https://drive.google.com/file/d/YOUR_VIDEO_ID_3/view",
//     },
//     {
//         name: "How member and doctor will handle appointment. This should include right from doctor accepting appointment till upload of prescription and lab test.",
//         url: "https://drive.google.com/file/d/YOUR_VIDEO_ID_3/view",
//     },
//     {
//         name: "How laboratory will handle after member books the test",
//         url: "https://drive.google.com/file/d/YOUR_VIDEO_ID_3/view",
//     },
//     {
//         name: "What process affiliate does when member goes to redeem like checking available points",
//         url: "https://drive.google.com/file/d/YOUR_VIDEO_ID_3/view",
//     },
//     {
//         name: "Medical services at home",
//         url: "https://drive.google.com/file/d/YOUR_VIDEO_ID_3/view",
//     },
// ];


const Knowledge = () => {

    const { knowledgeBaseData, loading } = useKnowledgeBase();

    console.log("KnowledgeBase Data in Component:", knowledgeBaseData); // Debug Log
    const handleClick = (url) => {
        window.open(url, "_blank");
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
            <Modalnavigationbar />

            <div className="page-title-area">
                <Pagetitle
                    heading="Knowledge Base"
                    pagetitlelink="/"
                    title1="Home"
                    title2="About"
                    IconComponent={MdArrowForwardIos}
                />
            </div>
            <div className="featured-cards">
                <Card className="functionality-card">
                    <Card.Header as="h5">KNOWLEDGE BASE</Card.Header>
                    {/* <Card.Body>
                        <ListGroup variant="flush">
                            {functionalities.map((item, index) => (
                                <ListGroup.Item
                                    key={index}
                                    action
                                    onClick={() => handleClick(item.url)}
                                    className="functionality-item"
                                >
                                    {item.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card.Body> */}

                    <Card.Body>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <ListGroup variant="flush">
                                {knowledgeBaseData.map((item, index) => (
                                    <ListGroup.Item
                                        key={index}
                                        action
                                        onClick={() => handleClick(item.videoLink)}
                                        className="functionality-item"
                                    >
                                        {item.Title}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Card.Body>

                </Card>

            </div>
        </>
    );
};

export default Knowledge;

