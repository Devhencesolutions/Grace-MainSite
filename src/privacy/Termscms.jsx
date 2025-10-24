import React ,{useState,useEffect}from 'react'
import Modalnavigationbar from '../navbar/Modalnavigationbar'
import Pagetitle from '../patients/Pagetitle'
import { MdArrowForwardIos } from "react-icons/md";
import { Container, Row, Col, Form, InputGroup, Button, Checkbox ,Modal} from 'react-bootstrap';
import { Link ,useParams} from 'react-router-dom';
import axios from 'axios';

function Termscms() {
   const { _ID } = useParams();
  const [bout, setBout] = useState({ blogDesc: "" }); // Initialize with a default structure

   useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/get/blogs/${_ID}`
        );
     
        setBout(res.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchAbout();
  }, [_ID]); // Ensure _ID is included as a dependency
  return (
   <>
   
   <Modalnavigationbar />
    <div className="page-title-area">
    <Pagetitle  
    heading="Terms & Condition"
    pagetitlelink="/"
    title1="Home"
    title2="Contact"
    IconComponent={MdArrowForwardIos}
    />
</div>



<section className="services-area ptb-70 pb-5">
      <Container>
        <Row className="justify-content-center" id="loginPanel">
          <Col md={12} lg={10}>
                        <div class="research-details-desc">
                          <div dangerouslySetInnerHTML={{__html:bout.blogDesc}}>

                          </div>
                            <h3>Challenge & Solution</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.</p>

                            <h3>Exerci tation ullamcorper suscipit lobortis</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.</p>

                            <h3>Occaecat sint occaecat suscipit dolore</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.</p>

                            <h3>Being a top us private facility for any kind</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.</p>

                            <h3>Our Process</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.</p>
                        </div>
                </Col>
                </Row>
            </Container>
    </section>
   
   </>
  )
}

export default Termscms