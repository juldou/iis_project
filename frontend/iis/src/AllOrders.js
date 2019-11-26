import React, { Component } from 'react';
import './index.css';
import Configuration from "./Network/Configuration";
import NetworkService from "./Network/NetworkService";
import {Button} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {getUserID} from "./Network/Authentication";

class AllOrders extends Component {
    constructor(props) {
        super(props);

        this.config = new Configuration();
        this.api = new NetworkService();
        this.state = {
            items: [],
        };
    }

    componentWillMount() {
        this.api.loadData(this.config.GET_ALL_ORDERS).then(items => {
                if(!items) return;
                this.setState({items: items});
            }
        );
    }

    render() {
        if(this.state.items.length === 0) {
            return (
                <h3> There are no orders</h3>
            )
        }
        const listItems = this.state.items.map((item) =>
            <li key={item.id}>
                <span  >
                    <p>{item.id}</p>
                    <p>{item.status}</p>
                    <p>{item.courier}</p>
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
} export default AllOrders;