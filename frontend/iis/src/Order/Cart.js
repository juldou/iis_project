import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {addQuantity, removeItem, subtractQuantity} from "./CartReducer";
import {sendOrder} from "../Network/SendOrder";
class Cart extends Component{

    constructor(props) {
        super(props);

        var order = localStorage.getItem("order");
        if(!order) {
            order = []
        } else {
            order = JSON.parse(order)
        }

        this.state = {
            order: order
        }
    }

    //to remove the item completely
    handleRemove = (id)=>{
        let temp =this.state.order.filter(function(item) {
            return item.id !== id
        }) ;
        this.setState({order: temp});
        localStorage.setItem("order", JSON.stringify(temp))
    };

    calculatePrice() {
        var sum = 0;
        for (var i = 0; i < this.state.order.length; i++) {
            sum += this.state.order[i].price
        }
        return sum

    }

    sendOrder() {
        sendOrder().then(r => {})
        // if success
        localStorage.removeItem("order")
        //TODO handle error
    }

    render(){


            let addedItems = this.state.order.map(item=>{
                    return(

                        <li className="collection-item avatar" key={item.id}>
                            <div className="item-img">
                                <img src={item.img} alt={item.img}/>
                            </div>
                            <div className="item-desc">
                                <span className="title">{item.name}</span>
                                <p>{item.desc}</p>
                                <p><b>Price: {item.price}$</b></p>
                                <p>
                                    <b>Quantity: {item.quantity}</b>
                                </p>

                                <button className="waves-effect waves-light btn pink remove" onClick={()=>{this.handleRemove(item.id)}}>Remove</button>
                            </div>
                        </li>
                    )
                })


            // (
            //     <p>Nothing.</p>
            // )
        return(
            <div className="container">
                <div className="cart">
                    <h5>You have ordered:</h5>
                    <ul className="collection">
                        {addedItems}
                    </ul>

                    <h3> Total: {this.calculatePrice()}E</h3>
                    <button className="waves-effect waves-light btn pink send" onClick={this.sendOrder}>Send</button>

                </div>
            </div>
        )
    }
}
const mapStateToProps = (state)=>{
    return{
        items: state.addedItems,

    }
};
const mapDispatchToProps = (dispatch)=>{
    return{
        removeItem: (id)=>{dispatch(removeItem(id))},
        addQuantity: (id)=>{dispatch(addQuantity(id))},
        subtractQuantity: (id)=>{dispatch(subtractQuantity(id))}
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(Cart)