import React, { Component } from 'react';
import { connect } from 'react-redux'
import {Link, Redirect} from 'react-router-dom'
import {Button, Col, Jumbotron, ListGroup, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {validatePhone, validateRequiredField} from "../Validation";
import {getUserID, isAuthenticated, isCourier, isOperator} from "../Network/Authentication";
import Configuration from "../Network/Configuration";
import NetworkService from "../Network/NetworkService";
import AsyncSelect from "react-select/async/dist/react-select.esm";
import Select from "react-select";
import {stateOptions} from "../AllOrders";
import './Cart.css';
class Cart extends Component{

    constructor(props) {
        super(props);

        var order = localStorage.getItem("order");
        if(!order) {
            order = []
        } else {
            order = JSON.parse(order)
        }

        this.errors = {
            street: false,
            city: false,
            phone: false
        };

        this.state = {
            order: order
        }
    }

    handleRemove = (id)=>{
        let temp =this.state.order

        for (var i = 0; i < temp.length; i++) {
            if(temp[i].id === id) {
                temp.splice(i, 1);
                break;
            }
        }
        this.setState({order: temp});
        localStorage.setItem("order", JSON.stringify(temp))
    };

    calculatePrice() {
        var sum = 0;
        for (var i = 0; i < this.state.order.length; i++) {
            sum += this.state.order[i].price
        }
        return sum

    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    validateForm() {
        this.errors = {
            street: validateRequiredField(this.state.street),
            city: validateRequiredField(this.state.city),
            phone: validatePhone(this.state.phone)
        };
        return !Object.keys(this.errors).some(x => this.errors[x]);
    }

    buttonDisabled() {
        if(isAuthenticated()) {
            return this.state.order.length === 0
        }
        return this.state.order.length === 0 || !this.validateForm()
    }
    render(){
        let buttonDisabled = this.buttonDisabled()
        if(this.state.toRegister === true) {
            return <Redirect to='/register' />
        }
        if(this.state.redirect === true) {
            return <Redirect to='/orders' />
        }

        if(this.state.order.length === 0) {
            return (
                <div className="center">
                    <h3>Cart is empty</h3>
                </div>
                )
        }

            let addedItems = this.state.order.map(item=>{
                    return(

                        <div className="order-div" key={item.id}>
                            <Row>
                                <Col>
                                    <p>
                                        <b> {item.name}</b>
                                    </p>
                                </Col>
                                <Col>
                                </Col>
                                <Col>
                                    <p>
                                        <b>{item.price}Kč</b>
                                    </p>
                                </Col>
                                <Col>
                                    <Button variant="danger" size="sm" onClick={()=>{this.handleRemove(item.id)}}
                                    >Remove</Button>
                                </Col>
                            </Row>
                        </div>

                    )
                });


        return(
            <div className="container">
                <div className="cart">
                    <h5>You have ordered:</h5>
                    <br/>
                    <Row>
                        <Col>
                            <p>Item name</p>
                        </Col>
                        <Col>
                        </Col>
                        <Col>
                            <p>Price</p>
                        </Col>
                        <Col>
                        </Col>

                    </Row>

                    <ul className="collection">
                        {addedItems}
                    </ul>

                    <h3> Total: {this.calculatePrice()}Kč</h3>

                    { isAuthenticated() || this.Address()}
                    <Button
                        variant="primary" block onClick={this.sendOrder.bind(this)}
                        disabled={buttonDisabled}>Send</Button>
                    <br/>
                    { isAuthenticated() ||
                    <Button
                        variant="primary" block onClick={this.sendAndRegister.bind(this)}
                        disabled={buttonDisabled}>Send order and Register</Button>}
                </div>
            </div>
        )
    }

    Address() {
        return (
            <div>
                <Form.Group controlId="phone" bsSize="large">
                    <Form.Label> Phone number (+421 xxx xxx xxx) </Form.Label>
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
            </div>
        )
    }

    getOrderedFoods() {
        var order = localStorage.getItem("order");
        if(!order) {
            order = []
        } else {
            order = JSON.parse(order)
        }

        return order.map(item => item.id)
    }


    prepareData() {
        if(isAuthenticated())
            return {
                user_id: +getUserID(),
                food_ids: this.getOrderedFoods()
            };
        return {
            food_ids: this.getOrderedFoods(),
            street: this.state.street,
            city: this.state.city,
            phone: this.state.phone
        }
    }

    sendOrder() {
        let config = new Configuration();
        let api = new NetworkService(this.props);
        let data =  JSON.stringify(this.prepareData());

       return api.post(config.ORDER_URL, data).then(r => {
            this.setState(
                {redirect: true}
            );
            localStorage.removeItem("order")

        }).catch()
    }

    sendAndRegister() {
        let config = new Configuration();
        let api = new NetworkService(this.props);
        let data =  JSON.stringify(this.prepareData());

        return api.post(config.ORDER_URL, data).then(r => {

            localStorage.removeItem("order")
            localStorage.setItem("temp_user", data)

            this.setState(
                {toRegister: true}
            );
        })
    }
}

export default Cart