import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import Homescreen from "./Homescreen";
import RestaurantDetail from "./RestaurantDetail";
import AddMeal from "./AddMeal";
import Register from "./Register";
import Login from "./Login";
import Header from "./Header";
import AddRestaurant from "./AddRestaurant";

const routing = (
    <Router>
        <div>
            <Header/>
            <Route exact path="/" component={Homescreen} />
            <Route exact path="/restaurant/:id" component={RestaurantDetail} />
            <Route exact path="/restaurant/:id/addmeal" component={AddMeal}/>
            <Route exact path="/register" component={Register}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/addrestaurant" component={AddRestaurant}/>

        </div>
    </Router>
);
export default routing;