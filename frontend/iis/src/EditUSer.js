import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {NavLink, Redirect} from "react-router-dom";
import Configuration from "./Network/Configuration";
import NetworkService from "./Network/NetworkService";
import Select from 'react-select';
import {validateemail, validatePhone, validateRequiredField} from "./Validation";
import {isAdmin, isOperator} from "./Network/Authentication";
import './login.css';

export const usertypes = [
    { label: "admin", value: "admin" },
    { label: "operator", value: "operator" },
    { label: "courier", value: "courier" },
    { label: "customer", value: "customer" },
];

export default class EditUser extends Component {
    constructor(props) {
        super(props);

        this.config = new Configuration();
        this.api = new NetworkService(this.props);
        this.id = this.props.match.params.id;

        this.errors = {
            email: false,
            password: false,
            repeatPassword: false,
            street: false,
            city: false,
            phone: false
        };

        this.state = {
            email: "",
            password: "",
            repeatPassword: "",
            street: "",
            city: "",
            phone: ""
        };
    }

    componentDidMount() {
        if(this.id)
        this.api.loadData(this.config.GET_USER_URL + "/" + this.id).then(user => {
                this.setState({
                    email: user.email,
                    type: user.role,
                    street: user.Address.street,
                    city: user.Address.city,
                    phone: user.phone
                });
            }
        );
    }

    validateForm() {
        this.errors = {
            email: this.state.email.length < 5 ,
            // email: validateemail(this.state.email) ,
            password: !this.id && this.state.password === "",
            validatePassword: this.state.password !== this.state.repeatPassword,
            street: validateRequiredField(this.state.street),
            city: validateRequiredField(this.state.city),
            phone: validatePhone(this.state.phone)
        };
        return !Object.keys(this.errors).some(x => this.errors[x]);
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    typeChange = value => {
        this.setState({
            type: value.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();
        var data = {
            email: this.state.email,
            role: this.state.type,
            street: this.state.street,
            city: this.state.city,
            phone: this.state.phone
        };

        if(!!this.state.password) {
            data.password = this.state.password
        }
        if(!this.id) {
            this.api.post(this.config.GET_USER_URL, data).then(response => {
                    this.setState({toHomescreen: true});
                }
            );
        } else {
            this.api.patch(this.config.EDIT_USER + "/" + this.id, JSON.stringify(data)).then(response => {
                this.setState({toHomescreen: true});
            }
            );
        }
    };

    deleteUser() {
        this.api.delete(this.config.DELETE_USER_URL + "/" + this.id).then(response => {
                this.setState({toHomescreen: true});
            }
        );
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
                            type="email"
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
                    <Form.Group controlId="repeatPassword" bsSize="large">
                        <Form.Label> Repeat password: </Form.Label>
                        <Form.Control
                            className= {this.errors.repeatPassword ? "error" : ""}
                            value={this.state.repeatPassword}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </Form.Group>
                    <Form.Group controlId="phone" bsSize="large">
                        <Form.Label> Phone number </Form.Label>
                        <Form.Control
                            className= {this.errors.phone ? "error" : ""}
                            value={this.state.phone}
                            onChange={this.handleChange}
                            type="text"
                        />
                    </Form.Group>
                    <h3> Address </h3>
                    <Form.Group controlId="street" bsSize="large">
                        <Form.Label> Street </Form.Label>
                        <Form.Control
                            className= {this.errors.street ? "error" : ""}
                            value={this.state.street}
                            onChange={this.handleChange}
                            type="text"
                        />
                    </Form.Group>
                    <Form.Group controlId="city" bsSize="large">
                        <Form.Label> City </Form.Label>
                        <Form.Control
                            className= {this.errors.city ? "error" : ""}
                            value={this.state.city}
                            onChange={this.handleChange}
                            type="text"
                        />
                    </Form.Group>

                    <label> Type </label>
                    {isAdmin() && <Select id="type" options = {usertypes} onChange={this.typeChange} value = {{label: this.state.type, value: this.state.type}} />}
                    <Button
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                    >
                        CHANGE
                    </Button>

                    <Button
                        block
                        bsSize="large"
                        onClick = { this.deleteUser.bind(this)}
                    >
                        DELETE
                    </Button>
                </Form>
            </div>
        );
    }
}