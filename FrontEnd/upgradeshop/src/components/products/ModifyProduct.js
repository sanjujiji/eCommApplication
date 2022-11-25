//This is being built as part of Capstone project.
//ModifyProduct.js will enable the modification of a product for an admin user
//Created By : Sanju Jiji

import React , { useState,useEffect } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import FormControl from '@material-ui/core/FormControl';
import Header from '../../common/header/Header';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@mui/material/Button';
import './Products.css';
import { useDispatch } from "react-redux";
import { PRODUCTMODIFIEDSHOW,PRODUCTMODIFIEDNAMESHOW } from '../../common/dataSlice';
import { TextareaAutosize } from '@mui/material';

function ModifyProduct(props){
    //Below listed are the local state objects for storing the states of the different form elements
    const [productName,setProductName]      =   useState("");
    const [category,setCategory]            =   useState("");
    const [manufacturer,setManufacturer]    =   useState("");
    const [availableItems,setAvailableItems]=   useState();
    const [price,setPrice]                  =   useState();
    const [imageURL,setImageURL]            =   useState("");
    const [prodDesc,setProdDesc]            =   useState("");
    
    const dispatch = useDispatch();

    //function to load the product details in the modify screen on loading
    useEffect(() => {
        loadProdDetails();
    },[]);

    //Below is the styling for spacing between form elements
    let theme = createTheme({
        spacing : 4,
      });
      
      theme = createTheme(theme,{
        typography: {
          body1 : {
            margin : theme.spacing(1),
          }
        },
      }); 

    //Below listed functions are for setting the different state variables in the form
    const productNameChangeHandler = (e) => {
        setProductName(e.target.value);
    };

    const categoryChangeHandler = (e) => {
        setCategory(e.target.value);
    };

    const manufacturerChangeHandler = (e) => {
        setManufacturer(e.target.value);
    };

    const availItemsChangeHandler = (e) => {
        setAvailableItems(e.target.value);
    };

    const priceChangeHandler = (e) => {
        setPrice(e.target.value);
    };

    const imageURLChangeHandler = (e) => {
        setImageURL(e.target.value);
    };

    const prodDescChangeHandler = (e) => {
        setProdDesc(e.target.value);
    };

    //function to get the details of the product that needs to be modified
    const loadProdDetails = () => {
        const data = null;
        //get the product id from the url
        const prodId = window.location.href.substring(window.location.href.lastIndexOf("/")+1);
        
        let xhrloadProdDetails = new XMLHttpRequest();
        let prodDetails ;
        xhrloadProdDetails.addEventListener("readystatechange", function () {
            if ((xhrloadProdDetails.readyState === 4) && (xhrloadProdDetails.status === 200)) {
                prodDetails = JSON.parse(xhrloadProdDetails.responseText);
                
                //set the state variables
                setProductName(prodDetails.name);
                setCategory(prodDetails.category);
                setManufacturer(prodDetails.manufacturer);
                setAvailableItems(prodDetails.availableItems);
                setPrice(prodDetails.price);
                setImageURL(prodDetails.imageURL);
                setProdDesc(prodDetails.description);

            }
            else if ((xhrloadProdDetails.readyState === 4) && (xhrloadProdDetails.status !== 200) && (JSON.parse(xhrloadProdDetails.responseText).message != undefined)) {
                document.getElementById("errorMsg").innerHTML = JSON.parse(xhrloadProdDetails.responseText).message;  
            }
    });
    
    xhrloadProdDetails.open("GET", props.baseUrl + "products/"+prodId,true);
    xhrloadProdDetails.setRequestHeader('Content-type', 'application/json');
    xhrloadProdDetails.send(data);
  }

    //function to modify the details of the product 
    const modifyProdDetails = () =>{
        const data = JSON.stringify({
            "name"              : productName,
            "category"          : category,
            "manufacturer"      : manufacturer,
            "availableItems"    : availableItems,
            "price"             : price,
            "imageURL"          : imageURL,
            "description"       : prodDesc
        });

        //get the product id from the url
        const prodId = window.location.href.substring(window.location.href.lastIndexOf("/")+1);
    
        let xhrModifyProdDetails = new XMLHttpRequest();
        
        xhrModifyProdDetails.addEventListener("readystatechange", function () {
            if ((xhrModifyProdDetails.readyState === 4) && (xhrModifyProdDetails.status === 200)) {
                dispatch(PRODUCTMODIFIEDSHOW(true));
                dispatch(PRODUCTMODIFIEDNAMESHOW("Product "+productName+" modified successfully!"));
                window.location.href='/products';
            }
            else if ((xhrModifyProdDetails.readyState === 4) && (xhrModifyProdDetails.status === 200 && (JSON.parse(xhrModifyProdDetails.responseText).message != undefined))) {
                document.getElementById("errorMsg").innerHTML = JSON.parse(xhrModifyProdDetails.responseText).message;  
            }
    });
    
    xhrModifyProdDetails.open("PUT", props.baseUrl + "products/"+prodId,TextareaAutosize);
    xhrModifyProdDetails.setRequestHeader("Authorization",sessionStorage.getItem('x-auth-token'));
    xhrModifyProdDetails.setRequestHeader('Content-type', 'application/json');
    xhrModifyProdDetails.send(data);
  }
    return(
        <div>
            {/**For loading the header component */}
            <header>
                <Header />
            </header>
            <br/><br/><br/><br/><br/>

            <div className = "modify">
                <InputLabel id = "modifyLabel">Modify Product</InputLabel>
                <br></br>
                
                <ThemeProvider theme = {theme}>
                    <Typography variant = "body1" gutterBottom>
                        <FormControl required>
                            <TextField 
                                required
                                value = {productName}
                                type = "text"
                                id = "outlined-required"
                                label = "Name"
                                sx = {{width : { sm : 200, md : 300 }}}
                                InputLabelProps = {{ shrink : true }}
                                onChange = {productNameChangeHandler}
                            />
                        </FormControl>
                    </Typography>
                </ThemeProvider>
            
                <ThemeProvider theme = {theme}>
                    <Typography variant = "body1" gutterBottom>
                        <FormControl required>
                            <TextField 
                                required
                                value = {category}
                                type = "text"
                                id = "outlined-required"
                                label = "Category"
                                sx = {{width : { sm : 200, md : 300 }}}
                                InputLabelProps = {{ shrink: true }}
                                onChange = {categoryChangeHandler}
                            />
                        </FormControl>
                    </Typography>
                </ThemeProvider>        
                
                <ThemeProvider theme = {theme}>
                    <Typography variant = "body1" gutterBottom>
                        <FormControl required>
                            <TextField 
                                required
                                value = {manufacturer}
                                type = "text"
                                id = "outlined-required"
                                label = "Manufacturer"
                                sx = {{width : { sm : 200, md : 300 }}}
                                InputLabelProps = {{ shrink : true }}
                                onChange = {manufacturerChangeHandler}
                            />
                        </FormControl>
                    </Typography>
                </ThemeProvider>
                
                <ThemeProvider theme = {theme}>
                    <Typography variant = "body1" gutterBottom>
                        <FormControl required>
                            <TextField
                                required
                                value = {availableItems}
                                type = "number"
                                id = "outlined-required"
                                label = "Available Items"
                                sx = {{width : { sm : 200, md : 300 }}}
                                InputLabelProps = {{ shrink : true }}
                                onChange = {availItemsChangeHandler}
                            />
                        </FormControl>
                    </Typography> 
                </ThemeProvider>       
                
                <ThemeProvider theme = {theme}>
                    <Typography variant = "body1" gutterBottom>
                        <FormControl required>
                            <TextField
                                required
                                value = {price}
                                type = "number"
                                id = "outlined-required"
                                label = "Price"
                                sx = {{width : { sm : 200, md : 300 }}}
                                InputLabelProps = {{ shrink : true }}
                                onChange = {priceChangeHandler}
                            />
                        </FormControl>
                    </Typography>
                </ThemeProvider>   

                <ThemeProvider theme = {theme}>
                    <Typography variant = "body1" gutterBottom>
                        <FormControl required>
                            <TextField
                                required
                                value = {imageURL}
                                type = "url"
                                id = "outlined-required"
                                label = "Image URL"
                                sx = {{width : { sm : 200, md : 300 }}}
                                InputLabelProps = {{ shrink : true }}
                                onChange = {imageURLChangeHandler}
                            />
                        </FormControl>
                    </Typography>
                </ThemeProvider> 
                
                <ThemeProvider theme = {theme}>
                    <Typography variant="body1" gutterBottom>
                        <FormControl  required>
                            <TextField
                                required
                                value = {prodDesc}
                                type = "text"
                                id = "outlined-required"
                                label = "Product Description"
                                sx = {{width : { sm : 200, md : 300 }}}
                                InputLabelProps = {{ shrink : true }}
                                onChange = {prodDescChangeHandler}
                            />
                            <br></br>

                            <Button onClick = {() => modifyProdDetails()} variant = "contained" sx = {{width : { sm : 200, md : 300 }}}>MODIFY PRODUCT</Button>
                        </FormControl>
                    </Typography>
                </ThemeProvider>    
                    <span id = "errorMsg"></span>
                    <br></br>
                    <span id ="successMsg"></span>
                </div> {/*end of div for the mid part*/}
        </div> //end of main div
    )
}

export default ModifyProduct;