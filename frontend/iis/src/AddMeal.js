import React, { Component } from 'react';
import ImageUpload from "./ImageUpload";
import Configuration from "./Network/Configuration";
import NetworkService from "./Network/NetworkService";

class AddMeal extends Component {
    constructor(props) {
        super(props);

        this.config = new Configuration();
        this.api = new NetworkService();

        this.state = {
            name: '',
            type: '',
            description: '',
            restaurant_id: props.match.params.id
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
                    <input type="text" value={this.state.price} onChange={this.handleDescriptionChange} />
                </label>
                <label>
                    Image:
                    {/*<input type="text" value={this.state.value} onChange={this.handleChange} />*/}
                </label>

                <ImageUpload onChange={this.handleImageChange}/>
                <input type="submit" value="Submit" />
            </form>
        );
    }

    async sendData() {
        let url = this.config.ADD_MEAL_URL + "/" + this.state.restaurant_id + "/food";
        let data = JSON.stringify({
            name: this.state.name,
            description: this.state.description,
            category: this.state.type,
            picture_url: ''
        });
        this.api.post(url, data).then(response => {

        })
        //TODO handle error
    }
} export default AddMeal;