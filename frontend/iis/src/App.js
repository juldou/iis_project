import Header from "./Header";
import {Switch} from "react-bootstrap";
import Homescreen from "./Homescreen";
import RestaurantDetail from "./RestaurantDetail";
import AddMeal from "./AddMeal";
import Register from "./Register";
import Login from "./Login";
import AddRestaurant from "./AddRestaurant";
import Cart from "./Order/Cart";
import {BrowserRouter as Router, Route} from "react-router-dom";
import React, {Component} from "react";
import EditUSer from "./EditUSer";

class App extends Component {
    render() {
        return (
            <Router>
                    <div>
                        <Header/>
                        <Switch>
                            <Route exact path="/" component={Homescreen} />
                            <Route exact path="/restaurant/:id" component={RestaurantDetail} />
                            <Route exact path="/restaurant/:id/addmeal" component={AddMeal}/>
                            <Route exact path="/register" component={Register}/>
                            <Route exact path="/login" component={Login}/>
                            <Route exact path="/addrestaurant" component={AddRestaurant}/>
                            <Route exact path="/cart" component={Cart}/>
                            <Route exact path="/user/:id" component={EditUSer}/>

                        </Switch>
                    </div>
            </Router>

        );
    }
}

export default App;