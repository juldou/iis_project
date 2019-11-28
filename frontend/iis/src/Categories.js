import React, { Component } from 'react';
import './index.css';
import Configuration from "./Network/Configuration";
import NetworkService from "./Network/NetworkService";
import './Categories.css'

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
            <li key={item.id} onClick={() => {
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
            </li>
        );
        return (
            <div className="Categories">
                <ul className="filter-items">
                    {listItems}
                </ul>

            </div>
        );
    }
} export default Categories;