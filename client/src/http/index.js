import axios from 'axios';
export const URL = 'http://localhost:5000/';
export const API_URL = `${URL}api/`;

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
});

$api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
});

$api.interceptors.response.use(config => {
    return config;
}, async error => {
    const originRequast = error.config;
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        originRequast._isRetry = true;
        try {
            const response = await axios.get(API_URL + 'refresh', { withCredentials: true });
            localStorage.setItem('token', response.data.accessToken);
            return $api.request(originRequast);
        } catch (error) {
            console.log(error);
        }
    }
    throw error;  
});

export default $api;