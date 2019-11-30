import React, {Component} from 'react';
import '../Styles/index.css';
import Configuration from "../Network/Configuration";
import NetworkService from "../Network/NetworkService";
import '../Styles/Categories.css'
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
                if (!items) return;
                this.setState({items: items});
            }
        ).catch();
    }

    render() {
        const listItems = this.state.items.map((item) =>

            <Button variant="outline-primary" className={this.state.active === item.id ? "active" : ""} key={item.id}
                    onClick={() => {
                        if (this.state.active === item.id) {
                            this.props.onClick("");
                            this.setState({active: -1})
                            return
                        }
                        this.props.onClick(item.name);
                        this.setState({active: item.id})
                    }}>
                {item.name}
                <br/>
            </Button>
        );
        return (
            <div className="categories">
                <div className="center">
                    <h5>Categories</h5>
                </div>

                <ButtonGroup horizontal>
                    <br/>
                    <br/>
                    {listItems}
                    <br/>
                </ButtonGroup>
            </div>
        );
    }
}

export default Categories;