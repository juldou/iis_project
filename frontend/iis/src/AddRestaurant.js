import React, { Component } from 'react';
import ImageUpload from "./ImageUpload";
import Configuration from "./Network/Configuration";
import {Redirect} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import NetworkService from "./Network/NetworkService";
import './AddRestaurant.css';

class AddRestaurant extends Component {
    constructor(props) {
        super(props);

        this.api = new NetworkService();
        this.config = new Configuration();
        this.state = {
            name: '',
            type: '',
            description: '',
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if(!!this.props.match.params.id) {
            this.api.loadData(this.config.GET_RESTAURANT_URL + "/" + this.props.match.params.id).then(restaurant =>
            {
                if(!!restaurant) {
                    this.setState({
                        name: restaurant.name,
                        type: restaurant.category,
                        description: restaurant.description
                    })
                }
            })
        }
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    }

    handleTypeChange(event) {
        this.setState({type: event.target.value});
    }
    handleDescriptionChange(event) {
        this.setState({description: event.target.value});
    }
    handleImageChange(image) {
        alert(image);
        this.setState({image: image});
    }
    handleSubmit(event) {
        event.preventDefault();
        this.sendData()
    }

    render() {
        if(this.state.homeScreen === true) {
            return <Redirect to='/' />
        }
        return (
            <div className="add">
            <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="name" placeholder="Enter name of a restaurant" value={this.state.name} onChange={this.handleNameChange} />
                </Form.Group>

                <Form.Group controlId="formBasicType">
                    <Form.Label>Type</Form.Label>
                    <Form.Control type="type" placeholder="Enter type of a restaurant" value={this.state.type} onChange={this.handleTypeChange}  />
                </Form.Group>

                <Form.Group controlId="formBasicDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="description" placeholder="Enter restaurant description" value={this.state.description} onChange={this.handleDescriptionChange}  />
                </Form.Group>

                <Form.Group controlId="formBasicImage">
                    <Form.Label>Image</Form.Label>
                </Form.Group>

                <ImageUpload onChange={this.handleImageChange}/>
                <br/>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
                {
                    this.props.match.params.id &&
                    <Button onClick={this.deleteRestaurant.bind(this)}> DELETE</Button>
                }
            </Form>
            </div>
        );
    }

    sendData() {
        let data = JSON.stringify({
            name: this.state.name,
            description: this.state.description,
            category: this.state.type,
            picture_url: ''
        });

        if(!!this.props.match.params.id) {
            this.updateRestaurant(data)
        } else {
            this.createRestaurant(data)
        }
    }

    createRestaurant(data) {
        this.api.post(this.config.GET_RESTAURANT_URL, data).then(response =>{
            this.setState({homeScreen: true})
        })
    }

    updateRestaurant(data) {
        this.api.patch(this.config.GET_RESTAURANT_URL + "/" + this.props.match.params.id, data).then(response =>{
            this.setState({homeScreen: true})
        })
    }

    deleteRestaurant() {
        this.api.delete(this.config.GET_RESTAURANT_URL+ "/" + this.props.match.params.id).then(response =>{
            this.setState({homeScreen: true})
        })
    }
} export default AddRestaurant;