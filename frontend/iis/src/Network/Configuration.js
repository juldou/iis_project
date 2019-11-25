class Configuration {
    SERVER_API_URL = "http://78.128.250.217:9092/api";
    LOCAL_API_URL = "http://localhost:9092/api";
    API_URL = this.SERVER_API_URL;
    RESTAURANT_LIST_URL = this.API_URL + "/restaurants";
    RESTAURANT_DETAIL_URL = this.API_URL + "/restaurant";
    MEALS_BY_RESTAURANT = this.API_URL + "/restaurant";
    ADD_MEAL_URL = this.API_URL + "/restaurant";
    ADD_RESTAURANT_URL = this.API_URL + "/restaurant";
    CATEGORIES_URL = this.API_URL + "/restaurant-categories";
    LOGIN_URL = this.API_URL + "/login";
    ORDER_URL = this.API_URL + "/order";
    EDIT_USER = this.API_URL + "/user";
    GET_USER_URL = this.API_URL + "/user";
}
export default Configuration;