import ChatService from "../service/chat-service.js";

export default class ChatController {
    static async getChannels(req, res, next){
        try{
            const cityId = req.params.cityId;
            const currentUserId = req.params.currentUserId;
            const userId = req.params.userId;
            let result = {};
            if (cityId && userId && currentUserId) {
                await ChatService.createChannel(cityId, currentUserId);
                result = await ChatService.getChannels(cityId, currentUserId, userId);
            }
            console.log(result);
            res.json(result);    
        } catch (error){
            next(error);
        }
    }
}