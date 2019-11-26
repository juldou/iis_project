import React, { Component } from 'react';
import './index.css';
import Configuration from "./Network/Configuration";
import NetworkService from "./Network/NetworkService";
import {Button} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import './Users.css';

class Users extends Component {

    constructor(props) {
        super(props);

        this.config = new Configuration();
        this.api = new NetworkService();
        this.state = {
            items: [],
        };
    }

    componentWillMount() {
        this.api.loadData(this.config.GET_ALL_USERS_URL).then(items => {
                if(!items) return;
                this.setState({items: items});
            }
        );
    }

    render() {
        const listItems = this.state.items.map((item) =>

            <div className= "userCard" key={item.id} onClick={() => {
            } }>
                <div className= "userContainer">
                    <b>Email: {item.Email}</b>
                    <p>Role: {item.Role}</p>

                <NavLink to={ "/edituser/" + item.id} className="link">
                    <Button>CHANGE</Button>
                </NavLink>
                </div>
            </div>

        );

        return (
            <div className="users">
                <ul className="user-items">
                    {listItems}
                </ul>
                <NavLink to= "/createuser/" className="link">
                    <Button>CREATE NEW</Button>
                </NavLink>
            </div>
        );
    }
} export default Users;