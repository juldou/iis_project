import React from 'react';

export default class Checkbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { checked: false }
        this.handleCheck = this.handleCheck.bind(this);
    }

    handleCheck(e){
        this.setState({
            checked: e.target.checked
        })
    }
    render(){
        return (
            <div>
                <input
                    id ="checkbox_id"
                    type="checkbox"
                    checked={this.state.checked}
                    onChange={this.handleCheck}
                />
                <label htmlFor="checkbox_id"></label>
            </div>
        );
    }
}

