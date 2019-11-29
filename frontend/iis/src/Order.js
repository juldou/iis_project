import React, {Component} from "react";
import {isCourier, isOperator} from "./Network/Authentication";
import Select from "react-select";
import {Button, Jumbotron} from "react-bootstrap";
import {stateOptions} from "./AllOrders";
import AsyncSelect from "react-select/async/dist/react-select.esm";
import Configuration from "./Network/Configuration";
import NetworkService from "./Network/NetworkService";

export default class Order extends Component {
    constructor(props) {
        super(props)


        this.config = new Configuration();
        this.api = new NetworkService(this.props);

        this.state = {
            state: props.order.state
        }
        this.order = props.order
    }

    render() {
        let item = this.order
        return (
            <Jumbotron key={item.id}>
                <h1>
                    Order: {item.id}
                </h1>
                <p>Phone: {item.phone}</p>
                {this.Address(item.Address)}
                {this.Foods(item.foods)}

                {(isOperator()) &&
                this.Courier(item)
                }

                <br/>
                <p>
                    State:
                </p>
                {
                    isCourier()
                    &&
                    <Select id="type" options={stateOptions} onChange={this.changeOrderState.bind(this)}
                            value={this.state.type}
                            defaultValue={{label: item.state, value: item.state}}/>
                    ||
                    <h3> {item.state}</h3>
                }

                {
                    isCourier() && <Button onClick={this.send.bind(this)}> Change </Button>
                }


            </Jumbotron>
        )
    }

    Courier(order) {
        let defaultVal = {
            label: order.Courier && order.Courier.email,
            value: order.Courier && order.Courier.id
        }
        return (<div>
            <p>
                Courier:
            </p>
            <AsyncSelect cacheOptions defaultOptions loadOptions={this.loadCouriers.bind(this)}
                         onChange={this.changeCourier.bind(this)}
                         defaultValue={defaultVal}/>

        </div>);
    }

    Address(address) {
        if (address == null || address == "") return ""
        return (
            <div>
                <p>Street: {address.street}</p>
                <p>City: {address.city}</p>
            </div>
        )
    }

    Foods(foods) {
        if (foods == null || foods == "") return ""

        let totalPrice = 0
        let items = foods.map((item) => {
                totalPrice += item.price
                return (
                    <div className="food-item">
                        <h5>{item.name}</h5>
                        <h5>{item.price} Kč</h5>

                    </div>
                )
            }
        )

        return (
            <div>
                {items}
                <h4> Total: {totalPrice} Kč</h4>
            </div>
        )
    }

    changeCourier(selectedOption) {
        this.setState({
            courier_id: selectedOption.value
        })

    }

    changeOrderState(selectedOption) {
        this.setState({
            state: selectedOption.value
        })
    }

    send() {
        let data = {
            state: this.state.state
        }

        if (!!this.state.courier_id) {
            data.courier_id = this.state.courier_id
        }
        this.api.patch(this.config.ORDER_URL + "/" + this.order.id, JSON.stringify(data)).catch()

    }

    loadCouriers() {
        return this.api.loadData(this.config.GET_ALL_USERS_URL + "?role=courier").then(couriers => {
            return couriers.map(courier => {
                return {label: courier.email, value: courier.id};
            })
        }).catch()
    }
}