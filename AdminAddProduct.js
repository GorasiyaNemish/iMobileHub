import React , {useState} from 'react';
import Swal from 'sweetalert';
import { db , storage } from '../config/firebase'
import {addDoc, collection, getDocs} from 'firebase/firestore'
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import { useNavigate } from 'react-router';

export default function AdminAddProduct(props) {

    let [productName,setProductName] = useState('');
    let [productPrice,setProductPrice] = useState('');
    let [productDescription,setProductDescription] = useState('');
    let [productImage,setProductImage] = useState(null);
    let [imagePreview, setImagePreview] = useState(null);
    let navigate = useNavigate();
    let collectionRef = collection(db,"products");

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
    const handleAddProduct = async (e) => {
        e.preventDefault();
        if(productName.length<=0){
          Swal('Invalid Name','Enter Valid Product Name','info')
          return;
        }
        if(productPrice.length<=0){
          Swal('Invalid Price','Enter Valid Product Price','info')
          return;
        }
        if(productImage == null){
          Swal('No Image Found','Enter Valid Product Image','info')
          return;
        }

        try {
          // Check if the item already exists
      const querySnapshot = await getDocs(collectionRef);
      const existingProduct = querySnapshot.docs.find((doc) => doc.data().Name === productName);
      if (existingProduct) {
        // Item already exists, show alert
        Swal('Duplicate Product', 'Product already exists', 'info');
        setProductName('');
        setProductPrice('');
        setProductDescription('');
        setProductImage(null);
        return;
      }
      
      const storageRef = ref(storage, `productImages/${productImage.name}`);
      await uploadBytes(storageRef, productImage);
      const downloadURL = await getDownloadURL(storageRef);
      // console.log('File uploaded:', downloadURL);
  
      // Item does not exist, add it to Firestore
      await addDoc(collectionRef, {
        Name: productName,
        Price: Number(productPrice),
        ImageURL: downloadURL,
        Description : productDescription
      });
      Swal('Success',`${productName} Added Successfully`,'success');
        } catch (err) {
          console.error(err);
        }
        // Clear form fields
        setProductName('');
        setProductPrice('');
        setProductImage(null);
        props.getProductList();
        navigate('/')
    }
  return (
    <div className="row my-4 text-center">
      <h1>Add New Product</h1>
      <form onSubmit={handleAddProduct} className="mx-auto col-8 col-md-6 col-lg-4 border border-dark p-4 rounded">
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
    <button className="form-control btn btn-primary" type="submit">Add Product</button>
      </form>
    </div>
  )
}
