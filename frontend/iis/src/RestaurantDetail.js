import React, { Component } from 'react';
import Configuration from "./Network/Configuration";
import NetworkService from "./Network/NetworkService";
import {NavLink} from "react-router-dom";
import { connect } from 'react-redux'
import {addToCart} from "./Order/CartReducer";
import {getUserType} from "./Network/Authentication";
import {Button} from "react-bootstrap";

class RestaurantDetail extends Component {
    constructor(props) {
        super(props);
        this.config = new Configuration();
        this.api = new NetworkService();
        this.state = {
            menu: [],
            meals: [],
            restaurant: null,
            id: this.props.restaurantId,
            category: null
        }
    }

    componentDidMount() {
       this.getItems(this.state.category);
        this.api.loadData(this.config.RESTAURANT_DETAIL_URL +
            "/" + this.state.id).then(restaurant => {
                if(!restaurant) return;
                this.setState({
                    restaurant: restaurant});
            }
        );
    }

    categoryChanged(idCategory) {
        this.setState({category: idCategory});
        this.getItems(idCategory);
    }

    getItems(idCategory) {
        let dailyMenuUrl = this.config.RESTAURANT_DETAIL_URL + "/" +this.state.id + "/menu?name=daily";
        let mealsUrl = this.config.RESTAURANT_DETAIL_URL + "/" +this.state.id + "/menu?name=permanent";
        if(!!idCategory) {
            dailyMenuUrl += "&category=" + idCategory;
            mealsUrl += "&category=" + idCategory
        }

        this.api.loadData(dailyMenuUrl).then(items => {
                if(!items) return;

                this.setState({menu: items});
            }
        );

        this.api.loadData(mealsUrl).then(items => {
                if(!items) return;

                this.setState({meals: items});
            }
        );
    }

    handleClick = (id)=>{
        var order = localStorage.getItem("order");
        if(!order) {
            order = []
        } else {
            order = JSON.parse(order)
        }
        order.push(id);
        localStorage.setItem("order", JSON.stringify(order));
    };


    render() {

        const menuItems = this.state.menu.map((item) =>{
            return(
                <div className="card" key={item.id}>
                    <div className="card-image">
                        <img src="https://www.omahasteaks.com/blog/wp-content/uploads/2019/09/Grilling-Flat-Irons-BP-1080x610.jpg" alt={item.name} height="200" width="200"/>
                        <span className="card-title">{item.name}</span>
                        <span to="/" className="btn-floating halfway-fab waves-effect waves-light red" onClick={()=>{this.handleClick(item)}}><i className="material-icons">add</i></span>
                        <i className="material-icons">add</i>
                    </div>

                    <div className="card-content">
                        <p>{item.description}</p>
                        <p><b>Price: {item.price}$</b></p>
                        {this.RemoveButton(item.id)}
                    </div>
                </div>
            )
        });

        const mealItems = this.state.meals.map((item) =>{
            return(
                <div className="card" key={item.id}>
                    <div className="card-image">
                        <img src="https://www.omahasteaks.com/blog/wp-content/uploads/2019/09/Grilling-Flat-Irons-BP-1080x610.jpg" alt={item.name} height="200" width="200"/>
                        <span className="card-title">{item.name}</span>
                        <span to="/" className="btn-floating halfway-fab waves-effect waves-light red" onClick={()=>{this.handleClick(item)}}><i className="material-icons">add</i></span>
                        <i className="material-icons">add</i>
                    </div>

                        <div className="card-content">
                        <p>{item.description}</p>
                    <p><b>Price: {item.price}$</b></p>
                            { this.ChangeButton(item.id) }

                        </div>
                </div>
        )
        });
        return (
            <div className="container">
                {this.RestaurantInfo()}

                <div >
                    <h3 className="center">Menu</h3>
                    <div className="box">
                        {menuItems}
                    </div>

                    <h3 className="center">Stala nabidka</h3>
                    <div className="box">
                        {mealItems}
                    </div>
                </div>

                <NavLink to={ this.state.id + "/addmeal"} className="link">

                 <button className="add-meal" onClick={this.addMeal}> Add meal </button>
                </NavLink>

                { this.DeactivateButton()}
            </div>
        );
    }

    ChangeButton(id) {
        if(getUserType() === "admin"|| getUserType() === "operator")
            return (
                <div>
                    <NavLink to={  this.state.id + "/editmeal/" + id} className="link">

                        <Button > Change </Button>
                    </NavLink>

                    <Button onClick={this.addToMenu.bind(this, id)}> Add to menu </Button>
                </div>

            );
        return "";
    }

    RemoveButton(id) {
        if(getUserType() === "admin"|| getUserType() === "operator")
            return (
                <div>

                    <Button onClick={this.removeFromMenu.bind(this, id)}> Remove from menu </Button>
                </div>

            );
        return "";
    }

    RestaurantInfo() {
        if(!this.state.restaurant) return;
        return (<div >
            <h2 className="restaurant-name"> {this.state.restaurant.name} </h2>
            <h3 className> {this.state.restaurant.category} </h3>
            <h3 className> {this.state.restaurant.description} </h3>
            <img src="https://www.omahasteaks.com/blog/wp-content/uploads/2019/09/Grilling-Flat-Irons-BP-1080x610.jpg" alt={this.state.restaurant.name} height="200" width="200"/>

        </div>);
    }

    DeactivateButton() {
        if(getUserType() === "admin"|| getUserType() === "operator")
            return (
                <div>

                    <Button onClick={this.deactivateOrders.bind(this)}> Stop orders </Button>
                </div>

            );
        return "";
    }

    deactivateOrders() {
        // TODO
    }

    addToMenu(id) {
        let data = JSON.stringify({
            name: "daily",
            food_id: +id
        });

        this.api.post(this.config.UPDATE_MENU_URL, data).then(response => {
            this.getItems(this.state.category)
        })
    }

    removeFromMenu(id) {
        this.api.delete(this.config.UPDATE_MENU_URL + "/" + id).then(response => {
            this.getItems(this.state.category)
        })
    }
}

export default RestaurantDetail
