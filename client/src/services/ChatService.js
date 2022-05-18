import $api, { API_URL } from "../http"

export default class ChatService {
    static async fetchChannelsByCityIdByUserId(cityId, currentUserId, userId){
        let result = null;
        const response = await $api.get(API_URL + `channels/${cityId}/${currentUserId}/${userId}`);
        if (response.data)
            result = response.data;
        return result;
    }
}