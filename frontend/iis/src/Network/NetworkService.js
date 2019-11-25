import React from 'react';
import {authHeader, getAccessToken, isAuthenticated} from "./Authentication";
import axios from 'axios';

class NetworkService {
    async post(url, data) {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: data
        };

        if(isAuthenticated()) {
            requestOptions.headers['Authorization'] = 'Bearer ' + getAccessToken();
        }

        return axios.post(url, requestOptions)
            .then(response => {

                return response.data;
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    async delete(url, data) {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: data
        };

        if(isAuthenticated()) {
            requestOptions.headers['Authorization'] = 'Bearer ' + getAccessToken();
        }

        return axios.delete(url, requestOptions)
            .then(response => {

                return response.data;
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    async loadData(url) {
        const requestOptions = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };

        if(isAuthenticated()) {
            requestOptions.headers['Authorization'] = 'Bearer ' + getAccessToken();
        }
        return axios.get(url, requestOptions)
            .then(response => {
                // if (!response.ok) {
                //     this.handleResponseError(response);
                // }
                if(!response.data) {
                    return;
                }
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