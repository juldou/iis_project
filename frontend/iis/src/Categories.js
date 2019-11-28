import React, { Component } from 'react';
import './index.css';
import Configuration from "./Network/Configuration";
import NetworkService from "./Network/NetworkService";
import './Categories.css'
import {Button, ButtonGroup} from "react-bootstrap";

class Categories extends Component {
    constructor(props) {
        super(props);

        this.config = new Configuration();
        this.api = new NetworkService(this.props);
        this.state = {
            items: [],
            active: -1
        };
    }

    componentWillMount() {
        this.api.loadData(this.config.CATEGORIES_URL).then(items => {
                if(!items) return;
                this.setState({items: items});
            }
        ).catch();
    }

    render() {
        const listItems = this.state.items.map((item) =>

            <Button variant="outline-info" className = "categories-button" key={item.id} onClick={() => {
                if(this.state.active === item.id) {
                    this.props.onClick("");
                    this.setState({active: -1})
                    return
                }
                this.props.onClick(item.name);
                this.setState({active: item.id})
            } }>
                <span  >
                    <a className={this.state.active === item.id ? "active" : ""} href="#">{item.name}</a>
                </span>
                <br/>
            </Button>
        );
        return (

            <ButtonGroup vertical>
                <br/>
                <p>Filter</p>
                <br/>
                {listItems}
                <br/>
            </ButtonGroup>

        );
    }
} export default Categories;