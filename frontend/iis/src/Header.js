import Cookies from 'js-cookie'

import React, { Component } from 'react';
import './index.css';
import Register from "./Register";
import {getUserType, isAuthenticated, logout} from "./Network/Authentication";
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
                    {this.adminItems()}

                    <li><a href="#about">About</a></li>
                     {this.getUserState()}
                </ul>

            </nav>
        );
    }

    adminItems() {
        let userType = getUserType();
        if(isAuthenticated() && userType === 'admin') {
            return(
                <li><a href="/users">Users</a></li>
            );
        }
        return '';
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
                <li><a href="/orders">Orders</a></li>

                <li style={{float: "right"}}> <h1> Dobry den, {this.state.name} {this.state.surname} </h1> </li>
            <li><a href="/" onClick={logout}>Logout</a></li>
            </div>
        );

    }
} export default withRouter(Header);