import React, { Component } from 'react';

class ImageUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            imagePreviewUrl: ''
        };
        this.onChange = props.onChange;
        this._handleImageChange = this._handleImageChange.bind(this);
    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: reader.result,
                imagePreviewUrl: reader.result,
            });
            this.onChange(reader.result);
        };

        reader.readAsBinaryString(file)

    }

    render() {

        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img src={imagePreviewUrl} />);
        }

        return (
            <div>
                    <input type="file" onChange={this._handleImageChange} />
                {$imagePreview}
            </div>
        )
    }

} export default ImageUpload;