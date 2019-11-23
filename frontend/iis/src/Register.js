import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Bootstrap from "react-bootstrap";

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.errors = {
            email: false,
            password: false,
            repeatPassword: false
        };
        this.state = {
            email: "",
            password: "",
            repeatPassword: ""
        };
    }

    validateForm() {
        this.errors = {
            email: this.state.email.length < 5 ,
            password: this.state.password.length < 5,
            validatePassword: this.state.password !== this.state.repeatPassword
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
    };

    render() {
        return (
            <div className="Login">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="email" bsSize="large">
                        <Form.Control
                            className= {this.errors.email ? "error" : ""}
                            autoFocus
                            type="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="password" bsSize="large">
                        <Form.Control
                            className= {this.errors.password ? "error" : ""}
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </Form.Group>
                    <Form.Group controlId="repeat-password" bsSize="large">
                        <Form.Control
                            className= {this.errors.repeatPassword ? "error" : ""}
                            value={this.state.repeatPassword}
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
}