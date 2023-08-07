import React , {useState} from 'react';
import {signInWithEmailAndPassword} from 'firebase/auth';
import { auth } from '../config/firebase';
import './LoginPage.css';
import Swal from 'sweetalert';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const LoginPage = (props) => {
    let [email , setEmail] = useState('');
    let [password , setPassword] = useState('');    
    let navigate = useNavigate();
  return (
    <div>
        {/* Section: Design Block */}
<section className="text-center">
  {/* Background image */}
  <div className="p-5 bg-image" style={{backgroundColor:'grey', height: '150px'}} />
  {/* Background image */}
  <div className="card mx-4 mx-md-5 shadow-5-strong" style={{marginTop: '-100px', background: 'hsla(0, 0%, 100%, 0.6)', backdropFilter: 'blur(40px)'}}>
    <div className="card-body py-5 px-md-5">
      <div className="row d-flex justify-content-center">
        <div className="col-lg-8">
          <h1 className="fw-bold mb-5">Login</h1>
          <form onSubmit={(e)=>{
            props.handleLogin(e , email , password);
          }}>
            {/* Email input */}
            <div className="form-floating mb-4">
              <input type="email" id="form3Example3" className="form-control" placeholder="email address" required
              onChange={(e)=>{
                setEmail(e.target.value);
              }}
              />
              <label className="form-label" htmlFor="form3Example3">Email address</label>
            </div>
            {/* Password input */}
            <div className="form-floating mb-4">
              <input type="password" id="form3Example4" className="form-control" placeholder="password" required
              onChange={(e)=>{
                setPassword(e.target.value);
              }}
              />
              <label className="form-label" htmlFor="form3Example4">Password</label>
            </div>
            {/* Submit button */}
            <button type='submit' className="btn btn-primary btn-block mb-4">
              Login
            </button>
          </form>
            <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0">Or</p>
          </div>
            {/* Register buttons */}
            <div className="text-center">
      <div className="d-none d-sm-inline-block my-2"> {/* Content for medium and large devices */}
        <button className="btn btn-outline-primary btn-floating mx-1 px-5 py-2" onClick={()=>{
          props.handleLoginWithGoogle();
        }}>
          <i className="bi bi-google" /> &nbsp;&nbsp;CONTINUE WITH GOOGLE
        </button>
      </div>
      <div className="d-inline-block d-sm-none"> {/* Content for small devices */}
        <button className="btn btn-outline-primary btn-floating mx-1">
          Login with <i className="bi bi-google" />oogle
        </button>
      </div>
    </div>
    <div className='my-2'>Don't have account ? <span style={{cursor:'pointer'}} className='text-primary text-decoration-underline' onClick={()=>{
          navigate('/signUp');
        }}>Sign Up</span></div>
        </div>
        <div className='mt-4'>
        <Link to='/'>
          <button className="btn btn-secondary">
          Continue without Login
          </button>
          </Link>
          
        </div>
      </div>
    </div>
  </div>
</section>
{/* Section: Design Block */}

    </div>
  )
}

export default LoginPage