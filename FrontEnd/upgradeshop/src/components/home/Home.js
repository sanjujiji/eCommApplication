//This is being built as part of Capstone project.
//Home.js contains all the functionailities with respect to the home page in the application
//Created By : Sanju Jiji

import React from 'react';
import Header from '../../common/header/Header';
import Login from '../../common/header/Login'

function Home(props){
    return(
        <div>
            <header>
                <Header baseUrl={props.baseUrl}/>
            </header>
            <br></br>
            <Login baseUrl={props.baseUrl}/> 
        </div>     
    )        
}

export default Home;