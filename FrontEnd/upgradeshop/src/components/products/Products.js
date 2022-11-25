//This is being built as part of Capstone project.
//Products.js contains all the functionailities with respect to the display of products for different users
//Created By : Sanju Jiji


import React , { useState,useEffect,Fragment } from 'react';
import Header from '../../common/header/Header';
import './Products.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from "react-redux";
import ProductCategories from '../../common/ProductCategories';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PRODUCTMODIFIEDSHOW,PRODUCTMODIFIEDNAMESHOW,QUANTITY,ORDERPLACEDSHOW } from '../../common/dataSlice';

function Products(props){
    
    //local state objects for storing various intermediate states
    const [sortBy, setSortBy]                                   = useState('');
    const [products,setProducts]                                = useState([]);
    const [dialogDeleteOpen,setDialogDeleteOpen]                = useState(false);
    const [productNameToBeDeleted,setProductNameToBeDeleted]    = useState("");
    const [snackBarShow,setSnackBarShow]                        = useState(true);
    const [prodToDelete,setProdToDelete]                        = useState("");

    //state objects in the central store being retrieved for status checking
    const categorySelected      = useSelector(state => state.categorySelected);
    const searchBarValue        = useSelector(state => state.searchBarValue);
    const adminShowStore        = useSelector(state => state.adminBtnShow);
    const orderPlacedShowStore  = useSelector(state => state.orderPlaced);
    const productModified       = useSelector(state => state.productModified);
    const productModifiedName   = useSelector(state => state.productModifiedName);
    
    const dispatch = useDispatch();
    dispatch(QUANTITY(0));

    //for displaying the Order placed snackbar
    const [orderState, setOrderState] = useState({
        openOrder: false,
        verticalOrder: 'top',
        horizontalOrder: 'right'
      });
    const {openOrder,verticalOrder,horizontalOrder} = orderState;

    const handleClickOrder = () => {
        setOrderState({ ...orderState , openOrder: true });
    };
    
    const handleCloseOrder = () => {
        setOrderState({ ...orderState, openOrder: false });
        dispatch(ORDERPLACEDSHOW(false));
    };

    const actionOrder = (
        <Fragment>
          <IconButton
            size = "small"
            aria-label = "close"
            color = "inherit"
            onClick = {handleCloseOrder}
          >
            <CloseIcon fontSize = "small" />
          </IconButton>
        </Fragment>
      );

    //for displaying the product deleted snackbar
    const [deleteProdState, setDeleteProdState] = useState({
        deleteProd: false,
        verticalDeleteProd: 'top',
        horizontalDeleteProd: 'right'
      });
    const {deleteProd,verticalDeleteProd,horizontalDeleteProd} = deleteProdState;

    const handleOpenProdDelete = () => {
        setDeleteProdState({ ...deleteProdState , deleteProd: true });
    };
    
    const handleCloseProdDelete = () => {
        setDeleteProdState({ ...deleteProdState, deleteProd: false });
        setProdToDelete("");
    };

    const actionProductDelete = (
        <Fragment>
          <IconButton
            size = "small"
            aria-label = "close"
            color = "inherit"
            onClick = {handleCloseProdDelete}
          >
            <CloseIcon fontSize = "small" />
          </IconButton>
        </Fragment>
      );

    //for displaying the product modification snackbar
    const [modifyProdState, setModifyProdState] = useState({
        openModifyProd: false,
        verticalModify: 'top',
        horizontalModify: 'right'
      });
    const {openModifyProd,verticalModify,horizontalModify} = modifyProdState;

    //For displaying the snackbar after the order is placed on the products page
    useEffect(() => {
        handleClickOrder({
            verticalOrder: 'top',
            horizontalOrder: 'right'
          });
    },[orderPlacedShowStore]);

    //For displaying the snackbar after the product is modified on the products page
    useEffect(() => {
        handleModifyProdOpen({
            verticalModify: 'top',
            horizontalModify: 'right'
          });
    },[productModified]);

    const handleModifyProdOpen = () => {
        setModifyProdState({ ...modifyProdState , openModifyProd: true });
    };

    const handleModifyProdClose = () => {
        setModifyProdState({ ...modifyProdState , openModifyProd: false });
        dispatch(PRODUCTMODIFIEDSHOW(false));
    };
    
    const actionModifyProd = (
        <Fragment>
          <IconButton
            size = "small"
            aria-label = "close"
            color = "inherit"
            onClick = {handleModifyProdClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Fragment>
      );

    //For capturing the sort By order
    const handleSortChange = (event) => {
        setSortBy(event.target.value);
      }      

    //This code is to load the products
    useEffect(() => {
            loadProducts();
    },[categorySelected,sortBy,searchBarValue]);

    //function to sort the products array by price
    //Ascending order
    const sortByPriceAsc = (arr) => {
        arr.sort((a, b) => {
        return parseInt(a.price) - parseInt(b.price);
        });
    }

    //Descending order
    const sortByPriceDesc = (arr) => {
        arr.sort((a, b) => {
            return parseInt(b.price) - parseInt(a.price);
        });
    }

    //function to sort the products by dates
    const sortByDates = (arr) => {
        arr.sort((a, b) => {
            let da = new Date(a.updatedAt),
                db = new Date(b.updatedAt);
            return db - da;
        });
    }

    //pop the dialog box before deletion
    const handleDialogClickOpen = (e) => {
        setDialogDeleteOpen(true);
        setProdToDelete(e.currentTarget.getAttribute("value1"));
    };
        
    const handleDialogClose = () => {
        setDialogDeleteOpen(false);
        setProdToDelete("");
    };

    const handleDeletion = () => {
        deleteSelectedProduct(prodToDelete);
        handleDialogClose();
    }

    //Opening the modify page on clicking the edit button
    const openModifyPage = (e) => {
        dispatch(PRODUCTMODIFIEDSHOW(false));
        dispatch(PRODUCTMODIFIEDNAMESHOW(""));
        window.location.href = "/modify/"+ e.currentTarget.getAttribute("value1");
    }

    //function to bring the products from the database
    const loadProducts = () => {
        
        const data = null;
        let xhrloadProducts = new XMLHttpRequest();
        let prods ;
        xhrloadProducts.addEventListener("readystatechange", function () {
            if ((xhrloadProducts.readyState === 4) && (xhrloadProducts.status === 200)) {
                prods = JSON.parse(xhrloadProducts.responseText);
                //the below piece of code is to check if there are any specific categories selected
                if (categorySelected !== "all"){
                    var newArray = prods.content.filter((element) => {
                        return (element.category === categorySelected);
                    });
                }
                else {
                        newArray = prods.content;         
                };
                
                var newArray1;
                if (searchBarValue){
                    newArray1 = newArray.filter((element) => {
                        return (element.name.toUpperCase().search(searchBarValue.toUpperCase())>=0);
                    });
                }
                else {
                    newArray1 = newArray;
                }
                
                //sort the array based on selection
                if (sortBy === 20){
                    sortByPriceDesc(newArray1);
                }
                else if (sortBy === 30){
                    sortByPriceAsc(newArray1);
                }
                else if (sortBy === 40){
                    sortByDates(newArray1);
                }
                setProducts(newArray1);
            }
            else if ((xhrloadProducts.readyState === 4) && (xhrloadProducts.status !== 200)) {
                setProducts([]);
            }
    });
    xhrloadProducts.open("GET", props.baseUrl + "products",true);
    xhrloadProducts.setRequestHeader('Content-type', 'application/json');
    xhrloadProducts.send(data);
    }

      //call product details page
      const callProdDetails = (productId) => {
        window.location.href = '/products/'+productId;
      }
    

    //function to delete a product
    const deleteSelectedProduct = (prodId) => {
        const data = null;
        var productIdToDelete = prodId;
        setProductNameToBeDeleted("Product "+document.body.querySelector("#productName").innerHTML+" deleted successfully!");
        
        let xhrDeleteProduct = new XMLHttpRequest();
        xhrDeleteProduct.addEventListener("readystatechange", function () {
            
            if ((xhrDeleteProduct.readyState === 4) && (xhrDeleteProduct.status === 200)) {
                //create snackbar to show successful deletion
                loadProducts();
                setSnackBarShow(true);
                handleOpenProdDelete({
                    verticalDeleteProd      : 'top',
                    horizontalDeleteProd    : 'right'
                  });
                  
            }
            else if ((xhrDeleteProduct.readyState === 4) && (xhrDeleteProduct.status !== 200)){
               //show an error snackbar to show unsuccessful deletion
               setProductNameToBeDeleted("Product "+document.body.querySelector("#productName").innerHTML+" was not deleted!");
               setSnackBarShow(false);
               handleOpenProdDelete({
                verticalDeleteProd      : 'top',
                horizontalDeleteProd    : 'right'
              });
            }
    });
        xhrDeleteProduct.open("DELETE", props.baseUrl + "products/"+productIdToDelete,true);
        xhrDeleteProduct.setRequestHeader("Authorization",sessionStorage.getItem('x-auth-token'));
        xhrDeleteProduct.setRequestHeader('Content-type', 'application/json');
        xhrDeleteProduct.send(data);
    }
    return(
        <div> 
            {/**Display the header component */}
            <header>
                <Header />
            </header>
            <br></br> <br></br> <br></br><br></br>

            {/**Display the Product Categories component */}
                <ProductCategories  baseUrl={props.baseUrl}/>
            <br></br>
            
            {/* Sort by dropdown */}
            <div className = "select">
                <InputLabel id = "sortByLabel">Sort By:</InputLabel>
                <FormControl sx = {{minWidth: 200 }}>
                    <Select
                        value = {sortBy}
                        onChange = {handleSortChange}
                        displayEmpty
                        inputProps = {{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem value="">
                                <i>Select...</i>
                            </MenuItem>
                            <MenuItem value = {10}>Default</MenuItem>
                            <MenuItem value = {20}>Price: High to Low</MenuItem>
                            <MenuItem value = {30}>Price: Low to High</MenuItem>
                            <MenuItem value = {40}>Newest</MenuItem>
                    </Select> 
                </FormControl>
            </div>{/* end of div select */}
            <br></br><br></br><br></br><br></br>

            {/* Below code is for dividing the web page into grids for product display */}
            <div className = "prodDisplay">
                <Box sx = {{ width : '100%' }}>
                    <Grid container rowSpacing = {3} columnSpacing = {{ xs : 2, sm : 4, md : 4 }} >
                            {/*The below code is for dynamically populating the products */}
                            {products?.map((product) => (
                                <Grid item xs = {4} > 
                                    <Card sx = {{ width : 350 , height : 450}} className = "cardBody">
                                        <CardContent>
                                            <div id = "image">
                                                <img src = {product.imageURL}  alt = {product.imageURL} width = "250" height = "175"></img>
                                            </div>
                                        
                                            <div id="prodTitle">
                                                <Typography  style={{wordWrap : "true"}} sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
                                                    <b id="productName">{product.name}</b>
                                                </Typography>
                                                
                                                <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
                                                    <b><span>&#8377;</span>{product.price}</b>
                                                </Typography>
                                            </div>

                                                <Typography className="content" sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                    {product.description}
                                                </Typography>
                                        </CardContent>

                                        <div className="cardFooter">
                                            <div id = "commonButton"> 
                                                <Button id = "colorSpecs" size="small" variant="contained" onClick = {() => callProdDetails(product.productId)}>Buy</Button>
                                            </div>

                                            {adminShowStore ?
                                                <div id="adminButton">
                                                    <IconButton value1 = {product.productId} onClick={openModifyPage} aria-label="menu" data-cy="edit-settings">
                                                        <EditIcon /> 
                                                    </IconButton>
                                                    
                                                    <IconButton value1 = {product.productId} onClick={handleDialogClickOpen} aria-label="menu" data-cy="edit-settings">
                                                        <DeleteIcon /> 
                                                    </IconButton>
                                                </div>
                                                :null}
                                        </div>
                                    </Card>
                                </Grid>
                            ))}   
                    </Grid>
                </Box>
            </div> {/* Grid ending */}

             {/*Snackbar for order completion */}
             {orderPlacedShowStore ?
             <div>
                <Snackbar sx = {{width : '10'}}
                    anchorOrigin = {{
                            vertical : 'top',
                            horizontal : 'right',
                    }}
                    open = {openOrder}
                    onClose = {handleCloseOrder}
                    key = {verticalOrder + horizontalOrder}
                    autoHideDuration = {6000}
                >
                    <SnackbarContent sx = {{ backgroundColor : "green", color : "white"}}
                        message = "Order placed successfully!"
                        action = {actionOrder}>
                    </SnackbarContent>
                </Snackbar>
            </div> :null
             }

             {/**Block of code for opening the dialog box before product deletion */}
             <div>
                <Dialog open = {dialogDeleteOpen} onClose = {handleDialogClose}>
                    <DialogTitle>Confirm Deletion Of Product!</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete the product?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick = {handleDeletion}>OK</Button>
                        <Button onClick = {handleDialogClose}>CANCEL</Button>
                    </DialogActions>
                </Dialog>
            </div>

            {/*Snackbar for product deletion */}
             <div>
                <Snackbar sx = {{width : '10'}}
                    anchorOrigin = {{
                            vertical : 'top',
                            horizontal : 'right',
                    }}
                    open = {deleteProd}
                    onClose = {handleCloseProdDelete}
                    key = {verticalDeleteProd + horizontalDeleteProd}
                    autoHideDuration = {6000}
                >
                    {
                    snackBarShow ?
                    <SnackbarContent sx = {{ backgroundColor : "green", color : "white"}}
                        message = {productNameToBeDeleted}
                        action = {actionProductDelete} 
                    >
                    </SnackbarContent>
                    :
                    <SnackbarContent sx = {{ backgroundColor : "green", color : "white"}}
                        message = {productNameToBeDeleted}
                        action = {actionProductDelete} >
                    </SnackbarContent>
                    }
                </Snackbar>
            </div> 

            {/*Snackbar for product modification */}
            {productModified ?
            <div>
                <Snackbar sx = {{width : '10'}}
                    anchorOrigin = {{
                            vertical : 'top',
                            horizontal : 'right',
                    }}
                    open = {openModifyProd}
                    onClose = {handleModifyProdClose}
                    key = {verticalModify + horizontalModify}
                    autoHideDuration = {6000}
                >
                    <SnackbarContent sx = {{ backgroundColor: "green", color : "white"}}
                        message = {productModifiedName}
                        action = {actionModifyProd} >
                    </SnackbarContent>
                </Snackbar>
            </div>
             : null
            }
        </div>//main div ending
    );
};

export default Products;