import React, {Component} from 'react';
import {NavLink} from "react-router-dom";
import '../Styles/index.css';
import Configuration from "../Network/Configuration";
import NetworkService from "../Network/NetworkService";
import '../Styles/Users.css';
import {Button, Col, Jumbotron, Row} from "react-bootstrap";
import '../Styles/Order.css';


class Users extends Component {

    constructor(props) {
        super(props);

        this.config = new Configuration();
        this.api = new NetworkService(this.props);
        this.state = {
            items: [],
        };
    }

    componentWillMount() {
        this.api.loadData(this.config.GET_ALL_USERS_URL).then(items => {
                if (!items) return;
                this.setState({items: items});
            }
        ).catch()
    }

    render() {
        if (this.state.items === undefined) return "";

        if (this.state.items === null || this.state.items === "") {
            return (<h3> There are no users</h3>);
        }
        const listItems = this.state.items.map((item) =>

            <div className="userCard" key={item.id} onClick={() => {
            }}>
                <Jumbotron className="userContainer">
                    <h1>User ID: {item.id}</h1>
                    <div className="striped-border"></div>
                    <p><b> Info</b></p>
                    <Row>
                        <Col>
                            <p><b>Email:</b> {item.email}</p>
                        </Col>
                        <Col>
                            <p><b>Account type:</b> {item.role}</p>
                        </Col>
                    </Row>
                    <p><b>Phone number:</b> {item.phone}</p>
                    <br/>
                    <div className="striped-border"></div>
                    <p><b>Address</b></p>
                    <Row>
                        <Col>
                            <p><b>Street:</b> {item.Address.street}</p>
                        </Col>
                        <Col>
                            <p><b>City:</b> {item.Address.city}</p>
                        </Col>
                    </Row>
                    <br/>
                    <p>
                        <NavLink to={"/edituser/" + item.id} className="link">
                            <Button variant="primary"> Edit info</Button>
                        </NavLink>
                    </p>
                </Jumbotron>
            </div>
        );

        return (
            <div className="UserList">
                <NavLink to="/createuser/" className="link">
                    <Button variant="primary">Create new</Button>
                </NavLink>
                <br/>
                <br/>
                <ul className="user-items">
                    {listItems}
                </ul>
                <br/>
                <br/>
            </div>
        );
    }
}

export default Users;