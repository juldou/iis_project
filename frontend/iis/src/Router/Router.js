import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import Homescreen from "../Homescreen";
import RestaurantDetail from "../RestaurantDetail";
import AddMeal from "../AddMeal";
import Register from "../Register";
import Login from "../Login";
import Header from "../Header";
import AddRestaurant from "../AddRestaurant";
import Cart from "../Order/Cart";
import {Provider} from "react-redux";
import {createStore} from "redux";
import cartReducer from "../Order/CartReducer";
import {Switch} from "react-bootstrap";
import EditUSer from "../EditUSer";
import Users from "../Users";
import CreateUser from "../CreateUser";
import OrderList from "../OrderList";
import RestaurantList from "../RestaurantList";
import UserProfile from "../UserProfile";
import AllOrders from "../AllOrders";

export const AppRouter = (
    <Router>
        <div>
            <Header/>
            <Switch>
                <Route exact path="/" component={RestaurantList} />
                <Route exact path="/restaurant/:restaurantId" component={Homescreen} />
                <Route exact path="/restaurant/:restaurantId/addmeal" component={AddMeal}/>
                <Route exact path="/restaurant/:restaurantId/editmeal/:id" component={AddMeal}/>
                <Route exact path="/register" component={Register}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/addrestaurant" component={AddRestaurant}/>
                <Route exact path="/editrestaurant/:id" component={AddRestaurant}/>

                <Route exact path="/cart" component={Cart}/>
                <Route exact path="/edituser/:id" component={EditUSer}/>
                <Route exact path="/users" component={Users}/>
                <Route exact path="/createuser" component={CreateUser}/>
                <Route exact path="/orders" component={OrderList}/>
                <Route exact path="/allorders" component={AllOrders}/>

                <Route exact path="/userprofile" component={UserProfile}/>


            </Switch>
        </div>
    </Router>
);