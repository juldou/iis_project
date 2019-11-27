import Cookies from 'js-cookie'

import React, { Component } from 'react';
import './index.css';
import Register from "./Register";
import {getUserID, getUserType, isAdmin, isAuthenticated, isOperator, logout} from "./Network/Authentication";
import {withRouter} from "react-router-dom";

class Header extends Component {

    state = {
        loggedIn: true
    };

    componentDidMount() {
       this.setState({loggedIn: isAuthenticated()})
    }

    render() {
        return (
            <nav className="Header">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/cart">Cart</a></li>
                    {isAdmin() && <li><a href="/users">Users</a></li>}
                    { isOperator() && <li><a href="/allorders">Order list</a></li>}

                    <li><a href="#about">About</a></li>
                     {this.getUserState()}
                </ul>

            </nav>
        );
    }


    getUserState() {

        if(!isAuthenticated()){
            return (
                <div>
                <li><a href="/login">Login</a></li>
                <li><a href="/register">Register</a></li>

                </div>
            );
        }

        return (
            <div>
                <li><a href="/orders">My Orders</a></li>

                <li> <a href="/userprofile">Profile</a> </li>
            <li><a href="" onClick={logout}>Logout</a></li>
            </div>
        );

    }
} export default withRouter(Header);