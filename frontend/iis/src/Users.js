import React, { Component } from 'react';
import {NavLink} from "react-router-dom";
import './index.css';
import Configuration from "./Network/Configuration";
import NetworkService from "./Network/NetworkService";
import './Users.css';
import {Button, Jumbotron} from "react-bootstrap";


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
                if(!items) return;
                this.setState({items: items});
            }
        ).catch()
    }

    render() {
        const listItems = this.state.items.map((item) =>

            <div className= "userCard" key={item.id} onClick={() => {
            } }>
                <Jumbotron className= "userContainer">
                    <h1>Info</h1>
                    <p>Email: {item.email}</p>
                    <p>Phone number: {item.phone}</p>
                    <p>Role: {item.role}</p>
                    <br/>
                    <h1>Address</h1>
                    <p>Street: {item.Address.street}</p>
                    <p>City: {item.Address.city}</p>
                    <p>
                        <NavLink to={"/edituser/" + item.id} className="link">
                            <Button variant="info"> Edit info</Button>
                        </NavLink>
                    </p>
                </Jumbotron>
            </div>

        );

        return (
                <div className="UserList">
                    <NavLink to= "/createuser/" className="link">
                        <Button variant="info" >Create new</Button>
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
} export default Users;