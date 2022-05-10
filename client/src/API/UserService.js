import axios from 'axios';
import { API_URL } from '../http';

export default class UserService {
    static async getSimplifiedUsers(params){
        let simplifiedUsers = [];
        const response = await axios.get(API_URL + 'users/simplified', { params });
        if (response.data)
            simplifiedUsers = response.data;
        return simplifiedUsers;
    }
}