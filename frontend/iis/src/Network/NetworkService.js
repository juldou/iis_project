import React, {Component} from 'react';
import {authHeader, getAccessToken, isAuthenticated} from "./Authentication";
import axios from 'axios';
import {withRouter} from "react-router";

export function getHeaders() {
    if (isAuthenticated()) {
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
    constructor(props) {
        this.props = props;

        // axios.interceptors.response.use((response) => {
        //         return response
        //     },
        //     function (error) {
        //         const originalRequest = error.config;
        //         if (error.response.status === 401) {
        //             this.logout()
        //         }
        //     });
    }

    setErrorCallback(callback) {
        this.errorCallback = callback
    }

    async patch(url, data) {
        let requestOptions = {
            method: "PATCH",
            url: url,
            headers: getHeaders(),
            data: data
        };

        return axios(requestOptions)
            .then(response => {
                return response.data

            })

    }

    async post(url, data) {
        let requestOptions = {
            method: "POST",
            url: url,
            headers: getHeaders(),
            data: data
        };

        return axios(requestOptions).then(response => {
            return response.data

        })
    }

    async uploadImage(url, data) {
        let requestOptions = {
            method: "POST",
            url: url,
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': 'Bearer ' + getAccessToken()
            },
            data: data
        };

        return axios(requestOptions).then(response => {
            return response.data

        })
    }

    async delete(url) {
        let requestOptions = {
            url: url,
            method: 'delete',
            headers: getHeaders(),
        };

        return axios(requestOptions)
            .then(response => {

                return response.data

            })
    }

    async loadData(url) {
        const requestOptions = {
            headers: getHeaders()
        };

        return axios.get(url, requestOptions).then(response => {
            if (!response.data) return [];
            return response.data
        })

    }

}

export default (NetworkService);
