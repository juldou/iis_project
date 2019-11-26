import React, { Component } from 'react';
import ImageUpload from "./ImageUpload";
import Configuration from "./Network/Configuration";
import NetworkService from "./Network/NetworkService";
import {Button} from "react-bootstrap";
import Redirect from "react-router-dom/es/Redirect";

class AddMeal extends Component {
    constructor(props) {
        super(props);

        this.config = new Configuration();
        this.api = new NetworkService();

        this.state = {
            name: '',
            type: '',
            description: ''
        };

        this.restaurant_id = this.props.match.params.restaurantId;
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if(!!this.props.match.params.id) {
            this.api.loadData(this.config.GET_MEAL_URL + "/" + this.props.match.params.id).then(restaurant =>
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
            return <Redirect to={'/restaurant/' + this.restaurant_id}/>
        }
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                Name:
                <input type="text" value={this.state.name} onChange={this.handleNameChange} />
            </label>
                <label>
                    Type:
                    <input type="text" value={this.state.type} onChange={this.handleTypeChange} />
                </label>
                <label>
                    Description:
                    <input type="text" value={this.state.description} onChange={this.handleDescriptionChange} />
                </label>
                <label>
                    Image:
                    {/*<input type="text" value={this.state.value} onChange={this.handleChange} />*/}
                </label>

                <ImageUpload onChange={this.handleImageChange}/>
                <input type="submit" value="Submit" />

                {
                    this.props.match.params.id &&
                    <Button onClick={this.deleteMeal}> DELETE</Button>
                }

            </form>
        );
    }

    sendData() {
        let data = JSON.stringify({
            name: this.state.name,
            description: this.state.description,
            category: this.state.type,
            restaurant_id: this.restaurant_id,
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