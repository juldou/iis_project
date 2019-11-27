import React, { Component } from 'react';
import ImageUpload from "./ImageUpload";
import Configuration from "./Network/Configuration";
import NetworkService from "./Network/NetworkService";
import {Button} from "react-bootstrap";
import Redirect from "react-router-dom/es/Redirect";
import Form from "react-bootstrap/Form";
import AsyncSelect from "react-select/async/dist/react-select.esm";

class AddMeal extends Component {
    constructor(props) {
        super(props);

        this.config = new Configuration();
        this.api = new NetworkService();

        this.state = {
            name: '',
            type: '',
            description: '',
            price: ''
        };

        this.errors = {
            name:false,
            description: false,
            type: false,
            price: false
        };

        this.restaurant_id = this.props.match.params.restaurantId;
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if(!!this.props.match.params.id) {
            this.api.loadData(this.config.GET_MEAL_URL + "/" + this.props.match.params.id).then(meal =>
            {
                if(!!meal) {
                    this.setState({
                        name: meal.name,
                        type: meal.category,
                        description: meal.description,
                        price: meal.price
                    })
                }
            })
        }
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleTypeChange(event) {
        this.setState({type: event.target.value});
    }

    handleImageChange(image) {
        alert(image);
        this.setState({image: image});
    }
    handleSubmit(event) {
        event.preventDefault();
        this.sendData()
    }

    validateForm() {
        this.errors = {
            name: this.state.name.length < 5 ,
            description: this.state.password !== this.state.repeatPassword,
            price: this.validatePrice(),
        };
        return !Object.keys(this.errors).some(x => this.errors[x]);
    }

    render() {
        if(this.state.homeScreen === true) {
            return <Redirect to={'/restaurant/' + this.restaurant_id}/>
        }
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="name" bsSize="large">
                    <Form.Label> Name </Form.Label>
                    <Form.Control
                        className= {this.errors.name ? "error" : ""}
                        autoFocus
                        type="text"
                        value={this.state.name}
                        onChange={this.handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="description" bsSize="large">
                    <Form.Label> Description </Form.Label>
                    <Form.Control
                        className= {this.errors.description ? "error" : ""}
                        value={this.state.description}
                        onChange={this.handleChange}
                        type="text"
                    />
                </Form.Group>
                <Form.Group controlId="price" bsSize="large">
                    <Form.Label> Price </Form.Label>
                    <Form.Control
                        className= {this.errors.price ? "error" : ""}
                        value={this.state.price}
                        onChange={this.handleChange}
                        type="text"
                    />
                </Form.Group>

                <AsyncSelect cacheOptions defaultOptions loadOptions={this.loadCategories.bind(this)} onChange={this.handleTypeChange.bind(this,)}
                             defaultValue={{label: this.state.type, value: this.state.type}}/>
                }
                <label>
                    Image:
                    {/*<input type="text" value={this.state.value} onChange={this.handleChange} />*/}
                </label>

                <ImageUpload onChange={this.handleImageChange}/>
                <input type="submit" value="Submit" />

                <Button
                    block
                    bsSize="large"
                    disabled={!this.validateForm()}
                    type="submit"
                >
                    CHANGE
                </Button>

                {
                    this.props.match.params.id &&
                    <Button onClick={this.deleteMeal.bind(this)}> DELETE</Button>
                }
            </Form>
        );
    }

    validatePrice() {
        const re = /^[0-9\b]+$/;

        // if value is not blank, then test the regex

        if (this.state.price !== '' && re.test(this.state.price)) {
            return false;
        }
        return true;
    }

    loadCategories() {
        return this.api.loadData(this.config.CATEGORIES_URL).then(items => {
                if(!items) return;
                return items.map(cat=> {
                   return  {label: cat.name, value: cat.name}
                })
            }
        );
    }

    sendData() {
        let data = JSON.stringify({
            name: this.state.name,
            description: this.state.description,
            category: this.state.type,
            restaurant_id: this.restaurant_id,
            price: this.state.price,
            picture_url: ''
        });

        if(!!this.props.match.params.id) {
            this.updateMeal(data)
        } else {
            this.createMeal(data)
        }
    }

    createMeal(data) {
        this.api.post(this.config.GET_RESTAURANT_URL + "/" + this.restaurant_id + "/food", data).then(response =>{
            this.setState({homeScreen: true})
        })
    }

    updateMeal(data) {
        this.api.patch(this.config.GET_RESTAURANT_URL + "/" + this.restaurant_id + "/food/" +this.props.match.params.id, data).then(response =>{
            this.setState({homeScreen: true})
        })
    }

    deleteMeal() {
        this.api.delete(this.config.GET_RESTAURANT_URL + "/" + this.restaurant_id + "/food/" +this.props.match.params.id).then(response =>{
            this.setState({homeScreen: true})
        })
    }
} export default AddMeal;