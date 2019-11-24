import Configuration from "./Configuration";
import {getUserID} from "./Authentication";

function getOrderedFoods() {
    var order = localStorage.getItem("order");
    if(!order) {
        order = []
    } else {
        order = JSON.parse(order)
    }

    return order.map(item => item.id)
}


function prepareData() {
    return {
        address_id: 1,
        user_id: getUserID(),
        food_ids: getOrderedFoods()
    }
}

export function sendOrder() {
    let config = new Configuration();

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',

        body: JSON.stringify(prepareData())
    };


    return fetch(config.ORDER_URL, requestOptions)
}