import $api, { API_URL } from "../http"

export default class UserService {
    static async fetchUsers(cityId, limit) {
        return $api.get('/users', { cityId, limit });
    }
    static async fetchUserByCityIdByUserId(cityId, userId, currentUserId){
        let result = null;
        const response = await $api.get(API_URL + `users/${cityId}/${userId}/${currentUserId}`);
        if (response.data)
            result = response.data;
        return result;
    }
    static async postRatingFromUser(cityId, userId, ratedUserId, newRating){
        let result = null;
        const response = await $api.post(API_URL + `user/rating`, {
                                                cityId, userId, ratedUserId, newRating
                                            });
        if (response.data)
            result = response.data;
        return result;
    }
}