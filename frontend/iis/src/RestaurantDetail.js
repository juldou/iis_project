import React, { Component } from 'react';
import Configuration from "./Network/Configuration";
import NetworkService from "./Network/NetworkService";
import {NavLink} from "react-router-dom";

class RestaurantDetail extends Component {
    constructor(props) {
        super(props);
        this.config = new Configuration();
        this.api = new NetworkService();
        this.state = {
            meals: [],
            restaurant: null,
            id: props.match.params.id
        }
    }

    componentDidMount() {
        this.api.loadData(this.config.RESTAURANT_DETAIL_URL + "/" +this.state.id + "/foods").then(items => {
            if(!items) return;

            this.setState({meals: items});
            }
        );

        this.api.loadData(this.config.RESTAURANT_DETAIL_URL +
            "/" + this.state.id).then(restaurant => {
                if(!restaurant) return;
                this.setState({
                    restaurant: restaurant});
            }
        );
    }

    addMeal() {

    }

    render() {

        const mealItems = this.state.meals.map((item) =>
            <div className="restaurantDetail">
                <li key={item.id}>
                    <span className="item-name">{item.name}</span>
                </li>
            </div>
        );
        return (
            <div className="restaurantDetail">
                {this.restaurantInfo()}

                <div className="Meals">
                    <ul className="items">
                        {mealItems}
                    </ul>

                </div>
                <NavLink to={ this.state.id + "/addmeal"} className="link">

                 <button className="add-meal" onClick={this.addMeal}> Add meal </button>
                </NavLink>
            </div>
        );
    }

    restaurantInfo() {
        return (<div className="restaurant-header">
            <h3 className="restaurant-name"> {this.state.id} </h3>
        </div>);
    }
} export default RestaurantDetail;
