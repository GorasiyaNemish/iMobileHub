import React from 'react'

export default function CartElement(props) {
  
  return (
    <div>
      <div className="row mb-4 d-flex justify-content-between align-items-center">
                          <div className="col-md-2 col-lg-2 col-xl-2 text-center">
                            <img src={props.product.ImageURL} className="img-fluid rounded-3" alt="Image Not Found" />
                          </div>
                          <div className="col-md-3 col-lg-3 col-xl-3 my-2 text-md-start text-center">
                            <h6 className="text-muted">{props.product.Name}</h6>
                            <h6 className="text-black mb-0">₹ {props.product.Price}</h6>
                          </div>
                          <div className="col-md-3 col-lg-3 col-xl-2 my-2 d-flex justify-content-center">
                          <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-primary" onClick={() =>{
                                props.decrementQuantity(props.product);
                            }}>-</button>
                            <button type="button" className="btn btn-primary">{props.product.Quantity}</button>
                            <button type="button" className="btn btn-primary" onClick={()=>{
                                props.incrementQuantity(props.product);
                            }}>+</button>
                          </div>
                          
                          </div>
                          <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1 my-2 text-center">
                            <h6 className="mb-0">₹ {props.product.Price*props.product.Quantity}</h6>
                            
                          </div>
                          <div className="col-md-1 col-lg-1 col-xl-1 text-center">
                            <i className="bi bi-trash text-muted btn" onClick={()=>{
                              props.removeItem(props.product)
                            }} />
                          </div>
                          
                        </div>
                        <hr className="my-4" />
    </div>
  )
}
