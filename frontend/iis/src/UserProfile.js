import React, {Component} from "react";
import NetworkService from "./Network/NetworkService";
import {Button, Col, Jumbotron, Row} from "react-bootstrap";
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
                    <h1>My profile</h1>
                    <div className="striped-border"> </div>
                    <p><b> Info</b></p>
                    <Row>
                        <Col>
                            <p><b>Email:</b> {this.state.user.email}</p>
                        </Col>
                        <Col>
                            <p><b>Account type:</b> {this.state.user.role}</p>
                        </Col>
                    </Row>
                    <p><b>Phone:</b> {this.state.user.phone}</p>
                    <br/>
                    <div className="striped-border"> </div>
                    <p><b> My address</b></p>
                    <Row>
                        <Col>
                            <p><b>Street:</b> {this.state.user.Address.street}</p>
                        </Col>
                        <Col>
                            <p><b>City:</b> {this.state.user.Address.city}</p>
                        </Col>
                    </Row>
                        <NavLink to={"/edituser/" + this.id} className="link">
                            <Button variant="info"> Edit info</Button>
                        </NavLink>
                </Jumbotron>
            </div>
        );
    }
}
