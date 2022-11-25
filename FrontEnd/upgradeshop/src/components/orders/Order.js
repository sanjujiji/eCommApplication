//This is being built as part of Capstone project.
//AddOrders.js contains all the functionailities with respect to the product order
//Created By : Sanju Jiji

import React ,  { useState,useEffect,Fragment } from 'react';
import Header from '../../common/header/Header';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import './Order.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from "react-redux";
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { ORDERPLACEDSHOW } from '../../common/dataSlice';

    //Below styling is for spacing between form elements
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
  
    //Below is required for the stepper parts
    const steps = ["Items","Select Address","Confirm Order"];

function Order(props){

    //Below are the list of local state objects for storing the different states of the form elements
    const [activeStep, setActiveStep]           =   useState(0);
    const [selectAdd, setSelectAdd]             =   useState("");
    const [street,setStreet]                    =   useState("");
    const [city,setCity]                        =   useState("");
    const [name,setName]                        =   useState("");
    const [stateNew,setStateNew]                =   useState("");
    const [landmark,setLandmark]                =   useState(""); 
    const [zipCode,setZipCode]                  =   useState("");
    const [contactNo, setContactNo]             =   useState("");
    const [prodDetails,setProdDetails]          =   useState({});
    const [savedAddrObj,setSavedAddrObj]        =   useState([]);
    const [selectedAddrObj,setSelectedAddrObj]  =   useState({});
    
    //Below is for setting the state for the address snackbar
    const [stateAdd, setStateAdd] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right'
      });
    const {vertical, horizontal, open } = stateAdd;
    
    const quantity = useSelector((state) => state.orderQuantity);
    const dispatch = useDispatch();
      
    //loads the details of the product from the session storage variable
    useEffect(() => {
        //Details of the product from the product details screen has been stored as a session variable to use the same for order display
        var dtls = JSON.parse(sessionStorage.prodDetails);
        setProdDetails(dtls);
    },[]);

    //loads the saved addresses of the user from the database
    useEffect(() => {
        loadAddress();  
    },[]);
      
    /*Stepper functions*/
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        document.getElementById("errorMsg").innerText = "";
    };

    //Below function is for handling the different phases of the stepper when the next button is clicked
    const handleNext = () => {
        document.getElementById("errorMsg").innerText = "";
        if ((activeStep === 1) && (selectAdd === "")) {
            handleClick({
                vertical    : 'top',
                horizontal  : 'right'
              })
        }
        else if ((activeStep === 1)){
            loadSelectedAddress();
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
        else if ((activeStep == 2)){
            addNewOrder();
        }
        else
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    //Below listed functions are for setting the different state variables
    const handleAddrChange = (event) => {
        setSelectAdd(event.target.value);
    }

    const streetChangeHandler = (event) => {
        setStreet(event.target.value);
    };

    const cityChangeHandler = (event) => {
        setCity(event.target.value);
    };

    const nameChangeHandler = (event) => {
        setName(event.target.value);
    };

    const stateChangeHandler = (event) => {
        setStateNew(event.target.value);
    }
    
    const landmarkChangeHandler = (event) => {
        setLandmark(event.target.value);
    }
    
    const zipCodeChangeHandler = (event) => {
        setZipCode(event.target.value);
    }

    const contactNoChangeHandler = (event) => {
        setContactNo(event.target.value);
    }
    
    //Below functions are for handling of the snackbar for the mandatory address
    const handleClick = () => {
        setStateAdd({ ...stateAdd, open: true });
    };
    
    const handleClose = () => {
        setStateAdd({ ...stateAdd, open: false });
    };

    const action = (
        <Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </Fragment>
      );

    //function to filter out the selected address
    const loadSelectedAddress = () => {
            const savedAddress = savedAddrObj.filter((el) => el.addressId === selectAdd);
            setSelectedAddrObj(savedAddress[0]);
        };

    //function to bring the address details from the database
    const loadAddress = () =>{
        
        const data = null;
        const emailIdOfLogin = sessionStorage.getItem("emailid")
        
        let xhrloadAddress = new XMLHttpRequest();
        let addressNew = [];
        xhrloadAddress.addEventListener("readystatechange", function () {
            if ((xhrloadAddress.readyState === 4) && (xhrloadAddress.status === 200)) {
                addressNew = JSON.parse(xhrloadAddress.responseText);
                setSavedAddrObj(addressNew.content);
            }
            else if ((xhrloadAddress.readyState === 4) && (xhrloadAddress.status !== 200)) {
                addressNew = [];
                setSavedAddrObj(addressNew);
            }
    });
        xhrloadAddress.open("GET", props.baseUrl + "address?emailid="+emailIdOfLogin,true);
        xhrloadAddress.setRequestHeader("Authorization",sessionStorage.getItem('x-auth-token'));
        xhrloadAddress.setRequestHeader('Content-type', 'application/json');
        xhrloadAddress.send(data);
    }

    //Below function is to add new addresses
    const addNewAddress = () => {
        document.getElementById("errorMsg").innerText = "";
        let addressData = JSON.stringify({
            "name"          :   name,
            "street"        :   street,
            "city"          :   city,
            "state"         :   stateNew,
            "landmark"      :   landmark,
            "zipCode"       :   zipCode,
            "phoneNo"       :   contactNo
        });
        let xhrAddAddress = new XMLHttpRequest();
        xhrAddAddress.addEventListener("readystatechange", function () {
        if ((xhrAddAddress.readyState === 4) && (xhrAddAddress.status === 200)) {
                //loadAddress is being called to populate the drop down with the newly added address
                loadAddress();
                
                //reset the address fields of the state objects for the next address usage
                setStreet("");
                setName("");
                setCity("");
                setStateNew("");
                setLandmark("");
                setContactNo("");
                setZipCode("");
        }
        else if ((xhrAddAddress.readyState === 4) && (xhrAddAddress.status !== 200)) {
                //return the error message
                if (JSON.parse(xhrAddAddress.responseText).message != undefined)
                    document.getElementById("errorMsg").innerText = JSON.parse(xhrAddAddress.responseText).message;
                }
        });
        xhrAddAddress.open("POST", props.baseUrl + "addresses",true);
        xhrAddAddress.setRequestHeader("Authorization", sessionStorage.getItem('x-auth-token'));
        xhrAddAddress.setRequestHeader('Content-type', 'application/json');
        xhrAddAddress.send(addressData);
    }

    //Below function is to add new order
    const addNewOrder = () => {
        
        document.getElementById("errorMsg").innerText = "";
        let orderData = JSON.stringify({
            "productId" :   prodDetails.productId,
            "addressId" :   selectedAddrObj.addressId,
            "quantity"  :   quantity
        });

        let xhrAddOrder = new XMLHttpRequest();
        xhrAddOrder.addEventListener("readystatechange", function () {
            if ((xhrAddOrder.readyState === 4) && (xhrAddOrder.status === 200)) {
                //After successful placing of order user will be diverted back to the products page
                dispatch(ORDERPLACEDSHOW(true));
                window.location.href="/products";  
            }
            else if ((xhrAddOrder.readyState === 4) && (xhrAddOrder.status !== 200)) {
                    if (JSON.parse(xhrAddOrder.responseText).message != undefined)
                        document.getElementById("errorMsg").innerText = JSON.parse(xhrAddOrder.responseText).message;
                }
        });
        
        xhrAddOrder.open("POST", props.baseUrl + "orders",true);
        xhrAddOrder.setRequestHeader("Authorization", sessionStorage.getItem('x-auth-token'));
        xhrAddOrder.setRequestHeader('Content-type', 'application/json');
        xhrAddOrder.send(orderData);
    }
    return(
        <div>
            <header>
                <Header />
            </header>  
             
            {/*The below piece of code is for setting up of stepper */}
            <div id = "stepper">
                <Box sx = {{ width : '100%' }}>
                    <Stepper activeStep = {activeStep}>
                        {steps.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};
                            return (
                                <Step key = {label} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>      
                </Box>
            </div>{/*ending div for stepper */}
            
            {/* Below code is for dividing the web page into grids for product display */}
            {
            (activeStep === 0) ? 
            <div className = "gridMui" >
                <Box sx={{ width : '100%', margin :'1%'}}>
                    <Grid container sx = {{mr : 10, ml : 10}}>
                        <Grid item >
                            <Card sx = {{ width : 450, height : 450}}>
                                <CardContent>
                                    <img src = {prodDetails.imageURL} alt = "image" width = "375" height = "375"></img>
                                </CardContent>
                            </Card> 
                        </Grid>

                        <Grid item>
                            <Card sx = {{ width : 450 , height : 450}}>
                                <CardContent>
                                    <div>

                                        <Typography style = {{wordWrap : "false"}} sx = {{ fontSize: 24 }} gutterBottom>
                                            <b>{prodDetails.name} </b> 
                                        </Typography>

                                        <Typography style = {{wordWrap : "false"}} sx = {{ fontSize: 16 }} gutterBottom>
                                            Quantity: <b>{quantity} </b> 
                                        </Typography>
                                        
                                        <Typography style = {{wordWrap : "false"}} sx = {{ fontSize: 16 }} gutterBottom>
                                            Category: <b>{prodDetails.category}</b>
                                        </Typography>
                                        <br></br>
                                        
                                        <Typography sx = {{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            {prodDetails.description}
                                        </Typography>
                                        <br></br>
                                        
                                        <Typography sx = {{ fontSize: 24 }} color = "red" gutterBottom>
                                            <span>&#8377;</span>{prodDetails.price * quantity}
                                        </Typography>
                                        <br></br> <br></br>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>    
            </div>   
            :null}
            
            {/*Below pieces of code are for adding / selecting shipping address */}
            {
            (activeStep === 1) ?                             
                <div className ='outerDiv'>
                    <div className = "innerDiv">
                            <FormControl sx = {{minWidth : 800 }}>
                                <InputLabel id = "addressSelect">Select Address</InputLabel>
                                    <Select
                                        labelId = "addressSelect"
                                        id = "demo-simple-select"
                                        value = {selectAdd}
                                        label = "Select Address"
                                        onChange = {handleAddrChange}
                                    >
                                        <MenuItem value = {0}>Select...</MenuItem>
                                            {savedAddrObj?.map((addr) => (
                                        <MenuItem value={addr.addressId}>{addr.name+" --> "+addr.street+" ,"+addr.city+" ,"+addr.   landmark+" ,"+addr.state+" - "+addr.zipCode}
                                        </MenuItem>
                                    ))};
                                    </Select>            
                            </FormControl>
                            <br></br><br></br> 
                    </div>{/* end of div select */}
                    
                    <div className = "innerDiv">
                        <InputLabel>- OR -</InputLabel>        
                    </div>{/* end of div InputLabel */}
                    <br></br>

                    <div className = "innerDiv">
                        <InputLabel id = "addAddress">Add Address</InputLabel>
                    </div>{/* end of div InputLabel for address*/}
                        
                    <div className = "innerDiv">
                        <ThemeProvider theme = {theme}>
                            <Typography variant = "body1" gutterBottom>
                                <FormControl required>
                                    <TextField 
                                        required
                                        value = {name}
                                        type = "text"
                                        id = "outlined-required"
                                        label = "Address Name"
                                        sx = {{width : { sm : 200, md : 300 }}}
                                        onChange = {nameChangeHandler}
                                    />
                                </FormControl>
                            </Typography>
                        </ThemeProvider>    
                
                        <ThemeProvider theme = {theme}>
                            <Typography variant = "body1" gutterBottom>
                                <FormControl required>
                                    <TextField 
                                        required
                                        value = {contactNo}
                                        type = "number"
                                        id = "outlined-required"
                                        label = "Contact Number"
                                        sx = {{width : { sm : 200, md : 300 }}}
                                        onChange = {contactNoChangeHandler}
                                    />
                                </FormControl>
                            </Typography>
                        </ThemeProvider>
                
                        <ThemeProvider theme = {theme}>
                            <Typography variant = "body1" gutterBottom>
                                <FormControl required>
                                    <TextField
                                        required
                                        value = {street}
                                        type = "text"
                                        id = "outlined-required"
                                        label = "Street"
                                        sx = {{width : { sm : 200, md : 300 }}}
                                        onChange = {streetChangeHandler}
                                    />
                                </FormControl>
                            </Typography> 
                        </ThemeProvider>       
                
                        <ThemeProvider theme = {theme}>
                            <Typography variant = "body1" gutterBottom>
                                <FormControl required>
                                    <TextField
                                        required
                                        value = {city}
                                        type = "text"
                                        id = "outlined-required"
                                        label = "City"
                                        sx = {{width : { sm : 200, md : 300 }}}
                                        onChange = {cityChangeHandler}
                                    />
                                </FormControl>
                            </Typography>
                        </ThemeProvider>    
                
                        <ThemeProvider theme = {theme}>
                            <Typography variant = "body1" gutterBottom>
                                <FormControl  required>
                                    <TextField
                                        required
                                        value = {stateNew}
                                        type = "text"
                                        id = "outlined-required"
                                        label = "State"
                                        sx = {{width : { sm : 200, md : 300 }}}
                                        onChange = {stateChangeHandler}
                                    />
                                </FormControl>
                            </Typography>
                        </ThemeProvider>    
                
                        <ThemeProvider theme = {theme}>
                            <Typography variant = "body1" gutterBottom>
                                <FormControl>
                                    <TextField
                                        value = {landmark}
                                        type = "text"
                                        id = "outlined"
                                        label = "Landmark"
                                        sx = {{width : { sm : 200, md : 300 }}}
                                        onChange = {landmarkChangeHandler}
                                    />
                                </FormControl>
                            </Typography>
                        </ThemeProvider>

                        <ThemeProvider theme = {theme}>
                            <Typography variant = "body1" gutterBottom>
                                <FormControl>
                                    <TextField
                                        required
                                        value = {zipCode}
                                        type = "number"
                                        id = "outlined-required"
                                        label = "Zip Code"
                                        sx = {{width : { sm : 200, md : 300 }}}
                                        onChange = {zipCodeChangeHandler}
                                    />
                                </FormControl>
                            </Typography>
                        </ThemeProvider>

                        <Button id = "colorSpecs" variant = "contained" sx = {{width : { sm : 200, md : 300 }}} onClick={addNewAddress}>SAVE ADDRESS</Button>
                        <br/><br/>
                    </div>{/*End of inner div */}
                </div>
                : null}

                {/*Below piece of code is for the Order confirmation */}
                {/* Below code is for dividing the web page into grids for order confirmation display */}
                {
                (activeStep === 2) ?    
                <div className = "gridMui">
                <Box sx = {{ width : '100%'}}>
                    <Grid container>
                        <Grid item>
                            <Card sx = {{ width : 600 , height : 350}}>
                                <CardContent>
                                    <div>
                                        <Typography style = {{wordWrap : "false"}} sx = {{ fontSize: 24 }} gutterBottom>
                                            <b>{prodDetails.name} </b> 
                                        </Typography>

                                        <Typography style = {{wordWrap : "false"}} sx = {{ fontSize: 16 }} gutterBottom>
                                            Quantity: <b>{quantity} </b> 
                                        </Typography>
                                        
                                        <Typography style = {{wordWrap : "false"}} sx = {{ fontSize: 16 }} gutterBottom>
                                            Category: <b>{prodDetails.category}</b>
                                        </Typography>
                                        <br></br>
                                            
                                        <Typography sx = {{ fontSize: 14 }} color = "text.secondary" gutterBottom>
                                            <em>{prodDetails.description}</em>
                                        </Typography>
                                        <br></br>
                                        
                                        <Typography sx = {{ fontSize: 24 }} color = "red" gutterBottom>
                                            Total Price:<span>&nbsp;&#8377;</span> {prodDetails.price * quantity}
                                        </Typography>
                                        <br></br> <br></br>
                                    </div>
                                </CardContent>
                            </Card> 
                        </Grid>

                        {/**Below code is for adding a new address or selecing existing address from the drop down */}
                        <Grid item>
                            <Card sx={{ width: 600 , height : 350}}>
                                <CardContent>
                                    <div >
                                        <Typography style={{wordWrap : "false"}} sx={{ fontSize: 24 }} gutterBottom>
                                            <b>Address Details: </b> 
                                        </Typography>

                                        <Typography style={{wordWrap : "false"}} sx={{ fontSize: 16 }} gutterBottom>
                                            {selectedAddrObj.name} 
                                        </Typography>
                                        
                                        <Typography style={{wordWrap : "false"}} sx={{ fontSize: 16 }} gutterBottom>
                                            Contact No: <b>{selectedAddrObj.contactNumber}</b>
                                        </Typography>
                                        
                                        <Typography style={{wordWrap : "false"}} sx={{ fontSize: 16 }} gutterBottom>
                                            {selectedAddrObj.street+" ," +selectedAddrObj.city}
                                        </Typography>
                                        
                                        <Typography style={{wordWrap : "false"}} sx={{ fontSize: 16 }} gutterBottom>
                                            {selectedAddrObj.state}
                                        </Typography>

                                        <Typography style={{wordWrap : "false"}} sx={{ fontSize: 16 }} gutterBottom>
                                            {selectedAddrObj.zipCode}
                                        </Typography>
                                        
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
                
            </div> 
            :null}
            
            {/**Below code is for the display of back and next button based on condition within stepper */}
            {(activeStep < steps.length) ? 
                (
                <Fragment>
                    {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography> */}
                    <Box sx = {{ display : 'flex', flexDirection : 'row', justifyContent : 'center', pt : 2 }}>
                        <Button
                            color = "inherit"
                            disabled = {activeStep === 0}
                            onClick = {handleBack}
                            sx={{ mr : 1 }}
                            variant = "contained"
                        >
                            Back
                        </Button>

                        <Button id = "colorSpecs" variant = "contained" onClick = {handleNext}>
                            {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
                        </Button>
                    </Box>
                </Fragment>
            ) : null }
                
            {/*Snackbar for address mandatory element */}
            <div>
                <Snackbar sx = {{width : '10'}}
                    anchorOrigin = {{ vertical, horizontal }}
                    open = {open}
                    onClose = {handleClose}
                    key = {vertical + horizontal}
                >
                    <SnackbarContent sx = {{ backgroundColor : "red", color : "white"}}
                        message = "Please select address!"
                        action = {action}>
                    </SnackbarContent>
                </Snackbar>
            </div>

            <div id="errorMsgDiv">
                <p id="errorMsg"></p>
            </div>
        </div> //end of main div
    );
}

export default Order;