import React from 'react';  
import ProductCard from './ProductCard';

export default function ProductDisplay(props) {
  const productList = props.searchString ? props.searchedList : props.productList;

  return (
    <div>
            <h1 className='text-center my-4'>Our Products</h1>
            <div className="text-end me-md-5 mb-3 me-3">
              <span className='fs-4'>Sort by Price</span>
            <i className="bi bi-sort-down display-6 mx-3" style={{cursor: 'pointer'}} onClick={()=>{
              props.sortDescending();
            }}></i>
            <i className="bi bi-sort-up display-6 mx-3" style={{cursor: 'pointer'}} onClick={()=>{
              props.sortAscending();
            }}></i>
            </div>

      <div className="container">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 mb-5 gx-3 gy-4"> 
        {productList.map((product,i) => {
            return(
            <ProductCard product={product} index={i} addToCart={props.addToCart} removeFromDataBase={props.removeFromDataBase} setProductToBeUpdate={props.setProductToBeUpdate} isAdmin={props.isAdmin}/>
            );  
        })}
      </div>
      </div>
      
    </div>
  )
}
