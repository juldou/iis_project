import Cookies from 'js-cookie'

import React, { Component } from 'react';
import './index.css';
import Register from "./Register";
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
import NetworkService from "./Network/NetworkService";


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
                    { isCourier() && <Nav.Link href="/allorders">All Orders</Nav.Link>
                    }


                    <Nav.Link href="#about">About</Nav.Link>
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
                <Nav.Link href="" onClick={this.logout.bind(this)}>Logout</Nav.Link>

                </Nav>


        );

    }

    logout(){
        let api = new NetworkService(this.props);
        api.logout()
    }
} export default withRouter(Header);