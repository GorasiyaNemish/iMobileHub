import React, { useState } from 'react';
import {Link} from 'react-router-dom'
import CartElement from './CartElement';


export default function Cart(props) {
  const [couponCode, setCouponCode] = useState('');
    return (
      <section className="h-100 h-custom" style={{backgroundColor: 'rgb(137, 136, 132)'}}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12">
              <div className="card card-registration card-registration-2" style={{borderRadius: '15px'}}>
                <div className="card-body p-0">
                  <div className="row g-0">
                    <div className="col-lg-8">
                      <div className="p-5">
                        <div className="d-flex justify-content-between align-items-center mb-5">
                          <h1 className="fw-bold mb-0 text-black">Shopping Cart</h1>
                          <h6 className="mb-0 text-muted">{props.totalItems} items</h6>
                        </div>
                        <hr className="my-4" />
                        {
                          (()=>{                            
                            // if(props.isLoading) {
                            //   return <h1>Please wait while fetching your Cart</h1>;
                            // }
                            if(props.cartProductList){
                              if(props.cartProductList.length > 0){
                                return(
                                  props.cartProductList.map((product)=>{
                                      return(
                                        <CartElement product={product} key={product.id} incrementQuantity={props.incrementQuantity} decrementQuantity={props.decrementQuantity} removeItem={props.removeItem}/>
                                      )
                                  })
                                )
                              }else{
                                return(
                                  <div className="text-center">
                                  <img src="images/emptyCart.png" 
                                  alt="Your cart Is Empty"
                                  style={{height:'250px', width:'300px'}}
                                  className="mb-3"
                                  />
                                  <h1>Your Cart is Empty :(</h1>
                                  </div>
                                )
                              }
                            }else{
                              return(
                                <h1>Failed to get Cart</h1>
                              )
                            }
                          })()
                          
                          
                        }
                        {/* <hr className="my-4" /> */}
                        <div className="pt-5">
                          <h6 className="mb-0"><Link className="nav-link" to="/"><i class="bi bi-arrow-left"></i> Back to shop</Link></h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 bg-grey">
                      <div className="p-5">
                        <h3 className="fw-bold mb-5 mt-2 pt-1">Summary</h3>
                        <hr className="my-4" />
                        <div className="d-flex justify-content-between mb-4">
                          <h5 className="text-uppercase">{props.totalQuantity} items</h5>
                          <h5>TOTAL: ₹  {props.totalPrice}</h5>
                        </div>
                        <h5 className="text-uppercase mb-3">Enter Discount code</h5>
                        <div className="mb-5">
                          <div className="form-outline">
                            <input type="text" 
                            id="form3Examplea2"  
                            className="form-control form-control-lg" 
                            placeholder='Enter Discount code here'
                            value={couponCode}
                            onChange={(e)=>{
                              setCouponCode(e.target.value)
                            }}
                            />
                            <button type="button"
                            className="mt-2 btn btn-outline-dark"
                            onClick={()=>{
                              // console.log("coupon clicked");
                              props.applyCoupon(couponCode);
                            }}
                            >Apply Coupon</button>
                          </div>
                        </div>
                        <hr className="my-4" />
                        <div className="d-flex justify-content-between mb-5">
                          <h5 className="text-uppercase">Total Price</h5>
                          <h5>₹ {props.totalPrice-props.discountAmount}</h5>
                        </div>
                        <Link to="/payment">
                        <button type="button" className="btn btn-dark btn-block btn-lg" data-mdb-ripple-color="dark">Pay Now</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}
