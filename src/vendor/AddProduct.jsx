import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import Select from "react-select";
import JoditEditor from "jodit-react";
import {
  Card, 
  CardBody,
  Col,
  Row,
  Input,
  FormFeedback,
  Button,
  Spinner,
  Label,
  CardHeader,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import ImageUpload from "./ImageUpload";
// import ProductTags from "./ProductTags";
// import Filters from "./Filters";
import { useNavigate, useParams } from "react-router-dom";

const AddProduct = ({ vendorId, selectedProductId, toggleAddProduct, setToggleAddProduct }) => {
  const navigate = useNavigate();
  //   const { id } = useParams();

  const [formValues, setFormValues] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [symptomslist, setsymptomslist] = useState([]);
  const [SymptomNames, setSymptomNames] = useState([]);

  const config = useMemo(
    () => ({
      readonly: false,
    }),
    []
  );

  const fetchSymptoms = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/DiseasesSymptoms`
      );
      const symptomsData = response.data;
      setsymptomslist(symptomsData);
      const symptomOptions = symptomsData.map((symptom) => ({
        label: symptom.Symptom,
        value: symptom._id,
      }));
      setSymptomNames(symptomOptions);
    } catch (error) {
      console.error("Error fetching symptoms data:", error);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/listVendors`
      );
      console.log("Vendor data", response.data);
      setVendorList(response.data);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/list/ProductCategory`
      );
      setCategoryList(response.data);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const fetchDataForUpdate = async () => {
    if (selectedProductId) {
      try {
        const resp = await axios.get(
          `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/product/${selectedProductId}`
        );

        let response = resp.data;
        const res1 = {
          ...response,
          vendor: response.vendor?._id,
          category: response?.category?._id,
          Symptoms: response.Symptoms?.map((x) => x._id),
        };
        console.log("rrrrr", res1);
        setFormValues(res1);
        setSelectedImages(response.imageGallery);
        setSelectedTags(response.tags);
        setSelectedFilters(response.filters);
        setSelectedItems(response.filters);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    // setLoading(true);
    fetchSymptoms();
    fetchVendors();
    fetchCategories();
    // fetchDropdownData();
  }, [toggleAddProduct]);

  useEffect(() => {
    fetchDataForUpdate();
  }, [selectedProductId]);

  const productForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: (formValues && formValues.name) || "",
      category: (formValues && formValues.category) || "",
      vendor: vendorId,
      isProductPopular: (formValues && formValues.isProductPopular) || false,
      isProductNew: (formValues && formValues.isProductNew) || false,
      isActive: (formValues && formValues.isActive) || true,
      description: (formValues && formValues.description) || "",
      info: (formValues && formValues.info) || "",
      originalPrice: (formValues && formValues.originalPrice) || "",
      discountedPrice: (formValues && formValues.discountedPrice) || "",
      sku: (formValues && formValues.sku) || "",
      gst: (formValues && formValues.gst) || "",
      hsnCode: (formValues && formValues.hsnCode) || "",
      Units: (formValues && formValues.Units) || "",
      SymptomNames: (formValues && formValues.Symptoms) || [],
    },
    validationSchema: Yup.object({
      vendor: Yup.string().required("Vendor is required"),
      SymptomNames: Yup.array().min(1, "At least one symptom is required"),
      name: Yup.string().required("Product title is required"),
      originalPrice: Yup.number()
        .typeError("Must be a number")
        .required("Price is required"),
      discountedPrice: Yup.number()
        .typeError("Must be a number")
        .required("Discounted price is required"),
      Units: Yup.number()
        .typeError("Must be a number")
        .required("Units available is required"),
      category: Yup.string().required("Category is required"),
      hsnCode: Yup.string().required("HSN code is required"),
      sku: Yup.string().required("SKU is required"),
      description: Yup.string().required("Product description is required"),
      info: Yup.string().required("Product info is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      console.log("Submitting Form:", values); // Log the form values before submitting

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("vendor", vendorId);
      formData.append("originalPrice", values.originalPrice);
      formData.append("discountedPrice", values.discountedPrice);
      formData.append("isActive", values.isActive);
      formData.append("isProductNew", values.isProductNew);
      formData.append("isProductPopular", values.isProductPopular);
      formData.append("description", values.description);
      formData.append("info", values.info);
      formData.append("sku", values.sku);
      formData.append("gst", values.gst);
      formData.append("hsnCode", values.hsnCode);
      formData.append("tags", JSON.stringify(selectedTags));
      formData.append("Units", values.Units);
      formData.append("SymptomNames", JSON.stringify(values.SymptomNames));

      for (let i = 0; i < selectedImages.length; i++) {
        formData.append("imageGallery", selectedImages[i]);
      }

      try {
        if (formValues) {
          await axios.put(
            `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/update/product/${formValues._id}`,
            formData
          );
        } else {
          await axios.post(
            `${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/product`,
            formData
          );
        }
        setToggleAddProduct(false)
        // navigate("/product");
      } catch (error) {
        console.error("Error submitting the form data:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="mt-4">
      {loading ? (
        <Spinner className="d-flex justify-content-center">Loading...</Spinner>
      ) : (
        <form onSubmit={productForm.handleSubmit}>
          <Row className="align-items-start">
            <Col sm={8}>
              <Row className="align-items-center g-1 mx-2">
                {/* <Col sm={6}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="vendor-select">
                      Vendor *
                    </label>
                    <select
                      className={`form-select ${
                        productForm.touched.vendor && productForm.errors.vendor
                          ? "is-invalid"
                          : ""
                      }`}
                      id="vendor"
                      name="vendor"
                      aria-label="vendor"
                      onBlur={productForm.handleBlur}
                    //   disabled
                      value={vendorId}
                      onChange={productForm.handleChange}
                    >
                      <option value={null}>--select--</option>
                      {vendorList.map((vendor) => (
                        <option key={vendor._id} value={vendorId}>
                          {vendor.VendorName}
                        </option>
                      ))}
                    </select>
                    {productForm.touched.vendor && productForm.errors.vendor ? (
                      <FormFeedback type="invalid">
                        {productForm.errors.vendor}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col> */}
                <Col sm={6}>
                  <div className="mb-3">
                    <label htmlFor="OtherVariations">
                      Select Related Symptoms *
                    </label>

                    <Select
                      id="SymptomNames"
                      name="SymptomNames"
                      value={SymptomNames.filter((symptom) =>
                        productForm.values.SymptomNames.includes(symptom.value)
                      )}
                      onChange={(selectedOptions) => {
                        const newValues = selectedOptions
                          ? selectedOptions.map((option) => option.value)
                          : [];
                        productForm.setFieldValue("SymptomNames", newValues);
                      }}
                      options={SymptomNames}
                      isSearchable
                      isMulti
                      placeholder="--select--"
                      className={`basic-multi-select ${
                        productForm.errors.SymptomNames &&
                        productForm.touched.SymptomNames
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    {productForm.touched.SymptomNames &&
                    productForm.errors.SymptomNames ? (
                      <FormFeedback type="invalid">
                        {productForm.errors.SymptomNames}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
              </Row>

              <Row className="align-items-center g-1 mx-2">
                <Col sm={12}>
                  <div className="mb-3">
                    <label
                      className="form-label"
                      htmlFor="product-orders-input"
                    >
                      Product Title *
                    </label>
                    <div className="input-group mb-3">
                      <Input
                        type="text"
                        id="name"
                        placeholder="Title"
                        name="name"
                        aria-label="name"
                        value={productForm.values.name}
                        onChange={productForm.handleChange}
                        onBlur={productForm.handleBlur}
                        invalid={
                          productForm.errors.name && productForm.touched.name
                            ? true
                            : false
                        }
                      />
                      {productForm.errors.name && productForm.touched.name ? (
                        <FormFeedback type="invalid">
                          {productForm.errors.name}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="align-items-center g-1 mx-2">
                <Col sm={4}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="product-price-input">
                      Price *
                    </label>
                    <div className="input-group mb-3">
                      <span
                        className="input-group-text"
                        id="product-price-addon"
                      >
                        ₹
                      </span>

                      <Input
                        placeholder="Enter price"
                        type="number"
                        onFocus={(e) =>
                          e.target.addEventListener("wheel", e.preventDefault())
                        }
                        id="originalPrice"
                        name="originalPrice"
                        className="form-control"
                        value={productForm.values.originalPrice}
                        onChange={productForm.handleChange}
                        onBlur={productForm.handleBlur}
                        invalid={
                          productForm.errors.originalPrice &&
                          productForm.touched.originalPrice
                            ? true
                            : false
                        }
                      />

                      {productForm.errors.originalPrice &&
                      productForm.touched.originalPrice ? (
                        <FormFeedback type="invalid">
                          {productForm.errors.originalPrice}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </div>
                </Col>

                <Col sm={4}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="product-price-input">
                      Discounted Price *
                    </label>
                    <div className="input-group mb-3">
                      <span className="input-group-text" id="discountedPrice">
                        ₹
                      </span>
                      <Input
                        placeholder="Enter discount"
                        type="number"
                        onFocus={(e) =>
                          e.target.addEventListener("wheel", e.preventDefault())
                        }
                        id="discountedPrice"
                        name="discountedPrice"
                        className="form-control"
                        value={productForm.values.discountedPrice}
                        onChange={productForm.handleChange}
                        onBlur={productForm.handleBlur}
                        invalid={
                          productForm.errors.discountedPrice &&
                          productForm.touched.discountedPrice
                            ? true
                            : false
                        }
                      />
                      {productForm.errors.discountedPrice &&
                      productForm.touched.discountedPrice ? (
                        <FormFeedback type="invalid">
                          {productForm.errors.discountedPrice}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </div>
                </Col>
                <Col sm={4}>
                  <div className="mb-3">
                    <label
                      className="form-label"
                      htmlFor="product-orders-input"
                    >
                      Units Available *
                    </label>
                    <div className="input-group mb-3">
                      <Input
                        type="number"
                        className="form-control"
                        id="Units"
                        placeholder="Enter No Of Units"
                        name="Units"
                        aria-label="Units"
                        value={productForm.values.Units}
                        onChange={productForm.handleChange}
                        onBlur={productForm.handleBlur}
                        invalid={
                          productForm.errors.Units && productForm.touched.Units
                            ? true
                            : false
                        }
                      />
                      {productForm.errors.Units && productForm.touched.Units ? (
                        <FormFeedback type="invalid">
                          {productForm.errors.Units}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="align-items-center g-1 mx-2">
                <Col sm={4}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="category-select">
                      Category *
                    </label>
                    <select
                      className={`form-select ${
                        productForm.touched.category &&
                        productForm.errors.category
                          ? "is-invalid"
                          : ""
                      }`}
                      id="category"
                      name="category"
                      aria-label="category"
                      onBlur={productForm.handleBlur}
                      value={productForm.values.category || ""}
                      onChange={productForm.handleChange}
                    >
                      <option value={null}>--select--</option>
                      {categoryList.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.Speciality}
                        </option>
                      ))}
                    </select>
                    {productForm.touched.category &&
                    productForm.errors.category ? (
                      <FormFeedback type="invalid">
                        {productForm.errors.category}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>

                <Col sm={4}>
                  <div className="mb-3">
                    <label
                      className="form-label"
                      htmlFor="product-orders-input"
                    >
                      HSN code *
                    </label>
                    <div className="input-group mb-3">
                      <Input
                        type="text"
                        className="form-control"
                        id="hsnCode"
                        placeholder="Enter HSN code"
                        name="hsnCode"
                        aria-label="hsnCode"
                        value={productForm.values.hsnCode || ""}
                        onChange={productForm.handleChange}
                        onBlur={productForm.handleBlur}
                        invalid={
                          productForm.errors.hsnCode &&
                          productForm.touched.hsnCode
                            ? true
                            : false
                        }
                      />
                      {productForm.errors.hsnCode &&
                      productForm.touched.hsnCode ? (
                        <FormFeedback type="invalid">
                          {productForm.errors.hsnCode}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </div>
                </Col>

                <Col sm={4}>
                  <div className="mb-3">
                    <label
                      className="form-label"
                      htmlFor="product-orders-input"
                    >
                      SKU *
                    </label>
                    <div className="input-group mb-3">
                      <Input
                        type="text"
                        className="form-control"
                        id="sku"
                        placeholder="Enter SKU"
                        name="sku"
                        aria-label="sku"
                        value={productForm.values.sku}
                        onChange={productForm.handleChange}
                        onBlur={productForm.handleBlur}
                        invalid={
                          productForm.errors.sku && productForm.touched.sku
                            ? true
                            : false
                        }
                      />
                      {productForm.errors.sku && productForm.touched.sku ? (
                        <FormFeedback type="invalid">
                          {productForm.errors.sku}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col sm={4}>
              <div
                className={`mb-3 ${
                  productForm.touched.imageGallery &&
                  productForm.errors.imageGallery
                    ? "is-invalid"
                    : ""
                }`}
              >
                <ImageUpload
                  getSelectedImages={setSelectedImages}
                  images={selectedImages}
                />
                {productForm.touched.imageGallery &&
                productForm.errors.imageGallery ? (
                  <FormFeedback type="invalid">
                    {productForm.errors.imageGallery}
                  </FormFeedback>
                ) : null}
              </div>
            </Col>
          </Row>
          {/* Description */}
          <Col lg={12}>
                                <div className="mb-3">
                                    <Label>Product Description *</Label>
                                    <JoditEditor
                                        config={config}
                                        tabIndex={1}
                                        id="description"
                                        name="description"
                                        value={productForm.values.description}
                                        onChange={(product) => {
                                            productForm.setFieldValue("description", product);
                                            productForm.setFieldTouched("description", true);
                                        }}
                                        onBlur={productForm.handleBlur}
                                        invalid={productForm.errors.description && productForm.touched.description ? true : false}
                                    />

                                    {productForm.errors.description && productForm.touched.description ? (
                                        <FormFeedback type="invalid">
                                            {productForm.errors.description}
                                        </FormFeedback>
                                    ) : null}
                                </div>
                            </Col>

          <Col sm={12}>
            <div className="mb-3">
              <label className="form-label" htmlFor="product-orders-input">
                Product Info *
              </label>
              <div className="input-group mb-3">
                <Input
                  type="text"
                  id="info"
                  placeholder="Info"
                  name="info"
                  aria-label="info"
                  value={productForm.values.info}
                  onChange={productForm.handleChange}
                  onBlur={productForm.handleBlur}
                  invalid={
                    productForm.errors.info && productForm.touched.info
                      ? true
                      : false
                  }
                />
                {productForm.errors.info && productForm.touched.info ? (
                  <FormFeedback type="invalid">
                    {productForm.errors.info}
                  </FormFeedback>
                ) : null}
              </div>
            </div>
          </Col>
          {/* <ProductTags data={selectedTags} sendTagsToParent={setSelectedTags} /> */}

          {/* <Col className="mt-3">
            <Filters
              setSelectedColors={setSelectedColors}
              selectedColors={selectedColors}
              selectedFilters={selectedFilters}
              selectedItems={selectedItems}
              setSelectedFilters={setSelectedFilters}
              setSelectedItems={setSelectedItems}
              setSelectedSize={setSelectedSize}
              selectedSize={selectedSize}
            />
          </Col> */}

          <Col className="">
            <div className="m-4 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="isActive"
                name="isActive"
                checked={productForm.values.isActive}
                onChange={(e) => {
                  productForm.setFieldValue("isActive", e.target.checked);
                }}
              />
              <label className="form-check-label" htmlFor="isActive">
                Active
              </label>
            </div>

            {/* <div className="m-4 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="isProductNew"
                name="isProductNew"
                checked={productForm.values.isProductNew}
                onChange={(e) => {
                  productForm.setFieldValue("isProductNew", e.target.checked);
                }}
              />
              <label className="form-check-label" htmlFor="isProductNew">
                isProductNew
              </label>
            </div> */}

            {/* <div className="m-4 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="isProductPopular"
                name="isProductPopular"
                checked={productForm.values.isProductPopular}
                onChange={(e) => {
                  productForm.setFieldValue(
                    "isProductPopular",
                    e.target.checked
                  );
                }}
              />
              <label className="form-check-label" htmlFor="isProductPopular">
                isProductPopular
              </label>
            </div> */}
          </Col>
          <Col className="d-flex justify-content-center mb-2">
            {!productForm.isSubmitting ? (
              <button
                type="submit"
                className="btn btn-primary mx-1"
                id="addNewTodo"
              >
                {formValues ? "Update" : "Submit"}
              </button>
            ) : (
              <Button color="primary" className="btn-load" outline disabled>
                <span className="d-flex align-items-center">
                  <Spinner size="sm" className="flex-shrink-0">
                    {" "}
                    Loading...{" "}
                  </Spinner>
                  <span className="flex-grow-1 ms-2">Loading...</span>
                </span>
              </Button>
            )}
            <button
              type="button"
              className="btn btn-soft-danger mx-1"
              id="addNewTodo"
              onClick={() => {
                setToggleAddProduct(false)
              }}
            >
              Cancel
            </button>
          </Col>
        </form>
      )}
    </div>
  );
};

export default AddProduct;
