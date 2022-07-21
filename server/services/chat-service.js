import path from 'path';
import { io } from '../index.js';

import chatModel from "../models/chat.js";
import ConvertService from './convert-service.js';

export default class ChatService {
    static __dirname = path.resolve();
    static async createChannel(cityId, currentUserId, userId){
        await chatModel.createChannelByCityIdByUserId(cityId, currentUserId, userId);
    }
    static async changeChannel(socket, {oldChannelId, newChannelId}){
        socket.leave(oldChannelId);
        socket.join(newChannelId);
    }
    static async getChannelsAndMessagesByCityIdByUserId(socket, { cityId, currentUserId, channelId }){
        const result = ConvertService.convertChannelMessagesDbObjToClientObj(currentUserId, await chatModel.findByCityIdByUserId(cityId, currentUserId));
        socket.emit("set channel and messages", result.find(el => el._id === channelId).messages, channelId);    
    }
    static async createChannelByUserIdAndGetChannelsByCityIdByUserId(socket, { cityId, currentUserId, userId }){
        let currentChannelId = await chatModel.createChannelByCityIdByUserId(cityId, currentUserId, userId);
        const result = ConvertService.convertChannelMessagesDbObjToClientObj(currentUserId, await chatModel.findByCityIdByUserId(cityId, currentUserId));
        socket.join(currentChannelId);
        socket.emit("set channels and current channel", result, currentChannelId);    
    }
    static async getChannelsByCityIdByUserId(socket, { cityId, currentUserId }){
        const result = ConvertService.convertChannelMessagesDbObjToClientObj(currentUserId, await chatModel.findByCityIdByUserId(cityId, currentUserId));
        socket.emit("set channels", result);    
    }
    static async pushNewMessageByCityIdByUserIdByChannelId(socket, { cityId, channelId, userId, text }){
        if (cityId && channelId && userId && text){
            await chatModel.createMessageByCityIdByUserIdByChannelId(cityId, userId, channelId, text.substr(0, 200));
            const result = ConvertService.convertChannelMessagesDbObjToClientObj(userId, await chatModel.findByCityIdByUserId(cityId, userId));
            io.to(channelId).emit("set message", result.find(el => el._id === channelId).messages, channelId);
        }
    }
}