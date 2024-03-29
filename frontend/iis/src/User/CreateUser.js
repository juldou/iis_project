import React, {Component} from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {NavLink, Redirect} from "react-router-dom";
import Configuration from "../Network/Configuration";
import NetworkService from "../Network/NetworkService";
import Select from 'react-select';
import {usertypes} from "./EditUSer";
import {validateemail, validatePassword} from "../Validation";
import '../Styles/EditUser.css';

export default class CreateUser extends Component {
    constructor(props) {
        super(props);
        this.config = new Configuration();
        this.api = new NetworkService(this.props);

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
    }

    validateForm() {
        this.errors = {
            email: validateemail(this.state.email),
            password: validatePassword(this.state.password)
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
            password: this.state.password,
            role: this.state.type
        });
        this.api.post(this.config.GET_USER_URL, data).then(response => {
                this.setState({toHomescreen: true});
            }
        ).catch();
    };

    render() {
        let buttonDisabled = !this.validateForm()

        if (this.state.toHomescreen === true) {
            return <Redirect to='/#'/>
        }
        return (
            <div className="Login">
                <Form className="login-form" onSubmit={this.handleSubmit}>
                    <h1><b>Info </b></h1>
                    <Form.Group controlId="email" bsSize="large">
                        <Form.Label> Email </Form.Label>

                        <Form.Control
                            required
                            className={this.errors.email ? "error" : ""}
                            autoFocus
                            type="text"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="password" bsSize="large">
                        <Form.Label> Password </Form.Label>
                        <Form.Control
                            required
                            className={this.errors.password ? "error" : ""}
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </Form.Group>

                    <label> Type </label>
                    <Select id="type" options={usertypes} onChange={this.typeChange}/>
                    <Button
                        block
                        bsSize="large"
                        disabled={buttonDisabled}
                        type="submit"
                    >
                        {!!this.props.match.params.id && "Change info" || "Create user"}

                    </Button>

                </Form>
            </div>
        );
    }
}