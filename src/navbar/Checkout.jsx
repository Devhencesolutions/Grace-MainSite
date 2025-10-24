import React, { useState, useEffect } from "react";
import axios from "axios";
import Modalnavigationbar from "./Modalnavigationbar";
import { Link } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import Pagetitle from "../patients/Pagetitle";
import { RxSlash } from "react-icons/rx";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

function Checkout() {
  const [cartData, setCartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedCart, setUpdatedCart] = useState(() => {
    const cartFromCookie = Cookies.get("updatedCart");
    return cartFromCookie ? JSON.parse(cartFromCookie) : [];
  });
  const [isUpdating, setIsUpdating] = useState(false); // To handle update loading state
  const [isClearing, setIsClearing] = useState(false); // To handle clear loading state
  const customerId = Cookies.get("CustomerId");
  const shippingCost = 30.0; // Adjust as needed

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

  const userNameFromCookies = Cookies.get("PatientName");

  useEffect(() => {
    fetchCartData();
  }, []);

  // Save updatedCart to localStorage whenever it changes
  useEffect(() => {
    Cookies.set("updatedCart", JSON.stringify(updatedCart), { expires: 7 }); // Cookies expire in 7 days
  }, [updatedCart]);

  const handleIncrement = async(index , item) => {
    const newCart = [...updatedCart];
    newCart[index].count += 1;
    setUpdatedCart(newCart);
    console.log(item)
    const data = {
      discountedPrice:item.product.discountedPrice,
      productId:item.product._id
     } 
     try{
      const res = await axios.put(`${process.env.REACT_APP_API_URL_GRACELAB}/api/customer/AddCartItems/${customerId}`,data)
      console.log(res)
     }
     catch(error)
     {
      console.log(error)
     }
    
  };

  const handleDecrement = async(index, item) => {
    const newCart = [...updatedCart];
    if (newCart[index].count > 1) {
      newCart[index].count -= 1;
      setUpdatedCart(newCart);
      const data = {
        discountedPrice:item.product.discountedPrice,
        productId:item.product._id
       } 
      
       try{
        const res = await axios.put(`${process.env.REACT_APP_API_URL_GRACELAB}/api/customer/RemoveCartItems/${customerId}`,data)
        console.log(res)
       }
       catch(error)
       {
        console.log(error)
       }
    }
    console.log(item)
    
  };

  const calculateSubtotal = () => {
    return updatedCart.reduce((acc, item) => {
      if (item.product && item.product.discountedPrice) {
        return acc + item.product.discountedPrice * item.count;
      }
      return acc; // Skip items without a valid product or price
    }, 0);
  };

  const handleUpdateCart = async () => {
    setIsUpdating(true);
    try {
      const updatedCartItems = updatedCart.map((item) => ({
        productId: item.product._id,
        quantity: item.count,
      }));

      // Send the updated cart data to the backend
      await axios.put(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/customer/updatecartitemssss/${customerId}`,
        {
          products: updatedCartItems,
        }
      );

      // Show SweetAlert success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Cart updated successfully!",
        timer: 2000, // Show for 2 seconds
        showConfirmButton: false, // Hide the OK button
      });
    } catch (error) {
      console.error("Error updating cart:", error);

      // Show SweetAlert error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update the cart. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = async () => {
    setIsClearing(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/customer/removeallfromcart/${customerId}`
      );
      setUpdatedCart([]); // Clear the cart state

      // Show SweetAlert success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Cart cleared successfully!",
        timer: 2000, // Show for 2 seconds
        showConfirmButton: false, // Hide the OK button
      });
    } catch (error) {
      console.error("Error clearing cart:", error);

      // Show SweetAlert error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to clear the cart. Please try again.",
        timer: 2000, // Show for 2 seconds
        showConfirmButton: false, // Hide the OK button
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleDeleteProduct = async (customerId, productId) => {
    try {
      // Make sure productId and customerId are valid
      if (!productId || !customerId) {
        console.error("Product ID or Customer ID is missing");
        return;
      }

      // Find the product to get its name for the alert
      const product = updatedCart.find(
        (item) => item.product._id === productId
      );
      if (!product) {
        console.error("Product not found in cart");
        return;
      }

      // Send delete request with both customerId and productId in the request body
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL_GRACELAB}/api/customer/removefromcart/${customerId}`,
        {
          data: { productId }, // The data property is used for sending data in DELETE requests
        }
      );

      // Handle success
      if (response.status === 200) {
        // Update the cart by removing the deleted product from the state
        const updatedCartAfterDeletion = updatedCart.filter(
          (item) => item.product._id !== productId
        );
        setUpdatedCart(updatedCartAfterDeletion);

        // Show SweetAlert success message with the product name
        Swal.fire({
          icon: "success",
          title: "Product Deleted",
          text: `${product.product.name} has been removed from your cart.`,
          timer: 2000, // Show for 2 seconds
          showConfirmButton: false, // Hide the OK button
        });
      }
    } catch (error) {
      console.error("Error deleting product from cart:", error);

      // Show SweetAlert error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete the product from the cart. Please try again.",
        timer: 2000, // Show for 2 seconds
        showConfirmButton: false, // Hide the OK button
      });
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const hasProducts =
    cartData && cartData.products && cartData.products.length > 0;
  const subtotal = hasProducts ? calculateSubtotal() : 0;
  const total = subtotal + shippingCost;

  return (
    <>
      <Modalnavigationbar />
      {/* <div className="text-end stored-name">
        {userNameFromCookies ? (
          <span className="patient-name">Welcome {userNameFromCookies}</span>
        ) : null}
      </div> */}
      <div className="page-title-area">
        <Pagetitle heading="Cart" title1="Home" />
      </div>
      <section className="cart-area ptb-120">
        <div className="container">
          <div className="row">
            {/* Cart Section */}
            <div className="col-lg-7 col-md-12">
              <div className="cart-buttons">
                <div className="cart-totals">
                  <form>
                    <div className="cart-table table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th scope="col">Product</th>
                            <th scope="col">Name</th>
                            <th scope="col">Unit Price</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Total</th>
                            <th scope="col">Actions</th>{" "}
                            {/* New column for delete icon */}
                          </tr>
                        </thead>
                        <tbody>
                          {hasProducts ? (
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
                                        <span
                                          className="minus-btn"
                                          onClick={() => handleDecrement(index , item)}
                                        >
                                          <FaMinus />
                                        </span>
                                        <input
                                          type="text"
                                          readOnly
                                          value={item.count}
                                        />
                                        <span
                                          className="plus-btn"
                                          onClick={() => handleIncrement(index , item)}
                                        >
                                          <FaPlus />
                                        </span>
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
                                    <td className="product-actions">
                                      <button
                                        className="btn delete-button"
                                        onClick={(event) => {
                                          event.preventDefault(); // Prevents default form submission behavior
                                          handleDeleteProduct(
                                            customerId,
                                            item.product._id
                                          ); // Pass both IDs
                                        }}
                                      >
                                        <FaTrash /> {/* Trash icon */}
                                      </button>
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
                  {hasProducts && (
                    <div className="update-cart-btn-container">
                      {/* <button
                        className="btn btn-primary btn-login update-cart-btn"
                        onClick={handleUpdateCart}
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Updating..." : "Update Cart"}
                      </button> */}
                      <button
                        className="btn btn-danger btn-login clear-cart-btn"
                        onClick={handleClearCart}
                        disabled={isClearing}
                      >
                        {isClearing ? "Clearing..." : "Clear Cart"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cart Totals Section */}
            <div className="col-lg-5 col-md-12">
              <div className="cart-buttons">
                <div className="cart-totals">
                  <h3>Cart Totals</h3>
                  <ul>
                    <li>
                      Subtotal <span>Rs.{subtotal.toFixed(2)}</span>
                    </li>
                    <li>
                      Shipping <span>Rs.{shippingCost.toFixed(2)}</span>
                    </li>
                    <li>
                      Total{" "}
                      <span>
                        <b>Rs.{total.toFixed(2)}</b>
                      </span>
                    </li>
                  </ul>
                  {hasProducts && (
                    <Link to="/payment" className="btn btn-primary btn-login">
                      Proceed to Checkout
                    </Link>
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

export default Checkout;
