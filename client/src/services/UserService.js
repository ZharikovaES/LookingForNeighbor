import $api, { API_URL } from "../http"

export default class UserService {
    static async fetchUsers(cityId, limit) {
        return $api.get('/users', { cityId, limit });
    }
    static async fetchUserByCityIdByUserId(cityId, userId){
        let result = null;
        const response = await $api.get(API_URL + `users/${cityId}/${userId}`);
        if (response.data)
            result = response.data;
        return result;
    }
}