import React, { Component } from 'react';
import './index.css';
import Register from "./Register";

class Header extends Component {

    state = {
        loggedIn: false
    }

    componentDidMount() {
        // this.setState(
        //     {
        //         loggedIn: true,
        //         name: "Jan",
        //         surname: "Marko"
        //     }
        // )
    }

    render() {
        return (
            <nav className="Header">
                <ul>
                    <li><a href="#home">Home</a></li>
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
            <li style={{float: "right"}}> <h1> Dobry den, {this.state.name} {this.state.surname} </h1> </li>

        );

    }
} export default Header;