import axios from 'axios';

const VK_APP_ID = 8183753;
const VK_APP_AUTH_REDIRECT_URI = "http://localhost/authvk";

export const URL_CLIENT = 'http://localhost:80/';
export const URL = 'http://localhost:5000/';
export const API_URL = `${URL}api/`;
export const URL_VK_AUTH = 'https://oauth.vk.com/authorize?client_id='+VK_APP_ID+'&display=popup&redirect_uri='+VK_APP_AUTH_REDIRECT_URI+'&response_type=token&scope=email';

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