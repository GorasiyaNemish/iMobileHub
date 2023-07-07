import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router';
import { auth , db } from '../config/firebase';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import { setDoc, doc} from 'firebase/firestore';
import Swal from 'sweetalert';

const SignUpPage = () => {
    let [firstName , setFirstName] = useState('');
    let [lastName , setLastName] = useState('');
    let [email , setEmail] = useState('');
    let [password , setPassword] = useState('');
    const navigate = useNavigate();


    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            // console.log("signUp");
            await createUserWithEmailAndPassword(auth,email,password);
            const user = auth.currentUser;
            // const uid = user.uid;
            // console.log(uid);
            const userRef = doc(db, "users", user.uid);  // email ni jagyaye user.uid pan chale
            await setDoc(userRef, {
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Password: password
          });
          setFirstName('');
          setLastName('');
          setEmail('');
          setPassword('');
          Swal('Signed Up Successfully','You will be redirected to Login page','success');
          setTimeout(()=>{
              navigate('/login');
          },3000)  // 3 second pachhi login upar reDirect
        } catch (err) {
          console.error(err);
            Swal('Error',err.message,'error');
        }
        
    }
    
  return (
    <div>
        {/* Section: Design Block */}
<section className="text-center">
  {/* Background */}
  <div className="p-5 bg-image" style={{backgroundColor:'grey', height: '150px'}} />
  {/* Background */}
  <div className="card mx-4 mx-md-5 shadow-5-strong" style={{marginTop: '-100px', background: 'hsla(0, 0%, 100%, 0.6)', backdropFilter: 'blur(40px)'}}>
    <div className="card-body py-5 px-md-5">
      <div className="row d-flex justify-content-center">
        <div className="col-lg-8">
          <h1 className="fw-bold mb-5">Sign Up</h1>
          <form onSubmit={(e)=>{
                handleSignUp(e);
            }}>
            {/* 2 column grid layout with text inputs for the first and last names */}
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="form-floating">
                  <input type="text" id="form3Example1" value={firstName} className="form-control" placeholder="first name" required
                  onChange={(e)=>{
                    setFirstName(e.target.value);
                  }}
                  />
                  <label className="form-label" htmlFor="form3Example1">First Name</label>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="form-floating">
                  <input type="text" id="form3Example2" value={lastName} className="form-control" placeholder="last name" required
                  onChange={(e)=>{
                    setLastName(e.target.value);
                  }}
                  />
                  <label className="form-label" htmlFor="form3Example2">Last Name</label>
                </div>
              </div>
            </div>
            {/* Email input */}
            <div className="form-floating mb-4">
              <input type="email" id="form3Example3" value={email} className="form-control" placeholder="email address" required
              onChange={(e)=>{
                setEmail(e.target.value);
              }}
              />
              <label className="form-label" htmlFor="form3Example3">Email address</label>
            </div>
            {/* Password input */}
            <div className="form-floating mb-4">
              <input type="password" id="form3Example4" value={password} className="form-control" placeholder="password" required
              onChange={(e)=>{
                setPassword(e.target.value);
              }}
              />
              <label className="form-label" htmlFor="form3Example4">Password</label>
            </div>
            {/* Submit button */}
            <button type='submit' className="btn btn-primary btn-block my-2 mb-2">
              Sign up
            </button>
            </form>
            <div className="text-center mt-4">Already have an account ? <span style={{cursor:'pointer'}} className='text-primary text-decoration-underline' onClick={()=>{
          navigate('/login');
        }}>Login</span></div>
            
        </div>
      </div>
    </div>
  </div>
</section>
{/* Section: Design Block */}

    </div>
  )
}

export default SignUpPage