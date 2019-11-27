import Cookies from 'js-cookie'

import React, { Component } from 'react';
import './index.css';
import Register from "./Register";
import {getUserID, getUserType, isAdmin, isAuthenticated, isOperator, logout} from "./Network/Authentication";
import {withRouter} from "react-router-dom";
import {Nav, Navbar} from "react-bootstrap";


class Header extends Component {

    state = {
        loggedIn: true
    };

    componentDidMount() {
       this.setState({loggedIn: isAuthenticated()})
    }

    render() {
        return (
            <Navbar className="navbar" bg="light" expand="lg">


                <Nav className="mr-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/cart">Cart</Nav.Link>
                    {isAdmin() && <Nav.Link href="/users">Users</Nav.Link>}
                    { isOperator() && <Nav.Link href="/allorders">All Orders</Nav.Link>
                    }
                     {this.getUserState()}
                </Nav>

            </Navbar>
        );
    }

    getUserState() {

        if(!isAuthenticated()){
            return (

                    <Nav className="mr-auto">
                    <Nav.Link href="/login">Login</Nav.Link>
                    <Nav.Link href="/register">Register</Nav.Link>

                    </Nav>


            );
        }

        return (

                <Nav className="mr-auto">
                <Nav.Link href="/orders">My Orders</Nav.Link>
                <Nav.Link href="/userprofile">Profile</Nav.Link>
                <Nav.Link href="/" onClick={logout}>Logout</Nav.Link>

                </Nav>


        );

    }
} export default withRouter(Header);