import Cookies from 'js-cookie'
import Configuration from "./Configuration";
import axios from "axios";
import {useHistory} from "react-router";

export const getAccessToken = () => localStorage.getItem('access_token');
export const getUserID = () => localStorage.getItem("user");
export const isAuthenticated = () => !!getUserID();

export const getUserType = () => localStorage.getItem("user_type");
export const isAdmin = () => getUserType() === "admin";
export const isOperator = () => getUserType() === "operator" || isAdmin();
export const isCourier = () => getUserType() === "courier" || isOperator();

export function authHeader() {
    // return authorization header with basic auth credentials
    if (isAuthenticated()) {
        return {'Authorization': 'Bearer ' + getAccessToken()};
    } else {
        return {};
    }
}

export function loginBody(username, password) {
    return JSON.stringify({username, password});
}

export default {
    setupInterceptors: (history) => {

        axios.interceptors.response.use(response => {
            return response;
        }, error => {

            if (error && error.response && error.response.status === 401) {
                logout();
                history.push('/login');
                window.location.href = window.location.href;
            }

            return Promise.reject(error);
        });
    },
};

export function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("user");
    localStorage.removeItem("user_type");
    localStorage.removeItem("access_token");
    localStorage.removeItem("access_token_expires_in");
}