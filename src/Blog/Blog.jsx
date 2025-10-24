import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import placeholderimage from "../img/Blog-Placeholder.png";
import Modalnavigationbar from "../navbar/Modalnavigationbar";
import Pagetitle from "../patients/Pagetitle";
import { MdArrowForwardIos } from "react-icons/md";
import CommonSec from "../navbar/CommonSec";

function Blog() {
  const [blog, setBlog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // State for pagination
  const [hasMore, setHasMore] = useState(true); // State to track if there are more blogs to load

  // Function to fetch blogs from the API with pagination
  const fetchBlogs = async (pageNum) => {
    console.log(`Fetching blogs for page ${pageNum}...`); // Debug logging
    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/AboutUs`,
        {
          skip: (pageNum - 1) * 21, // Skip records based on the page number (pagination)
          per_page: 21, // Fetch 21 blogs per request (page size)
          sorton: "Date", // Sort by date
          sortdir: "asc", // Sort in ascending order
          match: "",
          IsActive: true,
        }
      );

      console.log("API Response Data:", response.data); // Log entire response data
      console.log("API Response Data Length:", response.data[0].data.length); // Log the length of the response data

      if (Array.isArray(response.data[0].data)) {
        const newBlogs = response.data[0].data.filter((blog) => blog.IsActive);

        console.log("Filtered New Blogs:", newBlogs); // Log filtered blogs
        console.log("Filtered New Blogs Length:", newBlogs.length); // Log length of filtered new blogs

        // If fewer than 21 blogs are returned, set `hasMore` to false to stop loading
        if (newBlogs.length < 21) {
          setHasMore(false);
        }

        // Deduplicate blogs based on `_id`
        setBlog((prevBlogs) => {
          // Create a map of existing blogs by their `_id`
          const existingBlogsMap = new Map(prevBlogs.map(blog => [blog._id, blog]));

          // Add new blogs to the map, which will automatically handle duplicates
          newBlogs.forEach(blog => existingBlogsMap.set(blog._id, blog));

          // Convert the map values back to an array
          const uniqueBlogs = Array.from(existingBlogsMap.values());

          console.log("Unique Blogs:", uniqueBlogs); // Log unique blogs
          console.log("Unique Blogs Length:", uniqueBlogs.length); // Log length of unique blogs

          return uniqueBlogs;
        });
      } else {
        console.error("Unexpected response format:", response.data);
        setBlog([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching blogs for page:", page); // Log page number on load
    fetchBlogs(page); // Fetch the blogs on initial load and when the page changes
  }, [page]);

  const handleShowMore = () => {
    if (hasMore) {
      setPage(page + 1); // Load the next page of blogs
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  return (
    <>
      <CommonSec />
      <Modalnavigationbar />
      <div className="page-title-area">
        <Pagetitle
          heading="Blog"
          pagetitlelink="/"
          title1="Home"
          title2="Media"
          IconComponent={MdArrowForwardIos}
        />
      </div>
      <div className="container">
        {loading && blog.length === 0 ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <div className="row">
            {blog.map((camping) => (
              <Col key={camping._id} lg={4} className="mb-4 mt-5">
                <Link to={`/blogdetails/${camping._id}`}>
                  <Card className="camping-card">
                    <Card.Img
                      className="card-image-camping"
                      variant="top"
                      src={
                        camping.Images
                          ? `${process.env.REACT_APP_API_URL_GRACELAB}/${camping.Images}`
                          : placeholderimage
                      }
                      alt={camping.Images}
                      onError={(e) => {
                        e.target.src = placeholderimage;
                      }}
                    />
                    <Card.Body className="card-body-blog">
                      <div className="d-flex justify-content-between align-items-center mt-2 date-author">
                        <Card.Title className="author-name mb-0">
                          <span className="author">Author :</span> {camping.Author}
                        </Card.Title>
                        <small className="date mb-0">
                          <span className="author">Date :</span> {formatDate(camping.Date)}
                        </small>
                      </div>
                      <Card.Title className="title-blog">
                        {camping.Title.length > 50
                          ? `${camping.Title.substring(0, 50)}...`
                          : camping.Title}
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </div>
        )}
        {hasMore && !loading && (
          <div className="text-center mt-3">
            <button className="show-more-button" onClick={handleShowMore}>
              Show More
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Blog;
