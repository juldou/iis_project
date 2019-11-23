import React, { Component } from 'react';
import './index.css';
import Configuration from "./Configuration";
import NetworkService from "./Network/NetworkService";

class Categories extends Component {

    constructor(props) {
        super(props);

        this.config = new Configuration();
        this.api = new NetworkService();
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
        );
    }

    render() {
        const listItems = this.state.items.map((item) =>
            <li key={item.id} onClick={() => {
                this.props.onClick(item.id);
                this.setState({active: item.id})
            } }>
                <span  >
                    <a className={this.state.active === item.id ? "active" : ""} href="#">{item.name}</a>
                </span>
            </li>
        );
        return (
            <div className="Categories">
                <ul className="items">
                    {listItems}
                </ul>

            </div>
        );
    }
} export default Categories;