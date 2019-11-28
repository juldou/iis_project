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
import createHistory from 'history/createBrowserHistory';
import setupInterceptors from "../Network/NetworkService";
import axios from 'axios';
import context from "react-router/modules/RouterContext";

const history = createHistory();


axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.status === 401) {
        history.push('/login')
        // store.dispatch(logoutUser());
    }

    if (error.response.status === 404) {
        history.push('/not-found');
    }

    if (error.response.status === 500) {
        history.push('/');
    }

    return Promise.reject(error);
});



// setupInterceptors(history);

export const AppRouter = (
    <Router history={history} forceRefresh={true}>
        <div>
            <Header/>
            {/*<Switch >*/}
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
                <Route exact path="/createuser" component={EditUSer}/>
                <Route exact path="/orders" component={OrderList}/>
                <Route exact path="/allorders" component={AllOrders}/>

                <Route exact path="/userprofile" component={UserProfile}/>


            {/*</Switch>*/}
        </div>
    </Router>
);