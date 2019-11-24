import Cookies from 'js-cookie'
import Configuration from "./Configuration";

export const getAccessToken = () => Cookies.get('access_token');
export const isAuthenticated = () => !!getAccessToken();

export function authHeader() {
    // return authorization header with basic auth credentials
    if (isAuthenticated()) {
        return { 'Authorization': 'Basic ' + getAccessToken() };
    } else {
        return {};
    }
}

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
                    logout();
                }

                const error = response.statusText;
                return Promise.reject(error);
            }
                // store user details and basic auth credentials in local storage
                // to keep user logged in between page refreshes

            Cookies.set("access_token", response.headers.get("gosessionid"));

            return response;
        });
}

export function logout() {
    // remove user from local storage to log user out
    Cookies.remove('access_token')
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