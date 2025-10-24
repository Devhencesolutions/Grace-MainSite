import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modalnavigationbar from './Modalnavigationbar';
import { Link } from 'react-router-dom';

function Myorder() {
  const [cartData, setCartData] = useState(null);
  const [checkout, setcheckout] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const customerId = localStorage.getItem('CustomerId');
  const shippingCost = 30.00; // This can be fetched from API if it varies

  const fetchCartData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL_GRACELAB}/api/customer/getcart/${customerId}`);
      setCartData(response.data.cart);
    } catch (error) {
      console.error('Error fetching cart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  

  useEffect(() => {
    fetchCartData();
  
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!cartData || !cartData.products || cartData.products.length === 0) {
    return <p>No products found in the cart.</p>;
  }

  // Calculate totals
  const subtotal = cartData.products.reduce((acc, item) => acc + item.product.discountedPrice * item.count, 0);
  const total = subtotal + shippingCost;

  return (
    <>
      <Modalnavigationbar />
      <section className="cart-area ptb-120">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-12">
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
                      </tr>
                    </thead>
                    <tbody>
                      {cartData.products.map((item) => (
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
                            <span className="unit-amount">${item.product.discountedPrice}</span>
                          </td>
                          <td className="product-quantity">
                            <div className="input-counter">
                              <span className="minus-btn"><i className="fas fa-minus" /></span>
                              <input type="text" min={1} defaultValue={item.count} />
                              <span className="plus-btn"><i className="fas fa-plus" /></span>
                            </div>
                          </td>
                          <td className="product-subtotal">
                            <span className="subtotal-amount">${item.product.discountedPrice * item.count}</span>
                            <a href="#" className="remove"><i className="far fa-trash-alt" /></a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </form>
            </div>
             <div className='col-lg-6 col-md-12'>
            <div className="cart-buttons">
          <div className="cart-totals">
            <h3>Cart Totals</h3>
            <ul>
              <li>Subtotal <span>${subtotal.toFixed(2)}</span></li>
              <li>Shipping <span>${shippingCost.toFixed(2)}</span></li>
              <li>Total <span><b>${total.toFixed(2)}</b></span></li>
            </ul>
            <Link to='/payment' className="btn btn-primary">Proceed to Checkout</Link>
          </div>
        </div>
        </div>
          </div>
        </div>

       
      </section>
    </>
  );
}

export default Myorder;
