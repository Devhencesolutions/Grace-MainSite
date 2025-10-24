import React, { useCallback, useState, useMemo, useEffect } from "react";
import Dropzone from "react-dropzone";
import { Card, CardBody, Col, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";

const ImageUpload = ({ getSelectedImages, images }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    console.log("Preyash file", selectedFiles);

    // Handle files dropped into the Dropzone
    function handleAcceptedFiles(files) {
        const updatedSelectedFiles = selectedFiles.concat(files);

        // Add previews to the files
        files.forEach(file => {
            Object.assign(file, {
                preview: URL.createObjectURL(file),
            });
        });
        setSelectedFiles(updatedSelectedFiles);
        getSelectedImages(updatedSelectedFiles);
    }

    useEffect(() => {
        // Assuming images prop is an array of file objects or URLs
        // If they are URLs, you might need to fetch the file objects
        setSelectedFiles(images);
    }, [images]);

    return (
        <React.Fragment>
            <Row className="align-items-center g-3">
                <Col sm={12}>
                    <div>
                        <p className="fs-14 mb-1">Product Gallery</p>
                        {/* <p className="text-muted">Add Atleast 1 Product Image.</p> */}

                        <Dropzone onDrop={(acceptedFiles) => handleAcceptedFiles(acceptedFiles)}>
                            {({ getRootProps, getInputProps }) => (
                                <div className="dropzone dz-clickable">
                                    <div className="dz-message needsclick" {...getRootProps()}>
                                        <input {...getInputProps()} accept="image/*" name="imageGallery" multiple />
                                        {/* <div className="mb-3">
                                            <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                        </div> */}
                                        <p className="text-center">Drop files here or click to upload.</p>
                                    </div>
                                </div>
                            )}
                        </Dropzone>

                        <div className="list-unstyled mb-0" id="file-previews">
                            {selectedFiles?.map((file, index) => {
                                // If the file has a name, use it. If it's a string (URL), extract the file name from the URL.
                                const fileName = file.name || file.split("\\").pop();

                                // Determine the correct image source: either a preview (for files uploaded by the user) or a URL from the server.
                                const fileSrc = file.preview ? file.preview : `${process.env.REACT_APP_API_URL_GRACELAB}/${file}`;

                                return (
                                    <Card
                                        className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                        key={index}
                                    >
                                        <div className="p-2">
                                            <Row className="align-items-center">
                                                <Col className="col-auto">
                                                    <img
                                                        data-dz-thumbnail=""
                                                        height="80"
                                                        className="avatar-sm rounded bg-light"
                                                        alt={fileName}
                                                        src={fileSrc}
                                                    />
                                                </Col>
                                                <Col>
                                                    <Link to="#" className="text-muted font-weight-bold">
                                                        {fileName}
                                                    </Link>
                                                    <p className="mb-0">
                                                        <strong>{/* Add any additional details or file size here if needed */}</strong>
                                                    </p>
                                                </Col>
                                                <Col className="col-auto">
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm m-1"
                                                        onClick={() => {
                                                            const updatedSelectedFiles = [...selectedFiles];
                                                            updatedSelectedFiles.splice(index, 1);
                                                            setSelectedFiles(updatedSelectedFiles);
                                                            getSelectedImages(updatedSelectedFiles);
                                                        }}
                                                    >
                                                        {/* <i className="ri-delete-bin-5-fill align-bottom" /> */}
                                                        <FaRegTrashAlt />
                                                    </button>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>

                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default ImageUpload;
