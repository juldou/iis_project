import Cookies from 'js-cookie'

import React, {Component} from 'react';
import './Styles/index.css';
import Register from "./User/Register";
import {
    getUserID,
    getUserType,
    isAdmin,
    isAuthenticated,
    isCourier,
    isOperator,
    logout
} from "./Network/Authentication";
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
            <Navbar className="navbar " collapseOnSelect bg="light" expand="lg" fixed="top">
                <Navbar.Brand href="/">Food delivery</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/cart">Cart</Nav.Link>
                        {isAdmin() && <Nav.Link href="/users">Users</Nav.Link>}
                        {isCourier() && <Nav.Link href="/allorders">All Orders</Nav.Link>
                        }
                        {this.getUserState()}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }

    getUserState() {

        if (!isAuthenticated()) {
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


}

export default withRouter(Header);