import React, {Component} from 'react';
import Configuration from "../Network/Configuration";
import NetworkService from "../Network/NetworkService";
import {NavLink, Redirect} from "react-router-dom";
import {connect} from 'react-redux'
import {getUserType, isOperator} from "../Network/Authentication";
import {withRouter} from "react-router";
import {Button, Card, Col, Container, Image, Jumbotron, Row, Tab, Tabs} from "react-bootstrap";
import '../Styles/RestaurantDetails.css';
import Categories from "../Restaurants/Categories";

class RestaurantDetail extends Component {
    constructor(props) {
        super(props);
        this.config = new Configuration();
        this.api = new NetworkService(this.props);
        this.state = {
            menu: null,
            meals: null,
            restaurant: undefined,
            id: this.props.match.params.restaurantId,
            category: null,
            loading: true
        }
    }

    triggerCategoryChange(idCategory) {
        this.categoryChanged(idCategory)
    }

    componentDidMount() {
        this.getItems(this.state.category);
        this.api.loadData(this.config.RESTAURANT_DETAIL_URL +
            "/" + this.state.id).then(restaurant => {
                this.setState({
                    restaurant: restaurant
                });
            }
        ).catch();
    }

    categoryChanged(idCategory) {
        this.setState({category: idCategory});
        this.getItems(idCategory);
    }

    getItems(idCategory) {
        let dailyMenuUrl = this.config.RESTAURANT_DETAIL_URL + "/" + this.state.id + "/menu?name=daily";
        let mealsUrl = this.config.RESTAURANT_DETAIL_URL + "/" + this.state.id + "/menu?name=permanent";
        if (!!idCategory) {
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

    handleClick = (item) => {
        var order = localStorage.getItem("order");
        if (!order) {
            order = []
        } else {
            order = JSON.parse(order)
        }
        if (order.length >= 10) {
            alert("Cart is full")
            return
        }
        order.push(item);
        alert(item.name + " added to cart")
        localStorage.setItem("order", JSON.stringify(order));
    };


    render() {
        if (this.state.restaurant === null || this.state.restaurant === "") {
            return (<h3> Restaurant not found </h3>);
        }
        const menuItems = this.state.menu == null ? [] : this.state.menu.map((item) => {
            let imageUrl = "/foods/" + (item.picture_url !== "" ? item.picture_url : "placeholder.png")
            return (
                // <div className="card" key={item.id}>
                <Card style={{width: '22rem'}}>
                    <Card.Img className="card-image" variant="top" src={imageUrl}/>
                    <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted"><b>Price: {item.price}Kč</b></Card.Subtitle>
                        <Card.Text className="dsc">
                            {item.description}
                        </Card.Text>
                        <Card.Text>
                            {item.is_soldout ? "Sold out" : "Available"}
                        </Card.Text>
                        <div className="add-btn">
                            <Button variant="primary" onClick={() => {
                                this.handleClick(item)
                            }}> Add to cart</Button>
                        </div>
                        <br/>
                        <div className="flex-btn">
                            <Row>
                                <Col>
                                    {this.ChangeButton(item.id)}
                                </Col>
                                <Col> </Col>
                                <Col>
                                    {this.RemoveButton(item.id)}
                                </Col>
                            </Row>
                        </div>
                    </Card.Body>
                </Card>
            )
        });

        const mealItems = this.state.meals == null ? [] : this.state.meals.map((item) => {
            let imageUrl = "/foods/" + (item.picture_url !== "" ? item.picture_url : "placeholder.png")

            return (
                // <div className="card" key={item.id}>
                <Card style={{width: '22rem'}}>
                    <Card.Img className="card-image" variant="top" src={imageUrl}/>
                    <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted"><b>Price: {item.price}$</b></Card.Subtitle>
                        <Card.Text>
                            {item.description}
                        </Card.Text>
                        <div className="add-btn">
                            <Button variant="primary" onClick={() => {
                                this.handleClick(item)
                            }}> Add to cart</Button>
                        </div>
                        <br/>
                        <div>
                            <Row>
                                <Col>
                                    {this.ChangeButton(item.id)}
                                </Col>
                                <Col> </Col>
                                <Col>
                                    {this.AddButton(item.id)}
                                </Col>
                            </Row>
                        </div>
                    </Card.Body>
                </Card>
            )
        });
        return (
            <div className="container">
                {this.RestaurantInfo()}
                <div className="center">
                    <Categories onClick={this.triggerCategoryChange.bind(this)}/>
                </div>
                {
                    isOperator() && <div className="add-meal-btn">
                        <NavLink to={this.state.id + "/addmeal"} className="link">
                            <Button className="add-meal btn-lg" variant="primary" onClick={this.addMeal}>
                                Add meal </Button>
                        </NavLink>

                    </div>
                }

                <Container className="menu-container">


                    <br/>
                    <h3 className="center">Daily menu</h3>
                    <br/>
                    <div className="box">
                        {menuItems.length === 0 && <h3> There are no meals</h3>}
                        {menuItems}
                    </div>
                </Container>

                <Container className="menu-container">
                    <h3 className="center">Permanent offer</h3>
                    <br/>
                    <div className="box">
                        {mealItems.length === 0 && <h3> There are no meals </h3>}

                        {mealItems}
                    </div>
                </Container>
            </div>
        );
    }

    ChangeButton(id) {
        if (isOperator())
            return (
                <div>
                    <NavLink to={this.state.id + "/editmeal/" + id} className="link">

                        <Button variant="primary"> {"Change"}</Button>
                    </NavLink>
                    <br/>
                </div>

            );
        return "";
    }

    AddButton(id) {
        if (isOperator())
            return (<Button variant="primary" onClick={this.addToMenu.bind(this, id)}> Add to menu </Button>)
        return "";
    }

    RemoveButton(id) {
        if (isOperator())
            return (
                <div>

                    <Button variant="primary" onClick={this.removeFromMenu.bind(this, id)}> Remove </Button>
                </div>

            );
        return "";
    }

    RestaurantInfo() {
        if (!this.state.restaurant) return;
        return (
            <Jumbotron fluid className="Jumbotron">
                <h2 align="center">{this.state.restaurant.name}</h2>
                <br/>
                <p align="center">{this.state.restaurant.category}</p>
                <br/>
                <p align="center">{this.state.restaurant.description}</p>
            </Jumbotron>);
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
