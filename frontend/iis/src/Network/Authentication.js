import Cookies from 'js-cookie'
import Configuration from "./Configuration";
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
        return { 'Authorization': 'Bearer ' + getAccessToken() };
    } else {
        return {};
    }
}

export function loginBody(username, password) {
    return JSON.stringify({ username, password });
}
// TODO move to login
export function login(username, password) {
    let config = new Configuration();
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',

        body: JSON.stringify({ username, password })
    };

    return fetch(config.LOGIN_URL, requestOptions)
        .then(response => {
            // login successful if there's a user in the response
            if (!response.ok) {
                if (response.status === 401) {
                    // auto logout if 401 response returned from api
                    // logout();
                    alert("You have been logged out")
                }

                const error = response.statusText;
                return Promise.reject(error);
            }
                // store user details and basic auth credentials in local storage
                // to keep user logged in between page refreshes

            return response;
        }).then(response => {
            return response.json()
            }

        ).then(response => {
            localStorage.setItem("user", response.User.id);
            localStorage.setItem("user_type", response.User.role);
            localStorage.setItem("access_token", response.AuthToken.access_token);
            localStorage.setItem("access_token_expires_in", response.AuthToken.expires_in);
        });
}



// function getAll() {
//     const requestOptions = {
//         method: 'GET',
//         headers: authHeader()
//     };
//
//     return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
// }

// function handleResponse(response) {
//     return response.text().then(text => {
//         const data = text && JSON.parse(text);
//         if (!response.ok) {
//             if (response.status === 401) {
//                 // auto logout if 401 response returned from api
//                 logout();
//                 location.reload(true);
//             }
//
//             const error = (data && data.message) || response.statusText;
//             return Promise.reject(error);
//         }
//
//         return response;
//     });
// }

// export const authenticate = async () => {
//     if (getRefreshToken()) {
//         try {
//             const tokens = await refreshTokens(); // call an API, returns tokens
//
//             const expires = (tokens.expires_in || 60 * 60) * 1000
//             const inOneHour = new Date(new Date().getTime() + expires)
//
//             // you will have the exact same setters in your Login page/app too
//             Cookies.set('access_token', tokens.access_token, { expires: inOneHour })
//             Cookies.set('refresh_token', tokens.refresh_token)
//
//             return true
//         } catch (error) {
//             redirectToLogin()
//             return false
//         }
//     }
//
//     redirectToLogin()
//     return false
// }