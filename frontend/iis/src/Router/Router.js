import React from 'react';
import {Route, Link, BrowserRouter} from 'react-router-dom'
import RestaurantDetail from "../Restaurants/RestaurantDetail";
import AddMeal from "../Foods/AddMeal";
import Register from "../User/Register";
import Login from "../User/Login";
import Header from "../Header";
import AddRestaurant from "../Restaurants/AddRestaurant";
import Cart from "../Order/Cart";
import {Provider} from "react-redux";
import {createStore} from "redux";
import {Switch} from "react-bootstrap";
import EditUSer from "../User/EditUSer";
import Users from "../User/Users";
import CreateUser from "../User/CreateUser";
import OrderList from "../Order/OrderList";
import RestaurantList from "../Restaurants/RestaurantList";
import UserProfile from "../User/UserProfile";
import AllOrders from "../AllOrders";
import createHistory from 'history/createBrowserHistory';
import axios from 'axios';
import context from "react-router/modules/RouterContext";
import ErrorScreen from "../ErrorScreen";
import {useHistory} from "react-router";
import NetworkService from "../Network/NetworkService";
import Authentication from "../Network/Authentication";


let history = createHistory()
Authentication.setupInterceptors(history);


export const AppRouter = (

    <BrowserRouter history={history}>
        <Header/>
        <Switch>
            <Route exact path="/" component={RestaurantList}/>
            <Route exact path="/restaurant/:restaurantId" component={RestaurantDetail}/>
            <Route exact path="/restaurant/:restaurantId/addmeal" component={AddMeal}/>
            <Route exact path="/restaurant/:restaurantId/editmeal/:id" component={AddMeal}/>
            <Route exact path="/register" component={Register}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/addrestaurant" component={AddRestaurant}/>
            <Route exact path="/editrestaurant/:id" component={AddRestaurant}/>

            <Route exact path="/cart" component={Cart}/>
            <Route exact path="/edituser/:id" component={EditUSer}/>
            <Route exact path="/users" component={Users}/>
            <Route exact path="/createuser" component={EditUSer}/>
            <Route exact path="/orders" component={OrderList}/>
            <Route exact path="/allorders" component={AllOrders}/>

            <Route exact path="/userprofile" component={UserProfile}/>
            <Route exact path="/notfound" component={ErrorScreen}/>


        </Switch>
    </BrowserRouter>
);