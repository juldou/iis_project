import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Homescreen from "./Homescreen";
import RestaurantDetail from "./RestaurantDetail";
import routing from "./Router/Router";
import { createStore } from 'redux';
import cartReducer from "./Order/CartReducer";
import App from "./App";
import {Provider} from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';


const store = createStore(cartReducer);

ReactDOM.render(<Provider store={store}>
    <App />
</Provider>, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
