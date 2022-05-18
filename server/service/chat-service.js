import path from 'path';
import { io } from '../index.js';

import chatModel from "../models/chat.js";
import ConvertService from './convert-service.js';

export default class ChatService {
    static __dirname = path.resolve();
    //getChannels
    static async getChannels(cityId, userId){
        
    }
    static async createChannel(cityId, currentUserId, userId){
        await chatModel.createChannelByCityIdByUserId(cityId, currentUserId, userId);
    }
    static async changeChannel(socket, {oldChannelId, newChannelId}){
        socket.leave(oldChannelId);
        socket.join(newChannelId);
    }

    static async getChannelsByCityIdByUserId(socket, { cityId, currentUserId, userId=null }){
        if (userId) {
            let currentChannelId = await chatModel.createChannelByCityIdByUserId(cityId, currentUserId, userId);
            const result = ConvertService.convertChannelMessagesDbObjToClientObj(currentUserId, await chatModel.findByCityIdByUserId(cityId, currentUserId));
            console.log("check");
            console.log(result, currentChannelId, socket.id);
            socket.join(currentChannelId);
            socket.emit("set channels and current channel", result, currentChannelId);    
        } else {
            const result = ConvertService.convertChannelMessagesDbObjToClientObj(currentUserId, await chatModel.findByCityIdByUserId(cityId, currentUserId));
            socket.emit("set channels", result);    

        }
    }
    static async pushNewMessageByCityIdByUserIdByChannelId(socket, { cityId, channelId, userId, text }){
        if (cityId && channelId && userId && text){
            await chatModel.createMessageByCityIdByUserIdByChannelId(cityId, userId, channelId, text.substr(0, 200));
            const result = ConvertService.convertChannelMessagesDbObjToClientObj(userId, await chatModel.findByCityIdByUserId(cityId, userId));
            console.log("messages");
            console.log(result[0].messages);
            io.to(channelId).emit("set message", result);
        }
        // const result = ConvertService.convertChannelMessagesDbObjToClientObj(currentUserId, await chatModel.findByCityIdByUserId(cityId, currentUserId));
        // console.log("check");
        // console.log(result, currentChannelId);
        // socket.emit("set channels", result, currentChannelId);
    }
}