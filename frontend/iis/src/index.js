import React from 'react';
import ReactDOM from 'react-dom';
import './Styles/index.css';
import * as serviceWorker from './serviceWorker';
import App from "./App";
import {Provider} from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
        <App />, document.getElementById('root'));

serviceWorker.unregister();
