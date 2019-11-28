import React, { Component } from 'react';
import Configuration from "./Network/Configuration";
import NetworkService from "./Network/NetworkService";
import {NavLink, Redirect} from "react-router-dom";
import { connect } from 'react-redux'
import {addToCart} from "./Order/CartReducer";
import {getUserType, isOperator} from "./Network/Authentication";
import {withRouter} from "react-router";
import {Button, Card, Image, Jumbotron, Tab, Tabs} from "react-bootstrap";
import './RestaurantDetails.css';

class RestaurantDetail extends Component {
    constructor(props) {
        super(props);
        this.config = new Configuration();
        this.api = new NetworkService(this.props);
        this.state = {
            menu: null,
            meals: null,
            restaurant: undefined,
            id: this.props.restaurantId,
            category: null,
            loading: true
        }
    }

    componentDidMount() {
        this.getItems(this.state.category);
        this.api.loadData(this.config.RESTAURANT_DETAIL_URL +
            "/" + this.state.id).then(restaurant => {
                this.setState({
                    restaurant: restaurant});
            }
        ).catch();
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

                this.setState({menu: items});
            }
        ).catch();

        this.api.loadData(mealsUrl).then(items => {
                this.setState({meals: items});
            }
        ).catch();
    }

    handleClick = (item)=>{
        var order = localStorage.getItem("order");
        if(!order) {
            order = []
        } else {
            order = JSON.parse(order)
        }
        if(order.length >= 10) {
            alert("Cart is full")
            return
        }
        order.push(item);
        alert(item.name + " added to cart")
        localStorage.setItem("order", JSON.stringify(order));
    };


    render() {
        if(this.state.restaurant === null || this.state.restaurant === "") {
            return (<h3>  Restaurant not found </h3>);
        }
        const menuItems = this.state.menu == null ? [] : this.state.menu.map((item) =>{
            let imageUrl ="/foods/" +  (item.picture_url !== "" ? item.picture_url : "placeholder.png")
            return(
                // <div className="card" key={item.id}>
                    <Card style={{ width: '22rem' }}>
                        <Card.Img className="card-image" variant="top" src={imageUrl} />
                        <Card.Body>
                            <Card.Title>{item.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted"><b>Price: {item.price}$</b></Card.Subtitle>
                            <Card.Text className="dsc">
                                {item.description}
                            </Card.Text>
                            <Card.Text>
                            {item.is_soldout ? "Sold out" : "Available"}
                            </Card.Text>

                            <Button variant="primary" onClick={()=>{this.handleClick(item)}}> Add to cart</Button
                            >
                            { this.ChangeButton(item.id) }

                            {this.RemoveButton(item.id)}
                        </Card.Body>
                    </Card>
            )
        });

        const mealItems = this.state.meals == null ? [] : this.state.meals.map((item) =>{
            let imageUrl ="/foods/" +  (item.picture_url !== "" ? item.picture_url : "placeholder.png")

            return(
                // <div className="card" key={item.id}>
                <Card style={{ width: '22rem' }}>
                    <Card.Img className="card-image" variant="top" src={imageUrl} />
                    <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted"><b>Price: {item.price}$</b></Card.Subtitle>
                        <Card.Text>
                            {item.description}
                        </Card.Text>
                        <Button variant="primary" onClick={()=>{this.handleClick(item)}}> Add to cart</Button>
                        { this.ChangeButton(item.id) }
                        { this.AddButton(item.id)}
                    </Card.Body>
                </Card>
        )
        });
        return (
            <div className="container">
                {this.RestaurantInfo()}

                <Tabs  defaultActiveKey="menu" id="uncontrolled-tab-example">
                    <Tab className = "menu-tabs" eventKey="menu" title="Daily menu">
                        <br/>
                        <h3 className="center">Daily menu</h3>
                        <br/>
                        <div className="box">
                            {menuItems.length === 0 && <h3> Menu is empty</h3>}
                            {menuItems}
                        </div>
                    </Tab>
                    <Tab className = "nabidka-tabs" eventKey="nabidka" title="Menu">
                        <br/>
                        <h3 className="center">Menu</h3>
                        <br/>
                        <div className="box">
                            {mealItems.length === 0 && <h3> There are no meals </h3>}

                            {mealItems}
                        </div>
                    </Tab>

                </Tabs>
                <br/>
                <br/>
                <NavLink to={ this.state.id + "/addmeal"} className="link">
                 <Button className="add-meal" variant="info" onClick={this.addMeal}> Add meal </Button>
                </NavLink>

                { this.DeactivateButton()}
            </div>
        );
    }

    ChangeButton(id) {
        if(isOperator())
            return (
                <div>
                    <NavLink to={  this.state.id + "/editmeal/" + id} className="link">

                        <Button variant="info" > Change </Button>
                    </NavLink>
                <br/>
                </div>

            );
        return "";
    }

    AddButton(id) {
        if(isOperator())
            return( <Button variant="info" onClick={this.addToMenu.bind(this, id)}> Add to menu </Button>)
        return "";
    }

    RemoveButton(id) {
        if(isOperator())
            return (
                <div>

                    <Button onClick={this.removeFromMenu.bind(this, id)}> Remove from menu </Button>
                </div>

            );
        return "";
    }

    RestaurantInfo() {
        if(!this.state.restaurant) return;
        return (
            <Jumbotron fluid className="Jumbotron">
                <h2 align="center" >{this.state.restaurant.name}</h2>
                <br/>
                <p align="center" >{this.state.restaurant.description}</p>
            </Jumbotron>);
    }

    DeactivateButton() {
        if(isOperator())
            return (
                <div>

                    <Button variant="info" onClick={this.deactivateOrders.bind(this)}> Stop orders </Button>
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

        this.api.patch(this.config.UPDATE_MENU_URL + "/" + id, data).then(response => {
            this.getItems(this.state.category)
        }).catch()
    }

    removeFromMenu(id) {
        this.api.delete(this.config.UPDATE_MENU_URL + "/" + id).then(response => {
            this.getItems(this.state.category)
        }).catch()
    }
}

export default (RestaurantDetail)
