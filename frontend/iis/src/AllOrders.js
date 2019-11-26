import React, { Component } from 'react';
import './index.css';
import Configuration from "./Network/Configuration";
import NetworkService from "./Network/NetworkService";
import {Button} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {getUserID} from "./Network/Authentication";
import AsyncSelect from "react-select/async/dist/react-select.esm";

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
            <li key={item.id}>
                <span  >
                    <h3>{item.id}</h3>
                    <h3>{item.state}</h3>
                    <AsyncSelect cacheOptions defaultOptions loadOptions={this.loadCouriers.bind(this)} onChange={this.changeCourier.bind(this, item.id)}
                    defaultValue={{label: item.Courier.Email, value: item.Courier.id}}/>

                </span>
            </li>
        );
        return (
            <div >
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
} export default AllOrders;