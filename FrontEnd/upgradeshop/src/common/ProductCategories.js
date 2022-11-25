import React , { useState,useEffect } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import '../components/products/Products.css';
import { useDispatch, useSelector } from "react-redux";
import { PRODUCTCATEGORYSELECTED } from '../common/dataSlice';
  
function ProductCategories(props){
    
    //Below state object is for storing the product categories
    const [productCategories,setProductCategories]  = useState([]);

    const dispatch = useDispatch();
    
    //Below is for retrieving the selected category to retrieve the list of product categories from the database
    const categorySelected = useSelector((state) => state.categorySelected);

    //This function will dispatch the category selected to the store
    const handleChange = (event) => {
        dispatch(PRODUCTCATEGORYSELECTED(event.target.value));
        //This code has been written for redirecting from details to the products page or on the products page
        window.location.href = '/products';
      };

    //This code is to load the product categories
    useEffect(() => {
            loadCategories();
    },[]);       

    //function to bring the product categories from the database
    const loadCategories = () => {
            
        const data = null;

        let xhrloadCategories = new XMLHttpRequest();
        let prodCat ;
        xhrloadCategories.addEventListener("readystatechange", function () {
            if ((xhrloadCategories.readyState === 4) && (xhrloadCategories.status === 200)) {
                prodCat = JSON.parse(xhrloadCategories.responseText);
                setProductCategories(prodCat);   
            }
            else if ((xhrloadCategories.readyState === 4) && (xhrloadCategories.status !== 200)) {
                setProductCategories([]);
            }
        });
        xhrloadCategories.open("GET", props.baseUrl + "products/categories",true);
        xhrloadCategories.setRequestHeader('Content-type', 'application/json');
        xhrloadCategories.send(data);
      }
    return(
        <div> 
            <div id = "toggle">
                <ToggleButtonGroup 
                    color = "primary"
                    value = {categorySelected}
                    exclusive
                    onChange = {handleChange}
                    aria-label = "Platform"
                    >
                    <ToggleButton value = "all">All</ToggleButton>
                    {/*The below code is for dynamically populating the categories */}
                        {productCategories?.map((category) => (
                            <ToggleButton value={category}>{category}</ToggleButton> 
                         ))}        
                </ToggleButtonGroup>
            </div> {/* end of div id toggle */}     
        </div>//main div ending
    );
};

export default ProductCategories;