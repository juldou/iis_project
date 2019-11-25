import React from 'react';
import {authHeader, getAccessToken} from "./Authentication";
import axios from 'axios';

class NetworkService {
    async post(url, data) {
        const requestOptions = {
            headers: { 'Content-Type': 'application/json'},
            body: data
        };
        return axios.post(url, requestOptions)
            .then(response => {
                // if (!response.ok) {
                //     this.handleResponseError(response);
                // }
                return response.data;
            })
            // .then(json => {
            //
            //     return json;
            // })
            .catch(error => {
                this.handleError(error);
            });
    }
    async loadData(url) {
        const requestOptions = {
            headers: { 'Content-Type': 'application/json', 'cookie': getAccessToken() },
        credentials: "same-origin"
        };
        return axios.get(url, {headers: {
                Cookie: "gosessionid=123"
            }})
            .then(response => {
                // if (!response.ok) {
                //     this.handleResponseError(response);
                // }
                return response.data;
            })
            // .then(json => {
            //
            //     return json;
            // })
            .catch(error => {
                this.handleError(error);
            });
    }

    handleResponseError(response) {
        throw new Error("HTTP error, status = " + response.status);
    }
    handleError(error) {
        console.log(error.message);
    }

}
export default NetworkService;