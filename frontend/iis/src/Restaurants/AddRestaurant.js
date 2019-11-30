import React, {Component} from 'react';
import ImageUpload from "../ImageUpload";
import Configuration from "../Network/Configuration";
import {Redirect} from "react-router-dom";
import {Button, Col, Row} from "react-bootstrap";
import NetworkService from "../Network/NetworkService";
import Form from "react-bootstrap/Form";
import AsyncSelect from "react-select/async/dist/react-select.esm";
import {validateRequiredField} from "../Validation";
import '../Styles/AddRestaurant.css';

class AddRestaurant extends Component {
    constructor(props) {
        super(props);

        this.api = new NetworkService(this.props);
        this.config = new Configuration();
        this.state = {
            name: '',
            type: '',
            description: '',
        };

        this.errors = {
            name: false,
            description: false,
            type: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (!!this.props.match.params.id) {
            this.api.loadData(this.config.GET_RESTAURANT_URL + "/" + this.props.match.params.id).then(restaurant => {
                this.setState({
                    name: restaurant.name,
                    type: restaurant.category,
                    description: restaurant.description,
                    update: false
                })

                this.validateForm();
                this.setState({
                    update: !this.state.update
                })

            }).catch()
        }
    }

    handleChange = event => {
        event.preventDefault()
        this.setState({
            [event.target.id]: event.target.value
        });

    };

    handleSubmit(event) {
        event.preventDefault();
        this.sendData()
    }

    render() {
        let buttonDisabled = !this.validateForm()

        if (this.state.homeScreen === true) {
            return <Redirect to='/'/>
        }
        return (
            <div className="add">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control className={this.errors.name ? "error" : ""} type="text"
                                      required placeholder="Enter name of a restaurant" value={this.state.name}
                                      onChange={this.handleChange}/>
                    </Form.Group>

                    <Form.Group controlId="type" bsSize="large">
                        <Form.Label> Type </Form.Label>
                        <Form.Control
                            required
                            className={this.errors.type ? "error" : ""}
                            placeholder="Enter type of a restaurant"
                            type="text"
                            value={this.state.type}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="description" bsSize="large">
                        <Form.Label> Description </Form.Label>
                        <Form.Control
                            required
                            placeholder="Enter restaurant description"
                            className={this.errors.description ? "error" : ""}
                            value={this.state.description}
                            onChange={this.handleChange}
                            type="text"
                        />
                    </Form.Group>

                    <Button
                        variant="primary"
                        block
                        bsSize="large"
                        disabled={buttonDisabled}
                        type="submit"
                    >
                        {!!this.props.match.params.id && "Change info" || "Create restaurant"}
                    </Button>

                    {
                        this.props.match.params.id &&
                        <Button
                            variant="danger"
                            block
                            bsSize="large"
                            onClick={this.deleteRestaurant.bind(this)}>
                            DELETE
                        </Button>
                    }

                </Form>
            </div>
        );
    }

    validateForm() {
        this.errors = {
            name: validateRequiredField(this.state.name),
            description: validateRequiredField(this.state.description),
            type: validateRequiredField(this.state.type),
        };
        return !Object.keys(this.errors).some(x => this.errors[x]);
    }

    sendData() {
        let data = JSON.stringify({
            name: this.state.name,
            description: this.state.description,
            category: this.state.type,
            picture_url: ''
        });

        if (!!this.props.match.params.id) {
            this.updateRestaurant(data)
        } else {
            this.createRestaurant(data)
        }
    }

    createRestaurant(data) {
        this.api.post(this.config.GET_RESTAURANT_URL, data).then(response => {
            this.setState({homeScreen: true})
        }).catch()
    }

    updateRestaurant(data) {
        this.api.patch(this.config.GET_RESTAURANT_URL + "/" + this.props.match.params.id, data).then(response => {
            this.setState({homeScreen: true})
        }).catch()
    }

    deleteRestaurant() {
        this.api.delete(this.config.GET_RESTAURANT_URL + "/" + this.props.match.params.id).then(response => {
            this.setState({homeScreen: true})
        }).catch()
    }
}

export default AddRestaurant;