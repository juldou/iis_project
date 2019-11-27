import React, { Component } from 'react';
import { connect } from 'react-redux'
import {Link, Redirect} from 'react-router-dom'
import {addQuantity, removeItem, subtractQuantity} from "./CartReducer";
import {Button} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {validatePhone, validateRequiredField} from "../Validation";
import {getUserID, isAuthenticated} from "../Network/Authentication";
import Configuration from "../Network/Configuration";
import NetworkService from "../Network/NetworkService";
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

    //to remove the item completely
    handleRemove = (id)=>{
        let temp =this.state.order.filter(function(item) {
            return item.id !== id
        }) ;
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
        if(this.state.toRegister === true) {
            return <Redirect to='/register' />
        }
        if(this.state.redirect === true) {
            return <Redirect to='/orders' />
        }

            let addedItems = this.state.order.map(item=>{
                    return(

                        <li className="collection-item avatar" key={item.id}>
                            <div className="item-img">
                                <img src={item.img} alt={item.img}/>
                            </div>
                            <div className="item-desc">
                                <span className="title">{item.name}</span>
                                <p>{item.desc}</p>
                                <p><b>Price: {item.price}$</b></p>
                                <p>
                                    <b>Quantity: {item.quantity}</b>
                                </p>

                                <button className="waves-effect waves-light btn pink remove" onClick={()=>{this.handleRemove(item.id)}}
                                 >Remove</button>
                            </div>
                        </li>
                    )
                })


            // (
            //     <p>Nothing.</p>
            // )
        return(
            <div className="container">
                <div className="cart">
                    <h5>You have ordered:</h5>
                    <ul className="collection">
                        {addedItems}
                    </ul>

                    <h3> Total: {this.calculatePrice()}E</h3>

                    { isAuthenticated() || this.Address()}
                    <Button
                        className="waves-effect waves-light btn pink send" onClick={this.sendOrder.bind(this)}
                        disabled={this.buttonDisabled()}>Send</Button>
                    { isAuthenticated() ||
                    <Button
                        className="waves-effect waves-light btn pink send" onClick={this.sendAndRegister.bind(this)}
                        disabled={this.buttonDisabled()}>Send order and Register</Button>}
                </div>
            </div>
        )
    }

    Address() {
        return (
            <div>
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

        })
    }

    sendAndRegister() {
        this.sendOrder.then(r => {
            let data = JSON.stringify({
                street: this.state.street,
                city: this.state.city,
                phone: this.state.phone
            });
            localStorage.setItem("temp_user", data)

            this.setState({toRegister: true})
        })
    }
}

export default Cart