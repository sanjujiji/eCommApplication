//This is being built as part of Capstone project.
//Login.js contains all the functionailities with respect to the login page
//Created By : Sanju Jiji

import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import '../header/Login.css';
import Header from '../header/Header';
import { withStyles } from "@material-ui/core/styles";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import Icon from '@mui/material/Icon';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { LOGINSHOW,LOGOUTSHOW,SIGNUPSHOW,HOMESHOW,SEARCHBARSHOW,ADDPRODUCTSHOW,ADMINSHOW } from '../dataSlice';
import jwt from 'jwt-decode';

//Below is for displaying the lock icon on the login page
const RedLockIcon = withStyles({
    root: {
      color: "white"
    }
  })(LockRoundedIcon);

function Login(props){

    //Local state variables for storing the user input email id and password
    const [emailId,setEmailId]              = useState("");
    const [loginPassword,setLoginPassword]  = useState("");

    const dispatch = useDispatch();
    
    //State objects status from the persist store
    // const loginShowStore = useSelector(state => state.loginShow);
    // const adminShowStore = useSelector(state => state.adminBtnShow);
    
    //functions to set the mail Id and the password on user input
    const emailIdChangeHandler = (e) => {
        setEmailId(e.target.value);
    };

    const loginPasswordChangeHandler = (e) => {
        setLoginPassword(e.target.value);
    }

    //this code will make a database call to check if the user is a valid user
    const invokeLogin = () => {
        
        let invokeLoginData = JSON.stringify({
            "email" : emailId,
            "password" : loginPassword
        });
        
        let xhrLogin = new XMLHttpRequest();
        xhrLogin.addEventListener("readystatechange", function () {
            if ((xhrLogin.readyState === 4) && (xhrLogin.status == 200)) {
                
                //save the x-auth-token to local storage for future use
                sessionStorage.setItem("x-auth-token",xhrLogin.getResponseHeader('x-auth-token'));
                
                //save the mail id in the session storage for future use
                sessionStorage.setItem("emailid",emailId);
                
                //check to see if the entered user has an ADMIN role
                if (jwt(xhrLogin.getResponseHeader('x-auth-token')).role.toUpperCase() === "ADMIN"){
                
                    //show the Add Product link and enable the edit and modify state objects for the products page
                    dispatch(ADDPRODUCTSHOW(true));
                    dispatch(ADMINSHOW(true));
                }
                
                //successful login should hide the login and Signup button and make the logout , home and search bar visible
                dispatch(LOGINSHOW(false));
                dispatch(LOGOUTSHOW(true));
                dispatch(SIGNUPSHOW(false));
                dispatch(HOMESHOW(true));
                dispatch(SEARCHBARSHOW(true));
                
                //redirect to the products page
                window.location.href = '/products';
            }
                else if ((xhrLogin.readyState === 4) && (xhrLogin.status !== 200)){
                //return the error message and display
                    if ((JSON.parse(xhrLogin.responseText).message) != undefined)
                        document.getElementById("errorMsg").innerText = JSON.parse(xhrLogin.responseText).message
                }
        });
        
        //making the API request to do the user validation
        xhrLogin.open("POST", props.baseUrl + "auth",true);
        xhrLogin.setRequestHeader('Content-type', 'application/json');
        xhrLogin.send(invokeLoginData);
    }
    return(
            <div>
                {/**Displaying the header */}
                <header>
                    <Header />
                </header>
                
                <div className = "login">
                    {/**Displaying the lock icon */}
                    <Icon size = "large" sx = {{backgroundColor:"#EC3B83", border: "4px solid #EC3B83",borderRadius: 50}}>
                        <RedLockIcon>
                            <LockRoundedIcon/>
                        </RedLockIcon>
                    </Icon>    
                    <br /> <br />

                    <InputLabel id = "signInLabel">Sign In</InputLabel>
                    <br/><br/>

                    {/*Login form elements */}
                    <FormControl required>
                        <TextField 
                            required
                            value = {emailId}
                            type = "email"
                            id = "outlined-required"
                            label = "Email Address"
                            variant = "filled"
                            sx = {{width: { sm: 200, md: 300 },backgroundColor : '#dceef4'}}
                            onChange = {emailIdChangeHandler}
                        />
                    </FormControl>
                    <br /><br />

                    <FormControl required>
                        <TextField
                            required
                            value = {loginPassword}
                            id = "filled-password-input"
                            label = "Password"
                            type = "password"
                            autoComplete = "current-password"
                            variant = "filled"
                            sx = {{width: { sm: 200, md: 300 },backgroundColor : '#dceef4'}}
                            onChange = {loginPasswordChangeHandler}
                        />
                        <br></br>

                        <Button id = "colorSpecs" onClick = {() => invokeLogin()} variant = "contained" sx = {{width: { sm: 200, md: 300 }}}>SIGN IN</Button>
                        <br></br>

                        <a href = '/signup' id = "signUpLink">Don't have an account? Sign Up</a>
                        <br></br><br></br>
                        
                        <span id = "errorMsg"></span>
                    </FormControl>
                </div> {/*end of div for the mid part*/}
                <br></br><br></br>
                
                <footer id = "footer">
                    <span>Copyright &copy; <a href = "http://upgrad.com">upGrad</a> 2022</span>
                </footer>
        </div> //end of main div
    );
}

export default Login;