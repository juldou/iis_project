import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {login} from "./Network/Authentication";
import {NavLink, Redirect} from "react-router-dom";
import Configuration from "./Network/Configuration";
import NetworkService from "./Network/NetworkService";
import Select from 'react-select';

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
        this.api = new NetworkService();

        this.errors = {
            email: false,
            password: false
        };
        this.id = props.match.params.id;
        this.state = {
            email: "",
            password: "",
            type: "",
            toHomescreen: false
        };
    }

    componentDidMount() {
        this.api.loadData(this.config.GET_USER_URL + "/" + this.id).then(user => {
                this.setState({
                    email: user.Email,
                    type: user.Role
                });
            }
        );
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

    typeChange = value => {
        this.setState({
            type: value.value
        });
    };
    handleSubmit = event => {
        event.preventDefault();
        let data = JSON.stringify({
            email: this.state.email,
            role: this.state.type
        });
        this.api.post(this.config.EDIT_USER, data).then(response => {
                this.setState({toHomescreen: true});
            }
        );
    };

    deleteUser() {

        this.api.delete(this.config.DELETE_USER_URL + "/" + this.id).then(response => {
                this.setState({toHomescreen: true});
            }
        );
    }
    render() {
        if(this.state.toHomescreen === true) {
            return <Redirect to='/#' />
        }
        return (
            <div className="Login">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="email" bsSize="large">
                        <Form.Label> Email </Form.Label>

                        <Form.Control
                            className= {this.errors.email ? "error" : ""}
                            autoFocus
                            type="text"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </Form.Group>

                    <label> Type </label>
                    <Select id="type" options = {usertypes} onChange={this.typeChange} value = {this.state.type} />
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
                        onClick = { this.deleteUser}
                    >
                        DELETE
                    </Button>
                </Form>
            </div>
        );
    }
}