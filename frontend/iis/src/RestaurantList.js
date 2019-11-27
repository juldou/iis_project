import React, { Component } from 'react';
import {NavLink, useHistory} from "react-router-dom";
import NetworkService from "./Network/NetworkService";
import Configuration from "./Network/Configuration";
import {getUserType, isAuthenticated} from "./Network/Authentication";
import './RestaurantList.css'
import {Button, Card} from "react-bootstrap";


class RestaurantList extends  Component {
    constructor(props) {
        super(props);

        this.config = new Configuration();
        this.api = new NetworkService();
        this.state = {
        }
    }

    componentDidMount() {
        this.getItems(this.state.category);
    }

    render() {
        const items = this.state.items;
        if(!items) return (
            <div className="RestaurantList">

                <button type="button" name="button" >New Item</button>
                <br/>

            </div>
        );

        const listItems = items.map((item) =>
            <li key={item.id }>
                <div className="RestaurantPreview" key={item.id}>
                    <NavLink to={"restaurant/" + item.id} className="link">

                        <Card style={{ width: '20rem' }}>
                            <Card.Img variant="top" src="https://www.damejidlo.cz/public/delivery-type/2-all-21941.png" />
                            <Card.Body>
                                <Card.Title className="mb-2 text-muted">{item.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{item.category}</Card.Subtitle>
                                <Card.Text className="mb-2 text-muted">
                                    {item.description}
                                </Card.Text>
                                {this.changeButton(item.id)}
                            </Card.Body>
                        </Card>

                    {/*<div className="item-name">*/}
                    {/*    <img className="preview-image" src="https://www.damejidlo.cz/public/delivery-type/2-all-21941.png" alt="daco" width="300" height="300"/>*/}
                    {/*    <h4>{item.name}</h4>*/}
                    {/*    <h1>{item.category}</h1>*/}
                    {/*    <p>{item.description}</p>*/}
                    {/*</div>*/}
                    {/*    <div className="overlay"></div>*/}
                    </NavLink>





                </div>
                <span className="item-name">{item.Name}</span>
            </li>
        );
        return (
            <div className="RestaurantList">

                <ul className="items">
                    {listItems}
                </ul>
                <br/>
                <br/>
                {this.addButton()}
            </div>
        );
    }

    changeButton(id) {
        if(getUserType() === "admin"|| getUserType() === "operator")
            return (
            <NavLink to={ "/editrestaurant/" + id} className="link">

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
            if(!items) return;
            this.setState({items: items});
            }
        );
    }

} export default RestaurantList;