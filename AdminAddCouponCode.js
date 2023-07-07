import React , {useState} from 'react';
import {db} from '../config/firebase';
import {collection , addDoc , getDocs} from 'firebase/firestore';
import Swal from 'sweetalert';

const AdminAddCouponCode = () => {
    const [couponCode , setCouponCode] = useState('');
    const [discountPercentage , setDiscountPercentage] = useState('');
    const [discountUptoRupees , setDiscountUptoRupees] = useState('');
    const couponCodeCollectionRef = collection(db,'CouponCodes');
    const handleAddCouponCode = async (e) => {
        e.preventDefault();
        try {
            const querySnapshot = await getDocs(couponCodeCollectionRef);
            const existingCoupon = querySnapshot.docs.find((doc)=> doc.data().CouponCode === couponCode);
            if(existingCoupon){
                Swal('Coupon Already Exists','Try to add New Coupon Code','error');
                setCouponCode('');
                setDiscountPercentage('');
                setDiscountUptoRupees('');
                return;
            }
            await addDoc(couponCodeCollectionRef,{
                CouponCode: couponCode,
                DiscountPercentage: Number(discountPercentage),
                DiscountUptoRupees : Number(discountUptoRupees)
            })
            Swal('Success',`${couponCode} Added Successfully`,'success');
            setCouponCode('');
            setDiscountPercentage('');
            setDiscountUptoRupees('');
        } catch (err) {
            console.error(err);
        }
    }
  return (
    <div className="row my-4 text-center">
      <h1>Add Coupon Code</h1>
      <form onSubmit={handleAddCouponCode} className="mx-auto my-4 col-8 col-md-6 col-lg-4 border border-dark p-4 rounded">
        <div className="form-floating mb-3">
            <input type="text"
            className="form-control"
            id="couponCode"
            value={couponCode}
            placeholder="Enter Coupon Code"
            required
            onChange={(e)=>{
                setCouponCode(e.target.value);
            }}
            />
            <label htmlFor="couponCode">Coupon Code</label>
        </div>
        <div className="form-floating mb-3">
            <input type="text"
            className="form-control"
            id="discountPercentage"
            value={discountPercentage}
            placeholder="Enter Discount Percentage"
            required
            onChange={(e)=>{
                setDiscountPercentage(e.target.value);
            }}
            />
            <label htmlFor="discountPercentage">Discount Percentage</label>
        </div>
        <div className="form-floating mb-3">
            <input type="text"
            className="form-control"
            id="discountUptoRupees"
            value={discountUptoRupees}
            placeholder="Enter Discount Upto How much Rupees"
            required
            onChange={(e)=>{
                setDiscountUptoRupees(e.target.value);
            }}
            />
            <label htmlFor="discountPercentage">Discount Upto How much Rupees</label>
        </div>
    <button className="form-control btn btn-primary" type="submit">Add coupon Code</button>
      </form>
    </div>
  )
}

export default AdminAddCouponCode