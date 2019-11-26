import React, { Component } from 'react';
import {NavLink, useHistory} from "react-router-dom";
import NetworkService from "./Network/NetworkService";
import Configuration from "./Network/Configuration";
import {getUserType, isAuthenticated} from "./Network/Authentication";


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
                <div className="RestaurantPreview" >
                    <NavLink to={"restaurant/" + item.id} className="link">
                    <img className="preview-image" src="https://www.damejidlo.cz/public/delivery-type/2-all-21941.png" alt="daco" width="200" height="200"/>
                    <div className="item-name"><h2>{item.name}</h2></div>
                    </NavLink>



                    {this.changeButton(item.id)}

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

                <button className="add-meal" > Change </button>
            </NavLink>
            );
        return "";
    }

    addButton() {
        if(isAuthenticated()) {
            return(
                <NavLink to="/addrestaurant/" className="link">
                <button type="button" name="button">New Item</button>
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