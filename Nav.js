import React, { useState , useEffect} from 'react';
import { auth, db, storage } from '../config/firebase'
import { ref, getDownloadURL} from 'firebase/storage';
import {Link , useNavigate} from 'react-router-dom';
import './Nav.css';
// import { signOut } from 'firebase/auth';
// import Swal from 'sweetalert';
import { collection, getDocs } from 'firebase/firestore';
import { totalItemsFromCart } from './Cart';

export default function Nav(props) {
  const [searchString, setSearchString] = useState('');
  const userCollectionRef = collection(db,'users');
  // console.log("is admin " , props.isAdmin);
  
  const navigate = useNavigate();
  
  return (
    <div>
            <nav className={`navbar navbar-expand-lg bg-${props.isAdmin ? 'danger' : 'dark'} navbar-dark container-fluid`}>
        <div className="container-fluid">
          {props.logoURL && <Link to='/'><img src={props.logoURL} className="navbar-brand" style={{ height: '70px', width: '70px'}} alt="Logo Here..." /></Link>}
          {/* {props.isLoggedIn && <div className='navbar-nav nav-item mb-2 ms-3' style={{color:'white'}}><li><i class="bi bi-person-circle"></i>{`  Welcome ${props.firstName}`}</li></div>} */}
          {props.isLoggedIn && <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item mx-4 text-center">
              <div className="nav-link navbar-brand" to="/"><h3><i class="bi bi-person-circle"></i>{` ${props.firstName}`}</h3></div>
            </li>
          </ul>}
          

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
              
              {props.isAdmin && <><li className="nav-item mx-2 text-center">
              <Link className="nav-link navbar-brand" to="/admin">Add Product</Link>
              </li>
              <li className="nav-item mx- text-center">
              <Link className="nav-link navbar-brand" to="/adminCouponCode">Add Coupon Code</Link>
              </li></>}
              
            </ul>
            <ul className="navbar-nav mx-2 mb-2 mb-lg-0 ">
              <Link className="nav-link navbar-brand" to="/">Home</Link>
            </ul>
            <form className="d-flex" role="search">
              <input className="form-control me-2" type="search" value={searchString} onChange={(e)=>{
                setSearchString(e.target.value);
                props.onSearch(e,e.target.value);
              }
                } placeholder="Search Here" aria-label="Search" />
              <button className="btn btn-secondary" type="submit" onClick={(e)=>{
                props.onSearch(e , searchString);
              }}>Search</button>
            </form>
            {(props.isLoggedIn && !props.isAdmin) && <ul className="navbar-nav mx-4">
              <li className="nav-item text-light text-center">
                <Link className="nav-link" to="/cart">
                  <i className="bi bi-cart display-6 cart-icon">
                    {props.totalItems > 0 && <span className="cart-icon-Quantity">{props.totalItems}</span>}
                    </i>
                </Link>
              </li>  
            </ul>}
              
            {!props.isLoggedIn && <button className='btn btn-success mx-2 px-3' onClick={()=>{
              navigate('/login');
            }}>Login</button>}

            {props.isLoggedIn && <button className={`btn btn-${props.isAdmin ? 'outline-light' : 'danger'} mx-2`} onClick={(e)=>{
              props.handleLogOut(e);
            }}>LogOut</button>}
             
          </div>
        </div>
      </nav>
    </div>
  )
}
