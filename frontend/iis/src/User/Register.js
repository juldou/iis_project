import React, {Component} from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Bootstrap, {Col, Row} from "react-bootstrap";
import '../Styles/Register.css';
import Configuration from "../Network/Configuration";
import NetworkService from "../Network/NetworkService";
import {Redirect} from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css';
import {validateemail, validatePassword, validatePhone, validateRequiredField} from "../Validation";

class Register extends Component {
    constructor(props) {
        super(props);

        this.config = new Configuration();
        this.api = new NetworkService(this.props);

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
        let temp = localStorage.getItem("temp_user");
        if (!temp) return;
        let user = JSON.parse(temp);
        this.setState({
            street: user.street,
            city: user.city,
            phone: user.phone
        });
        localStorage.removeItem("temp_user");
    }

    validateForm() {
        this.errors = {
            email: validateemail(this.state.email),
            password: validatePassword(this.state.password),
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

    render() {
        let buttonDisabled = !this.validateForm()

        if (this.state.redirect === true) {
            return (
                <Redirect to="/"/>
            )
        }
        return (
            <div className="Register">

                <Form onSubmit={this.handleSubmit}>
                    <p><b>Info</b></p>
                    <Form.Group controlId="email" bsSize="large">
                        <Form.Label> Email: </Form.Label>
                        <Form.Control
                            className={this.errors.email ? "error" : ""}
                            autoFocus
                            type="email"
                            placeholder="Enter email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Row>
                        <Col>
                            <Form.Group controlId="password" bsSize="large">
                                <Form.Label> Password: </Form.Label>
                                <Form.Control
                                    className={this.errors.password ? "error" : ""}
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    type="password"
                                    placeholder="Enter Password"
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="repeatPassword" bsSize="large">
                                <Form.Label> Repeat password: </Form.Label>
                                <Form.Control
                                    className={this.errors.repeatPassword ? "error" : ""}
                                    value={this.state.repeatPassword}
                                    onChange={this.handleChange}
                                    type="password"
                                    placeholder="Repeat password"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group controlId="phone" bsSize="large">
                        <Form.Label> Phone number (+421123456789): </Form.Label>
                        <Form.Control
                            className={this.errors.phone ? "error" : ""}
                            value={this.state.phone}
                            onChange={this.handleChange}
                            type="text"
                            placeholder="Enter phone number"
                        />
                    </Form.Group>
                    <p><b>Address</b></p>
                    <Row>
                        <Col>
                            <Form.Group controlId="street" bsSize="large">
                                <Form.Label> Street </Form.Label>
                                <Form.Control
                                    className={this.errors.street ? "error" : ""}
                                    value={this.state.street}
                                    onChange={this.handleChange}
                                    type="text"
                                    placeholder="Enter name of your street"
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="city" bsSize="large">
                                <Form.Label> City </Form.Label>
                                <Form.Control
                                    className={this.errors.city ? "error" : ""}
                                    value={this.state.city}
                                    onChange={this.handleChange}
                                    type="text"
                                    placeholder="Enter name of your city"

                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="register-button">
                        <Row>
                            <Col> </Col>
                            <Col>
                                <Button
                                    block
                                    variant="primary"
                                    bsSize="large"
                                    disabled={buttonDisabled}
                                    type="submit"
                                >
                                    REGISTER
                                </Button>
                            </Col>
                            <Col> </Col>
                        </Row>
                    </div>
                </Form>
            </div>
        );
    }


    handleSubmit = event => {
        event.preventDefault();

        let data = JSON.stringify({
            email: this.state.email,
            password: this.state.password,
            street: this.state.street,
            city: this.state.city,
            phone: this.state.phone
        });

        this.api.post(this.config.REGISTER_URL, data).then(result => {
            this.setState({redirect: true});
        }).catch()
    };
}

export default Register;