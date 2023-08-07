import React from 'react';
import './ProductCard.css';
import { useNavigate } from 'react-router';
export default function ProductCard(props) {
  const navigate = useNavigate();
  
  return (
    <div className="col">
    <div className="card p-3" style={{width: '18rem'}}> 
      {/* <div className="card pt-3 wrapper"> */}
        <img src={props.product.ImageURL} className="card-img-top mx-auto" alt="Image Not Found !!" style={{ height: '300px', width: '250px' , objectFit: 'cover' }} />
        <div className="card-body text-center" >
          <h5 className="card-title">{props.product.Name}</h5>
          <p className="card-text text-dark">₹ {props.product.Price}</p>
          <p className="card-text text-secondary description">{props.product.Description}</p>
          {!props.isAdmin && <button className="btn btn-primary" onClick={()=>{
            props.addToCart(props.product);
          }}>Add to cart</button>}
          
          {props.isAdmin && <><button className="mx-2 btn btn-primary" onClick={()=>{
              props.setProductToBeUpdate(props.product);
              navigate('/adminUpdateProduct');
          }}>Update</button><i className="mx-2 btn-danger bi bi-trash text-light btn" onClick={()=>{
            props.removeFromDataBase(props.product);
          }}></i></>}
        </div>
      {/* </div> */}
      </div>
      </div>
  )
}
