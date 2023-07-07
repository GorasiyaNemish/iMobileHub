import React, { useState , useEffect} from 'react';
import Nav from './components/Nav.js';
import ProductDisplay from './components/ProductDisplay.js';
import Cart from './components/Cart.js';
import Payment from './components/Payment.js';
import AdminAddProduct from './components/AdminAddProduct.js';
import { Routes,Route, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert';
import { collection, getDocs , doc , setDoc , getDoc , updateDoc , deleteDoc} from 'firebase/firestore';
import { db , auth , storage, googleProvider} from './config/firebase.js';
import { ref, getDownloadURL} from 'firebase/storage';
import { signOut , signInWithEmailAndPassword, signInWithPopup} from 'firebase/auth';
import LoginPage from './components/LoginPage.js';
import SignUpPage  from './components/SignUpPage.js';
import AdminAddCouponCode from './components/AdminAddCouponCode.js';
import AdminUpdateProduct from './components/AdminUpdateProduct.js';

function App() {
  const location = useLocation();
  const currentpath = location.pathname;
  const navigate = useNavigate();
  let [productList,setProductList]=useState([]);
  let [totalItems , setTotalItems]=useState(0);
  let [searchedList,setSearchedList]=useState([]);
  let [searchString,setSearchString]=useState('');
  let [currUserLoggedIn,setCurrUserLoggedIn] = useState(null);
  const [cartProductList , setCartProductList] = useState([]);
  const [isCartUpdate,setIsCartUpdate]=useState(false);
  const [totalQuantity , setTotalQuantity] = useState(0);
  const [totalPrice , setTotalPrice] = useState(0);
  let [discountAmount,setDiscountAmount]=useState(0);
  let [isAdmin , setIsAdmin] = useState(false);
  let [isLoggedIn , setIsLoggedIn] = useState(false);
  let [logoURL, setLogoURL] = useState('');
  let [productToBeUpdate , setProductToBeUpdate]= useState([]);
  const [firstName,setFirstName]=useState('');
  const [unsubscribeAuth, setUnsubscribeAuth] = useState(null);
  
  let collectionRef = collection(db,"products");

  useEffect(()=>{
    // console.log(totalQuantity);
    getProductList();
    getCartProductList();
    fetchLogoURL();
    auth.onAuthStateChanged((user)=>{
      // console.log(user);
      if(user){
        setIsLoggedIn(true);
        if(user.email === 'admin@gmail.com'){
          setIsAdmin(true);
        }else{
          setIsAdmin(false);
        }
      }else{
        setIsLoggedIn(false);
      }
    })
    if (unsubscribeAuth) {
      unsubscribeAuth(); // Invoke the cleanup function before subscribing again
    }
  
    const newUnsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await currUserDetails(user);
      }
    });
  
    setUnsubscribeAuth(() => newUnsubscribeAuth);
  
    // Clean up the event listener when the component unmounts
    return () => {
      if (unsubscribeAuth) {
        unsubscribeAuth(); // Invoke the cleanup function when the component unmounts
      }
    };
  },[])
  useEffect(()=>{
    // console.log("effect");
    // console.log(totalQuantity);
    totalItemsFunction();
    getCartProductList();
    totalQuantityAndPriceFunction();
  },[isCartUpdate])  
  useEffect(() => {
    totalItemsFunction();
    totalQuantityAndPriceFunction();
 }, [cartProductList])
 
  const totalItemsFunction = () => {
    try {
      auth.onAuthStateChanged(async(user)=>{
        if(user){
          const cartCollectionRef = collection(db,`Cart ${user.email}`);
          const snapshot = await getDocs(cartCollectionRef);
          setTotalItems(snapshot.docs.length);
        }
      })
    } catch (err) {
      console.error(err);
    }
    
  }
  const currUserDetails = async (user) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const data = userDocSnapshot.data();
        const userFirstName = data.FirstName;
        console.log(userFirstName);
        setFirstName(userFirstName);
        console.log('User First Name:', userFirstName);
      } else {
        console.log('Document does not exist');
      }
    } catch (error) {
      console.error('Error retrieving user document:', error);
    }
  };

  // const currUserDetails = () => {
  //   try {
  //     auth.onAuthStateChanged(async(user)=>{
  //       if(user){
  //         // setCurrUserLoggedIn(user);
  //         const userDocRef = doc(db,'users',user.uid);
  //           const userDocSnapshot = await getDoc(userDocRef);
  //           if (userDocSnapshot.exists()) {
  //             const data = userDocSnapshot.data();
  //             const userFirstName = data.FirstName;
  //             setFirstName(userFirstName);
  //             // console.log(userFirstName);
  //           } else {
  //             console.log('Document does not exist');
  //           }
  //       }
  //     })
  //   } catch (err) {
  //     console.error(err);
  //   }
    
  // }
  const getProductList = async () => {
    try {
      const data =  await getDocs(collectionRef);
      const filteredData = data.docs.map((product)=>(
        {
          ...product.data(),
        id : product.id
      }
      )
      )
      setProductList(filteredData);
      // console.log(filteredData);
    } catch (err) {
      console.error(err);
    }
  }

  let cartProduct;

 const addToCart = (product) =>{
  try {
    console.log("addTo cart triggered 1");
    auth.onAuthStateChanged(async(user)=>{
      if(user){
        cartProduct = product;
        cartProduct['Quantity'] = 1;
        cartProduct['TotalProductPrice'] = cartProduct.Quantity*cartProduct.Price;
        const cartRef = doc(db,`Cart ${user.email}`,cartProduct.id);
        const cartDocsnapshot = await getDoc(cartRef);
        if(cartDocsnapshot.exists()){
          console.log("addTo cart triggered 2");
          Swal(product.Name, 'Already in the Cart', 'info');
          return;
        }else{
          Swal({
            title: product.Name,
            text: 'Are you sure you want to add this item to your cart?',
            icon: 'warning',
            buttons: ['No', 'Yes'],
            dangerMode: true,
          }).then(async (result) => {
            if (result === null || result === false) {
              // User clicked on "Cancel" button
            } else {
          try {
            await setDoc(cartRef,cartProduct);    
            // totalItemsFunction();
            Swal('Success', `${product.Name} added to cart!`, 'success');
            setIsCartUpdate((prev) => !prev);
            setDiscountAmount(0);
          } catch (err) {
            console.error(err);
          }
            }
          });
        }
        
      }else{
        Swal('Login First','You should be logged in before add to cart','info');
      }
    })
  } catch (err) {
    console.error(err);
  }
  
  
  }
  const couponCodeCollectionRef = collection(db,'CouponCodes');
  // const [isCouponApplied , setIsCouponApplied] = useState(false);
  const applyCoupon = async (couponCode) => {
    try {
      const querySnapshot = await getDocs(couponCodeCollectionRef);
      const matchedCoupon = querySnapshot.docs.find((doc)=> doc.data().CouponCode === couponCode);
      if(matchedCoupon){
        // console.log(matchedCoupon.data().DiscountUptoRupees);
        // setDiscountPercentage(matchedCoupon.data().DiscountPercentage);
        // setDiscountUptoRupees(matchedCoupon.data().DiscountUptoRupees);
        // setIsCouponApplied(true);
        let discountPercentage = matchedCoupon.data().DiscountPercentage;
        let discountUptoRupees = matchedCoupon.data().DiscountUptoRupees;
        Swal('Coupon Code Applied',`${matchedCoupon.data().DiscountPercentage} % Off. Upto ₹ ${matchedCoupon.data().DiscountUptoRupees}`,'success');
        setDiscountAmount(Math.min((totalPrice*discountPercentage)/100 , discountUptoRupees));
      }else{
        Swal('Invalid Coupon Code','Enter Valid Coupon Code','error');
        // setIsCouponApplied(false);
        setDiscountAmount(0);
      }
    } catch (err) {
      console.error(err);
    }
  }
  
  const getCartProductList = async () => {
    try {
      auth.onAuthStateChanged(async(user)=>{
        if(user){
          const newCollectionRef = collection(db,`Cart ${user.email}`);
          const newData = await getDocs(newCollectionRef);
            const requiredData = newData.docs.map((product)=>({
              ...product.data()
            }))
            // console.log("filter2222",requiredData);
            setCartProductList(requiredData);
        }
      })
    } catch (err) {
      console.error(err);
    }
  }
  let updateCartData;
  const incrementQuantity = (product) => {
    try {
      updateCartData = product;
    updateCartData.Quantity += 1;
    updateCartData.TotalProductPrice = updateCartData.Price * updateCartData.Quantity;
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, 'Cart ' + user.email, product.id);
        await updateDoc(docRef, updateCartData);
        setDiscountAmount(0);
        // Update the state with the updated data
        setCartProductList((prevCartProducts) => {
          const updatedCartProducts = prevCartProducts.map((cartProduct) => {
            if (cartProduct.id === product.id) {
              return updateCartData;
            }
            return cartProduct;
          });
          return updatedCartProducts;
        });
      }
    });
    } catch (err) {
      console.error(err);
    } 
  };

  const decrementQuantity = (product) => {
    try {
      updateCartData = product;
    if(updateCartData.Quantity > 1){
      updateCartData.Quantity -= 1;
      updateCartData.TotalProductPrice = updateCartData.Price * updateCartData.Quantity;
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const docRef = doc(db, 'Cart ' + user.email, product.id);
          await updateDoc(docRef, updateCartData);
          setDiscountAmount(0);
          // Update the state with the updated data
          setCartProductList((prevCartProducts) => {
            const updatedCartProducts = prevCartProducts.map((cartProduct) => {
              if (cartProduct.id === product.id) {
                return updateCartData;
              }
              return cartProduct;
            });
            return updatedCartProducts;
          });
      }
    });
  }     
    } catch (err) {
      console.error(err);
    }
}


// remove from cart
const removeItem = (product) => {
  try {
    auth.onAuthStateChanged(async(user)=>{
      if(user){
        const docRef = doc(db, 'Cart ' + user.email, product.id);
        await deleteDoc(docRef);
        setDiscountAmount(0);
        setCartProductList(prevCartProductsList =>
          prevCartProductsList.filter(item => item.id !== product.id)
          );
        }
        })
  } catch (err) {
    console.error(err);
  }
    }

    // remove from database by admin
    const removeFromDataBase = (product) =>{
      try {
        auth.onAuthStateChanged(async(user)=>{
          if(user){
            const docRef = doc(db , 'products', product.id);
            await deleteDoc(docRef);
            setProductList(prevProductList => prevProductList.filter(item => item.id !== product.id));
          }
        })
      } catch (err) {
        console.error(err);
      }
    }

    const sortDescending = () => {
      // console.log("clicked descending");
      let newList = [...productList].sort((a,b)=> b.Price-a.Price);
        setProductList(newList);
      // console.log(newList);
      // console.log(props.productList);
    }

    const sortAscending = () => {
      // console.log("clicked ascending");
      let newList = [...productList].sort((a,b)=> a.Price-b.Price);
        setProductList(newList);
      // console.log(newList);
      // console.log(props.productList);
    }

    const onSearch = (e,searchStringParam) => {
      e.preventDefault();
      let newSearchedList = [...productList].filter(item => item.Name.toLowerCase().includes(searchStringParam.toLowerCase()));
      setTimeout(() => {
        setSearchString(searchStringParam);
        setSearchedList(newSearchedList);
      }, 300);
    };
    const totalQuantityAndPriceFunction = () => {
      // console.log("ttttttt");
        try {
          let totalQuantityVariable = 0;
          let totalPriceVariable = 0;
          cartProductList.forEach((product)=>{
          totalQuantityVariable += product.Quantity;
          totalPriceVariable += product.TotalProductPrice;
          })
          setTotalQuantity(totalQuantityVariable);
          setTotalPrice(totalPriceVariable);
        } catch (err) {
          console.error(err);
        }
  }
  const fetchLogoURL = async () => {
    try {
      const logoRef = ref(storage, 'logo/logo.png');
      const url = await getDownloadURL(logoRef);
      setLogoURL(url);
    } catch (error) {
      console.error('Error retrieving logo URL:', error);
    }
  };
  const handleLogOut = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        await signOut(auth);
        // console.log("logout function");
        Swal('Logout Successful','We look forward to seeing you again soon','success');
        navigate('/login');
        setIsAdmin(false);
        setIsLoggedIn(false);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  }
  

  const handleLogin = async (e , email , password) => {
    e.preventDefault();
    console.log("user login function");
    try {
      await signInWithEmailAndPassword(auth,email,password);
      Swal('Login Successful','You Logged in successfully','success');
      console.log("login success");
      // getCurrentUserDetails();
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      console.error(err);
      Swal('Login Failed',err.message,'error');
    }
  }
  const handleLoginWithGoogle = async () => {
    try {
      await signInWithPopup(auth , googleProvider);
      Swal('Login Successful','You Logged in successfully','success');
      console.log("login success by google");
      const user = auth.currentUser;
      // console.log(user.displayName);
      setFirstName(user.displayName);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err){
      console.error(err);
      Swal('Login Failed',err.message,'error');
    }
  }
  const orderConfirmed = async () => {
    try {
      auth.onAuthStateChanged(async (user)=>{
        if(user){
          const userCartCollectionRef = collection(db,`Cart ${user.email}`);
          const cartSnapshot = await getDocs(userCartCollectionRef);

          // copy from cart to order
          cartSnapshot.forEach(async (document)=>{
            const data = document.data();
            const orderDocRef = doc(db,`Order ${user.email}`,document.id);
            await setDoc(orderDocRef,data); 
          })

          cartSnapshot.forEach(async (document)=>{
            const docRef = doc(db,`Cart ${user.email}`,document.id);
            await deleteDoc(docRef);
          })

          setCartProductList([]);
          setDiscountAmount(0);
        }
      })
    } catch (err) {
      console.error(err);
    }
  }
  const hideNav = ['/login','/signUp'].includes(currentpath);
  return (
    <>
    {
      hideNav ? null : <Nav 
      isAdmin = {isAdmin}
      totalItems={totalItems}
      currUserLoggedIn={currUserLoggedIn}
      firstName={firstName}
      productList={productList}
      setSearchedList={setSearchedList}
      searchString={searchString}
      setSearchString={setSearchString}
      isLoggedIn={isLoggedIn}
      setIsAdmin={setIsAdmin} 
      setIsLoggedIn={setIsLoggedIn}
      logoURL={logoURL}
      onSearch={onSearch}
      handleLogOut={handleLogOut}
      />
    }
    <Routes>
      <Route path="/" element={
        <ProductDisplay 
      productList={productList} 
      addToCart={addToCart} 
      setProductList={setProductList}
      searchedList={searchedList}
      searchString={searchString}
      isAdmin={isAdmin}
      sortDescending={sortDescending}
      sortAscending={sortAscending}
      removeFromDataBase={removeFromDataBase}
      setProductToBeUpdate={setProductToBeUpdate}
      />
    }/>
    
    <Route path="/login" element={<LoginPage setIsAdmin={setIsAdmin} setIsLoggedIn={setIsLoggedIn} handleLogin={handleLogin} handleLoginWithGoogle={handleLoginWithGoogle}/>}/>
    <Route path="/signUp" element={<SignUpPage/>}/>
      <Route path="/cart" element={
      <Cart 
      productList={productList} 
      totalItemsFunction={totalItemsFunction}
      totalItems={totalItems}
      applyCoupon={applyCoupon}
      cartProductList={cartProductList}
      incrementQuantity={incrementQuantity}
      decrementQuantity={decrementQuantity}
      removeItem={removeItem}
      totalPrice={totalPrice}
      totalQuantity={totalQuantity}
      discountAmount={discountAmount}
      />}/>
      <Route path="/payment" element={
      <Payment
      totalPrice={totalPrice}
      discountAmount={discountAmount}
      totalItems={totalItems}
      totalQuantity={totalQuantity}
      orderConfirmed={orderConfirmed}
      />}/>
      <Route path="/adminCouponCode" element={
      <AdminAddCouponCode
     
      />
      }/>
      <Route path="/adminUpdateProduct" element={<AdminUpdateProduct productToBeUpdate={productToBeUpdate} getProductList={getProductList}/> }/>
      <Route path="/admin" element={
      <AdminAddProduct
      productList={productList}
      setProductList={setProductList}
      getProductList={getProductList}
      />}/>
    </Routes>
    </>
  );
}

export default App;
