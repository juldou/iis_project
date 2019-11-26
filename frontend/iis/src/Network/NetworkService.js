import React from 'react';
import {authHeader, getAccessToken, isAuthenticated} from "./Authentication";
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
                return response.data;
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
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    async delete(url, data) {
        let requestOptions = {
            method: 'DELETE',
            headers: getHeaders(),
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
            headers: getHeaders()
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
export const api = new NetworkService();
