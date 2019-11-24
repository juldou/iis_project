import React, { Component } from 'react';
import Configuration from "./Network/Configuration";
import NetworkService from "./Network/NetworkService";
import {NavLink} from "react-router-dom";
import { connect } from 'react-redux'
import {addToCart} from "./Order/CartReducer";

class RestaurantDetail extends Component {
    constructor(props) {
        super(props);
        this.config = new Configuration();
        this.api = new NetworkService();
        this.state = {
            menu: [],
            meals: [],
            restaurant: null,
            id: props.match.params.id
        }
    }

    componentDidMount() {
        let menuUrl = this.config.RESTAURANT_DETAIL_URL + "/" +this.state.id + "/menu"
        this.api.loadData(menuUrl + "?name=daily").then(items => {
            if(!items) return;

            this.setState({menu: items});
            }
        );

        this.api.loadData(menuUrl + "?name=permanent").then(items => {
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

        const menuItems = this.state.meals.map((item) =>{
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
                    </div>
                </div>
        )
        });
        return (
            <div className="container">
                {this.restaurantInfo()}

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
            </div>
        );
    }

    restaurantInfo() {
        return (<div className="restaurant-header">
            <h3 className="restaurant-name"> {this.state.id} </h3>
        </div>);
    }
}
const mapStateToProps = (state)=>{
    return {
        items: state.items
    }
};

const mapDispatchToProps= (dispatch)=>{

    return{
        addToCart: (item)=>{dispatch(addToCart(item))}
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(RestaurantDetail)
