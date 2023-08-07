import React ,{useState} from 'react';
import { auth } from '../config/firebase';
import { useNavigate , useLocation} from 'react-router';
import {db , storage} from '../config/firebase';
import {doc , getDoc, updateDoc} from 'firebase/firestore';
import { ref , getDownloadURL , uploadBytes} from 'firebase/storage';
const AdminUpdateProduct = (props) => {
    let [productName,setProductName] = useState('');
    let [productPrice,setProductPrice] = useState('');
    let [productDescription,setProductDescription] = useState('');
    let [productImage,setProductImage] = useState(null);
    let [imagePreview, setImagePreview] = useState(null);

    let navigate = useNavigate();
    const handleProductNameChange = (e) => {
        setProductName(e.target.value);
    }
    const handleProductPriceChange = (e) => {
      let newPrice = e.target.value.replace(/\D/g, '');
        setProductPrice(newPrice);
    }
    const handleProductDescriptionChange = (e) => {
        setProductDescription(e.target.value);
      }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
      if(file) {
        setProductImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
      };

      const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            auth.onAuthStateChanged(async(user)=>{
                if(user){
                    const docRef = doc(db,'products',props.productToBeUpdate.id);
                    const productSnapshot = await getDoc(docRef);
                    const existingData = productSnapshot.data();
                    let downloadURL;
                    if(productImage){
                        const storageRef = ref(storage, `productImages/${productImage.name}`);
                        await uploadBytes(storageRef, productImage);
                        downloadURL = await getDownloadURL(storageRef);
                    }
                    // console.log(existingData);
                    // console.log(existingData.Price);
                    const updatedProductData = {
                        Name: productName || existingData.Name,
                        Price : productPrice || existingData.Price,
                        Description : productDescription || existingData.Description,
                        ImageURL : downloadURL || existingData.ImageURL
                    }
                    console.log(updatedProductData);
                    await updateDoc(docRef,updatedProductData);
                    props.getProductList();
                    navigate('/');
                }
            })
        } catch (err) {
            console.error(err);
        }
    }
  return (
    <div className="row my-4 text-center">
      <h1>Update Product</h1>
      <form onSubmit={handleUpdateProduct} className="mx-auto col-8 col-md-6 col-lg-4 border border-dark p-4 rounded">
        <div className="form-floating mb-3">
            <input type="text"
            className="form-control"
            id="productName"
            value={productName}
            placeholder="Enter Product Name"
            onChange={handleProductNameChange}
            />
            <label htmlFor="productName">Product Name :</label>
        </div>
        <div className="form-floating mb-3">
            <input type="text"
            className="form-control"
            id="productPrice"
            value={productPrice}
            placeholder="Enter Product Price"
            onChange={handleProductPriceChange}
            />
            <label htmlFor="productPrice">Product Price :</label>
        </div>
        <div className="form-floating mb-3">
            <input type="text"
            className="form-control"
            id="productDescription"
            value={productDescription}
            placeholder="Enter Product Description"
            onChange={handleProductDescriptionChange}
            />
            <label htmlFor="productDescription">Product Description :</label>
        </div>
        
        <div className="form-floating mb-3">
            <input type="file"
            className="form-control py-5 px-3"
            id="productImage"
            accept="image/*"
            placeholder="Add Product Image"
            onChange={handleFileChange} 
            />
            <label htmlFor="productImage">Product Image :</label>
        </div>
        {imagePreview  && (
          <div className="mb-3">
            <h4>Product Image Preview</h4>
            <img src={imagePreview } alt="Product" style={{ width: '200px' }} />
          </div>
        )}
    <button className="form-control btn btn-primary" type="submit">Update Product</button>
      </form>
    </div>
  )
}

export default AdminUpdateProduct