import React, { Component } from 'react';
import './index.css';
import Configuration from "./Network/Configuration";
import NetworkService from "./Network/NetworkService";
import {Button, Jumbotron} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {getUserID} from "./Network/Authentication";
import AsyncSelect from 'react-select/async';

class OrderList extends Component {
    constructor(props) {
        super(props);

        this.config = new Configuration();
        this.api = new NetworkService(this.props);
        this.state = {
            items: null,
        };
    }

    componentWillMount() {
        let url = this.config.GET_USER_URL + "/orders";
        this.api.loadData(url).then(items => {
                if(!items) return;
                this.setState({items: items});
            }
        );
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
                <h1>{item.id}</h1>
                <p>
                    State: {item.state}
                </p>
                <p>
                    <Button variant="primary">Learn more</Button>
                </p>
            </Jumbotron>

        );
        return (
            <div >
                <ul>
                    {listItems}
                </ul>
            </div>
        );
    }
} export default OrderList;