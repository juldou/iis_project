import React, { Component } from 'react';
import {NavLink, useHistory} from "react-router-dom";
import NetworkService from "./Network/NetworkService";
import Configuration from "./Network/Configuration";
import {getUserType, isAuthenticated, isOperator} from "./Network/Authentication";
import './RestaurantList.css'
import {Button, Card, Container} from "react-bootstrap";
import {withRouter} from "react-router";


class RestaurantList extends  Component {
    constructor(props) {
        super(props);

        this.config = new Configuration();
        this.api = new NetworkService(this.props);
        this.state = {
            items: undefined
        }
    }

    componentDidMount() {
        this.getItems(this.state.category);
    }

    render() {
        const items = this.state.items;
        if(items === undefined) return "";
        if(items === null || items === "") return (
            <div className="RestaurantList">
                There are no restaurants
            </div>
        );

        const listItems = items.map((item) =>

                    <NavLink to={"restaurant/" + item.id} className="link">
                        <Card style={{ width: '22rem' }} text={"dark"} >
                            <Card.Img variant="top" src="https://www.damejidlo.cz/public/delivery-type/2-all-21941.png" />
                            <Card.Body >
                                <Card.Title>{item.name}</Card.Title>
                                <br/>
                                <Card.Subtitle>{item.category}</Card.Subtitle>
                                <Card.Text className ="dsc">
                                    {item.description}
                                </Card.Text>
                                {this.changeButton(item.id)}
                            </Card.Body>
                        </Card>

                    </NavLink>


        );
        return (
            <Container className="RestaurantList">
                <br/>
                {listItems.length === 0 && <h3> There are no meals </h3>}
                {this.addButton()}
                <br/>
                <br/>
                <ul className="items">
                    {listItems}
                </ul>


            </Container>
        );
    }

    changeButton(id) {
        if(isOperator())
            return (
            <NavLink to={ "/editrestaurant/" + id} className="link" style={{display: 'flex', justifyContent: 'center'}}>
                <Button variant="info" > Change </Button>
            </NavLink>
            );
        return "";
    }

    addButton() {
        if(isAuthenticated()) {
            return(
                // <p Add new item to a Restaurant list./p>
                <NavLink to="/addrestaurant/" className="link">
                <Button variant="info" name="button">ADD NEW ITEM</Button>
                </NavLink>
            );
        }

        return ("");
    }

    getItems(idCategory) {
        let url = this.config.RESTAURANT_LIST_URL;
        this.api.loadData(url).then(items => {
            this.setState({items: items});
            }
        ).catch();
    }

} export default withRouter(RestaurantList);