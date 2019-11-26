import Configuration from "./Configuration";
import {getUserID} from "./Authentication";
import NetworkService, {getHeaders} from "./NetworkService";

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
        user_id: +getUserID(),
        food_ids: getOrderedFoods()
    }
}

export function sendOrder() {
    let config = new Configuration();
    let api = new NetworkService();
    let data =  JSON.stringify(prepareData());

    return api.post(config.ORDER_URL, data)
}