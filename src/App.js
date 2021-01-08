import React, { Component } from 'react';

import { BrowserRouter, Route, Switch } from "react-router-dom";

import Signup from './auth/Signup';
import VerifyOTP from './auth/VerifyOTP';
import Login from './auth/Login';
import LayoutMain from './Layout';
import Response from './Payment/Response';



import './App.css';



export default class App extends Component {


  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <div>
            <Switch>
              <Route exact path="/" component={LayoutMain} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/verify-otp" component={VerifyOTP} />
              <Route exact path="/payment-status" component={Response} />

            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }

}

