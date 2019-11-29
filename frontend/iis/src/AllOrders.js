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
import Order from "./Order";

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
        this.api = new NetworkService(this.props);
        this.state = {
            items: undefined,
        };
    }

    componentWillMount() {
        let url = this.config.GET_ALL_ORDERS;
        if(getUserType() === "courier") {
            url += "/courier"
        }
        this.api.loadData(url).then(items => {
                this.setState({items: items});
            }
        ).catch();
    }



    render() {
        if(this.state.items === undefined) return "";

        if(this.state.items === null || this.state.items === "" ) {
            return (
                <h3> There are no orders</h3>
            )
        }
        const listItems = this.state.items.map((item) =>
            <Order order={item}/>

        );
        return (
            <div className="AllOrders">
                <ul>
                    {listItems}
                </ul>
            </div>
        );
    }

} export default AllOrders;