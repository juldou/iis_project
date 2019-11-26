import React from 'react';
import {authHeader, getAccessToken, isAuthenticated, logout} from "./Authentication";
import axios from 'axios';

export function getHeaders() {
    if(isAuthenticated()) {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getAccessToken()
        }
    }
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json'

    }
}
class NetworkService {
     async patch(url, data) {
        let requestOptions = {
            method: "PATCH",
            url: url,
            headers: getHeaders(),
            data: data
        };

        return axios(requestOptions)
            .then(response => {
                return this.handleResponse(response)

            })
            .catch(error => {
                this.handleError(error);
            });
    }

     async post(url, data) {
        let requestOptions = {
            method: "POST",
            url: url,
            headers: getHeaders(),
            data: data
        };

        return axios(requestOptions)
            .then(response => {
                return this.handleResponse(response)

            })
            .catch(error => {
                this.handleError(error);
            });
    }

    async delete(url) {
        let requestOptions = {
            url: url,
            method: 'delete',
            headers: getHeaders(),
        };

        return axios(requestOptions)
            .then(response => {

                return this.handleResponse(response)

            })
            .catch(error => {
                this.handleError(error);
            });
    }

    async loadData(url) {
        const requestOptions = {
            headers: getHeaders()
        };

        return axios.get(url, requestOptions)
            .then(response => {
                return this.handleResponse(response)

            })
            .catch(error => {
                this.handleError(error);
            });
    }

    handleResponse(response) {
        if(response.status === 401) {
            logout();
        }

        if(!response.data) {
            return [];
        }
        return response.data;
    }

    handleResponseError(response) {
        throw new Error("HTTP error, status = " + response.status);
    }
    handleError(error) {
        console.log(error.message);
    }

}
export default NetworkService;
