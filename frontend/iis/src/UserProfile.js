import React, {Component} from "react";
import NetworkService from "./Network/NetworkService";
import {Button, Jumbotron} from "react-bootstrap";
import ErrorScreen from "./ErrorScreen";
import Configuration from "./Network/Configuration";
import {getUserID} from "./Network/Authentication";
import {NavLink} from "react-router-dom";
import './UserProfile.css'

export default class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.api = new NetworkService(this.props);
        this.config = new Configuration();
        this.id = getUserID();
        this.state = {
            user: null,
            loading: true
        };
    }

    componentDidMount() {
        this.api.loadData(this.config.GET_USER_URL + "/" + this.id).then(user => {
            this.setState({user: user, loading: false})
        }).catch();
    }

    render() {
        if(this.state.loading) return "";
        if(!this.state.user) return (
            <ErrorScreen/>
        );
        return(

            <div className= "profileCard" key={this.state.user.id} onClick={() => {
            } }>
                <Jumbotron>
                    <h1>Info</h1>
                    <p>Email: {this.state.user.email}</p>
                    <p>Role: {this.state.user.role}</p>
                    <p>Phone> {this.state.user.phone}</p>
                    <br/>
                    <h1>My address</h1>
                    <p>Street: </p>
                    <h3>{this.state.user.Address.street}</h3>
                    <p>City</p>
                    <h3>{this.state.user.Address.city}</h3>
                        <NavLink to={"/edituser/" + this.id} className="link">
                            <Button variant="info"> Edit info</Button>
                        </NavLink>
                </Jumbotron>
            </div>
        );
    }
}
