import React, { Component } from 'react';
import './index.css';
import Configuration from "./Network/Configuration";
import NetworkService from "./Network/NetworkService";
import {Button, Jumbotron} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {getUserID, getUserType, isCourier, isOperator} from "./Network/Authentication";
import AsyncSelect from "react-select/async/dist/react-select.esm";
import Form from "react-bootstrap/Form";
import {usertypes} from "./EditUSer";
import Select from 'react-select';
import './AllOrders.css';

export const stateOptions = [
    {label: "new", value: "new"},
    {label: "accepted", value: "accepted"},
    {label: "delivering", value: "delivering"},
    {label: "delivered", value: "delivered"}
];

class AllOrders extends Component {
    constructor(props) {
        super(props);

        this.config = new Configuration();
        this.api = new NetworkService();
        this.state = {
            items: null,
        };
    }

    componentWillMount() {
        this.api.loadData(this.config.GET_ALL_ORDERS).then(items => {
                if(!items) return;
                this.setState({items: items});
            }
        );
    }

    loadCouriers() {
        return this.api.loadData(this.config.GET_ALL_USERS_URL + "?role=courier").then(couriers=> {
            return couriers.map(courier => {
                return {label: courier.Email, value: courier.id};
            })
        })
    }

    render() {
        if(!this.state.items) return "";

        if(this.state.items.length === 0) {
            return (
                <h3> There are no orders</h3>
            )
        }
        const listItems = this.state.items.map((item) =>
            <Jumbotron  key={item.id}>
                <h1>
                    Order: {item.id}
                </h1>
                <p>
                    State: {item.state}
                </p>
                {(isOperator()) &&
                <AsyncSelect cacheOptions defaultOptions loadOptions={this.loadCouriers.bind(this)} onChange={this.changeCourier.bind(this, item.id)}
                             defaultValue={{label: item.Courier.Email, value: item.Courier.id}}/>
                }

                { isCourier() &&
                <Select id="type" options={stateOptions} onChange={this.changeOrderState.bind(this, item.id)}
                        value={this.state.type}
                        defaultValue={{label: item.state, value: item.state}}/>
                }
            </Jumbotron>

        );
        return (
            <div className="AllOrders">
                <ul>
                    {listItems}
                </ul>
            </div>
        );
    }

    changeCourier(id, selectedOption) {
        let data = {
            courier_id: selectedOption.value
        };
        this.api.patch(this.config.ORDER_URL + "/" + id, data)
    }

    changeOrderState(id, selectedOption) {
        let data = {
            state: selectedOption.value
        };
        this.api.patch(this.config.ORDER_URL + "/" + id, data)
    }

} export default AllOrders;