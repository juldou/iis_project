import React, {Component} from "react";
import NetworkService from "./Network/NetworkService";
import {Button} from "react-bootstrap";
import ErrorScreen from "./ErrorScreen";
import Configuration from "./Network/Configuration";
import {getUserID} from "./Network/Authentication";

export default class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.api = new NetworkService();
        this.config = new Configuration();
        this.id = getUserID();
        this.state = {
            user: null
        };
    }


    componentDidMount() {

        this.api.loadData(this.config.GET_USER_URL + "/" + this.id).then(user => {
            this.setState({user: user})
        });
    }


    render() {
        if(!this.state.user) return (
            <ErrorScreen/>
        );
        return(
            <div>
                <h3>EMAIL</h3>
                <h3>{this.state.user.Email}</h3>
                <h3>Type</h3>
                <h3>{this.state.user.Role}</h3>

                <h2>ADDRESS</h2>
                <Button> Change address</Button>
            </div>
        );
    }
}
