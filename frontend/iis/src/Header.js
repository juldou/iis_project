import Cookies from 'js-cookie'

import React, { Component } from 'react';
import './index.css';
import Register from "./Register";
import {isAuthenticated, logout} from "./Network/Authentication";

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
                    <li><a href="#news">News</a></li>
                    <li><a href="#contact">Contact</a></li>
                    <li><a href="#about">About</a></li>
                     {this.getUserState()}
                </ul>

            </nav>
        );
    }

    getUserState() {

        if(this.state.loggedIn === false) {
            return (
                <div>
                <li><a href="/login">Login</a></li>
                <li><a href="/register">Register</a></li>
                </div>
            );
        }

        return (
            <div>
            <li style={{float: "right"}}> <h1> Dobry den, {this.state.name} {this.state.surname} </h1> </li>
            <li><a href="/" onClick={logout}>Logout</a></li>
            </div>
        );

    }
} export default Header;