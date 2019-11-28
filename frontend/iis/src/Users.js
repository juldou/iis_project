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
        if(this.state.items === undefined) return "";

        if(this.state.items === null || this.state.items === "" ) {
           return(<h3> There are no users</h3>);
        }
        const listItems = this.state.items.map((item) =>

        <div className= "userCard" key={item.id} onClick={() => {
        } }>
            <Jumbotron className= "userContainer">
                <p>Email: {item.email}</p>
                <p>Role: {item.role}</p>
                <br/>
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
                    <ul className="user-items">
                        {listItems}
                    </ul>
                    <br/>
                    <br/>
                    <NavLink to= "/createuser/" className="link">
                        <Button>CREATE NEW</Button>
                    </NavLink>
                </div>
        );
    }
} export default Users;