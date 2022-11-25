import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './common/header/Login';
import Signup from './common/header/Signup';
import Products from './components/products/Products';
import ProductDetails from './components/products/ProductDetails';
import Order from './components/orders/Order';
import Home from './components/home/Home';
import ModifyProduct from './components/products/ModifyProduct';
import AddProduct from './components/products/AddProduct';

export default function App() {
  let baseUrl = "http://localhost:8085/";
  return (
    <div className="App">
      <Router>
            <Routes>
                <Route exact path ="/"  element = {<Home baseUrl={baseUrl}/>} />
                <Route path = "/login"  element = {<Login baseUrl={baseUrl}/>} />
                <Route path = "/signup" element = {<Signup baseUrl={baseUrl}/>} />
                <Route path = "/products" element = {<Products baseUrl={baseUrl}/>} />
                <Route path = "/products/:id" element = {<ProductDetails baseUrl={baseUrl}/>} />
                <Route path = "/order" element = {<Order baseUrl={baseUrl}/>} />
                <Route path = "/modify/:id" element = {<ModifyProduct baseUrl = {baseUrl} />} />
                <Route path = "/add" element = {<AddProduct baseUrl = {baseUrl} />} /> 
            </Routes>
      </Router>
    </div>
  );
}

