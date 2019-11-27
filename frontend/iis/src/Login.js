import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {login, loginBody} from "./Network/Authentication";
import {NavLink, Redirect} from "react-router-dom";
import './login.css';
import NetworkService from "./Network/NetworkService";
import Configuration from "./Network/Configuration";
import {withRouter} from "react-router";

class Login extends Component {
    constructor(props) {
        super(props);

        this.api = new NetworkService(this.props);
        this.api.setErrorCallback(this.showError)
        this.config = new Configuration();

        this.errors = {
            email: false,
            password: false
        };
        this.state = {
            email: "",
            password: "",
            toHomescreen: false
        };
        this.login.bind(this)
    }

    validateForm() {
        this.errors = {
            email: this.state.email.length < 5 ,
            password: this.state.password.length < 5
        };
        return !Object.keys(this.errors).some(x => this.errors[x]);
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();
        this.login();
    };

    login() {
        let data = loginBody(this.state.email, this.state.password);
        this.api.post(this.config.LOGIN_URL, data).then(response => {
            localStorage.setItem("user", response.User.id);
            localStorage.setItem("user_type", response.User.role);
            localStorage.setItem("access_token", response.AuthToken.access_token);
            localStorage.setItem("access_token_expires_in", response.AuthToken.expires_in);
        }).catch()
    }

    render() {
        if(this.state.toHomescreen === true) {
            return <Redirect to='/' />
        }
        return (
            <div className="Login">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="email" bsSize="large">
                        <Form.Label> Email: </Form.Label>

                        <Form.Control
                            className= {this.errors.email ? "error" : ""}
                            autoFocus
                            type="text"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="password" bsSize="large">
                        <Form.Label> Password: </Form.Label>
                        <Form.Control
                            className= {this.errors.password ? "error" : ""}
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </Form.Group>

                    <Button
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                    >
                        Login
                    </Button>
                </Form>
            </div>
        );
    }
} export default withRouter(Login);