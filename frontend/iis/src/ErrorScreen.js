import React, {Component} from "react";
import NetworkService from "./Network/NetworkService";
import {Button} from "react-bootstrap";
import {withRouter} from "react-router";

class ErrorScreen extends Component {
    render() {
        return (
            <div>
                <h1>Something went wrong</h1>
            </div>
        )
    }
}

export default withRouter(ErrorScreen)