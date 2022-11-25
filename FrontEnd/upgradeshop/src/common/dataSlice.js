//This is being built as part of Capstone project.
//dataSlice.js is a centralized store for storing the state objects state and reducer functions to modify the existing state values
//Created by : Sanju Jiji

import { createSlice } from '@reduxjs/toolkit'

export const dataSlice = createSlice({
    name : 'menuDisplay',
    initialState : {
        loginShow           : true,
        logoutShow          : false,
        signUpShow          : true,
        homeShow            : false,
        addProductShow      : false,
        searchBarShow       : false,
        searchBarValue      : "",
        categorySelected    : 'all',
        orderQuantity       : 0,
        adminBtnShow        : false,
        orderPlaced         : false,
        productModified     : false,
        productModifiedName : ""
    },

    reducers: {
        LOGINSHOW : (state , action) => {
            state.loginShow = action.payload;
        },
        LOGOUTSHOW : (state,action) => {
            state.logoutShow = action.payload;
        },
        SIGNUPSHOW : (state,action) => {
            state.signUpShow = action.payload;
        },
        HOMESHOW : (state,action) => {
            state.homeShow = action.payload;
        },
        ADDPRODUCTSHOW : (state,action) => {
            state.addProductShow = action.payload;
        },
        SEARCHBARSHOW : (state,action)  => {
            state.searchBarShow = action.payload;
        }, 
        SEARCHBARVALUE : (state,action)  => {
            state.searchBarValue = action.payload;
        },
        PRODUCTCATEGORYSELECTED : (state,action)  => {
            state.categorySelected = action.payload;
        },
        QUANTITY : (state,action) =>{
            state.orderQuantity = action.payload;
        },
        ADMINSHOW : (state,action) =>{
            state.adminBtnShow = action.payload;
        },
        ORDERPLACEDSHOW : (state,action) =>{
            state.orderPlaced = action.payload;
        },
        PRODUCTMODIFIEDSHOW : (state,action) =>{
            state.productModified = action.payload;
        },
        PRODUCTMODIFIEDNAMESHOW : (state,action) =>{
            state.productModifiedName = action.payload;
        }

    }
})  

export const {
    LOGINSHOW,LOGOUTSHOW,SIGNUPSHOW,HOMESHOW,ADDPRODUCTSHOW,SEARCHBARSHOW,SEARCHBARVALUE,PRODUCTCATEGORYSELECTED,QUANTITY,ADMINSHOW,ORDERPLACEDSHOW,PRODUCTMODIFIEDSHOW,PRODUCTMODIFIEDNAMESHOW} = dataSlice.actions

export default dataSlice.reducer;