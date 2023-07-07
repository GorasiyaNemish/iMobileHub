import React, { useState } from 'react';
import Swal from 'sweetalert';

export default function Payment(props) {
  const [cardNumber , setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');

  const handleCardNumberChange = (e) => {
    
      let newCardNumber = e.target.value.replace(/\D/g, '');
    
      // Remove any existing spaces from the input
      // newCardNumber = newCardNumber.replace(/\s/g, '');
      
      // Insert a space after every 4 characters
      newCardNumber = newCardNumber.replace(/(.{4})(?!$)/g, '$1 ');
      // (?!$) is for not to add space at last
      setCardNumber(newCardNumber); 
      // console.log(e.target.value);
    
    
  }
  const handleExpiryDateChange = (e) => {
    let newDate = e.target.value.replace(/\D/g, '');
    newDate = newDate.replace(/(\d{2})(?!$)/g, '$1/');
    // (?!$) is for not to add / at last
    setExpiryDate(newDate);
  };

  const handleCvvChange = (e) => {
    let newCvv = e.target.value.replace(/\D/g, ''); // only for numbers
    setCvv(newCvv);
  };

  const handleCardHolderNameChange = (e) => {
    const newName = e.target.value.replace(/[^a-z ]/gi, '');  // only for letters
    setCardHolderName(newName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(props.totalPrice>0){
    if(cardNumber.length !== 19){
      Swal('Invalid Card Number', 'Enter valid Card Number', 'info');
      return;
    }
    if(cvv.length !== 3){
      Swal('Invalid CVV Number', 'Enter valid CVV Number', 'info');
      return;
    } 
    const [mm, yy] = expiryDate.split('/'); 
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if(isNaN(Number(mm)) || isNaN(Number(yy)) || Number(mm) < 1 || Number(mm) > 12 || Number(yy) < currentYear || (Number(yy) === currentYear && Number(mm) < currentMonth)){
      Swal('Invalid Expiration Date', 'Enter valid Expiration Date', 'info');
      return;
    }
    if(cardHolderName.length <= 0){
      Swal('Invalid Name','Enter valid Card Holder Name','info');
      return;
    }
    // Success the form if all validations pass
    Swal('CONFIRMED', 'Order Placed Successfully', 'success');
    props.orderConfirmed();
  }
  else{
    Swal('Your cart is empty', 'Please add items before making a payment', 'error');
  }
}
  return (
    <div>
      <div className="text-center mt-3">
      <h3>Payment Amount : ₹ {props.totalPrice-props.discountAmount}</h3>
      <h4>Total Items : {props.totalItems}</h4>
      <h4>Total Quantity : {props.totalQuantity}</h4>
      </div>
      <div className="container mt-5">
  <div className="row">
    <div className="col-xs-12 col-md-4 offset-md-4">
      <div className="card p-2">
        <div className="card-header">
          <div className="row">
            <h3 className="text-xs-center">Payment Details</h3>
            <img className="img-fluid cc-img" src="http://www.prepbootstrap.com/Content/images/shared/misc/creditcardicons.png" />
          </div>
        </div>
        <div className="card-block">
          <form role="form">
            <div className="row my-2">
              <div className="col-xs-12">
                <div className="form-group">
                  <label>CARD NUMBER</label>
                  <div className="input-group d-flex">
                    <input type="text" className="form-control me-2" 
                    placeholder="Enter Card Number" 
                    value={cardNumber}
                    maxLength={19}  // 16 digit + 3 white spaces
                    onChange={handleCardNumberChange}/>
                    <span className="bi bi-credit-card fs-3"></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row my-2">
              <div className="col-xs-7 col-md-7 my-2">
                <div className="form-group">
                  <label>EXPIRATION DATE</label>
                  <input type="text" className="form-control"
                  value={expiryDate}
                  placeholder="MM / YY"
                  maxLength={5}  // 2 mm , 1 / , 2 yy
                  onChange={handleExpiryDateChange}
                  />
                </div>
              </div>
              <div className="col-xs-5 col-md-5 float-xs-right my-2">
                <div className="form-group">
                  <label>CVV CODE</label>
                  <input type="password" className="form-control" 
                  placeholder="CVV" 
                  value={cvv}
                  maxLength={3}
                  onChange={handleCvvChange}
                  />
                </div>
              </div>
            </div>
            <div className="row my-2">
              <div className="col-xs-12">
                <div className="form-group">
                  <label>CARD HOLDER NAME</label>
                  <input type="text" className="form-control" 
                  placeholder="Enter Name"
                  value={cardHolderName}
                  onChange={handleCardHolderNameChange}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="card-footer my-3">
          <div className="row">
            <div className="col-xs-12">
              <button className="btn btn-warning btn-lg btn-block"
              onClick={handleSubmit}
              >Process Payment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div className="text-center mt-5">
<span className='text-danger text-center'>** Don't add Original Card Details this is for learning purpose only **</span>
<br />
<span className='text-primary text-center'>Project by NEMISH GORASIYA</span>
    </div>
    </div>
  )
}
