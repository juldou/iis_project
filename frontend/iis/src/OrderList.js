import React, { Component } from 'react';
import './Styles/index.css';
import Configuration from "./Network/Configuration";
import NetworkService from "./Network/NetworkService";
import {Button, Jumbotron} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {getUserID} from "./Network/Authentication";
import AsyncSelect from 'react-select/async';
import './Styles/OrderList.css'
import Order from "./Order";

class OrderList extends Component {
    constructor(props) {
        super(props);

        this.config = new Configuration();
        this.api = new NetworkService(this.props);
        this.state = {
            items: undefined,
        };
    }

    componentWillMount() {
        let url = this.config.GET_USER_URL + "/orders";
        this.api.loadData(url).then(items => {
                this.setState({items: items});
            }
        ).catch();
    }

    render() {
        if(this.state.items === undefined) return "";

        if(this.state.items === null || this.state.items === "" ) {
            return (
                <Jumbotron>
                <h3> There are no orders</h3>
                </Jumbotron>
            )
        }

        const listItems = this.state.items.map((item) =>
           <Order order={item}/>

        );
        return (
            <div >
                <ul className="orders">
                    {listItems}
                </ul>
            </div>
        );
    }
} export default OrderList;