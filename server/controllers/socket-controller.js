// import { connectToRoom, disconnect, getActiveEmptyCell, getMovingChecker, getPlayers, completingConnectionToRoom, removeEatingCheckers } from '../connect-controller.js';

import ChatService from "../service/chat-service.js";

export const connection = socket => {        
    socket.on("create new chanel and get channels", data => {
        ChatService.getChannelsByCityIdByUserId(socket, data);
    });
    socket.on("get channels", data => {
        ChatService.getChannelsByCityIdByUserId(socket, data);
    });
    socket.on("change channel", data => {
        ChatService.changeChannel(socket, data);
    });
    socket.on("push message", data => {
        ChatService.pushNewMessageByCityIdByUserIdByChannelId(socket, data);
    });
    
    // socket.on("completing connect to room", data => {
    //     completingConnectionToRoom(socket, data);
    // });
    // socket.on("get players", data => {
    //     getPlayers(socket, data);
    // });
    // socket.on("get active empty cell", data => {
    //     getActiveEmptyCell(socket, data);
    // });
    // socket.on("get moving checker", data => {
    //     getMovingChecker(socket, data);
    // });
    // socket.on("remove eating-checkers", data => {
    //     removeEatingCheckers(socket, data);
    // });
    socket.on("disconnect", () => {
        // disconnect(socket);
    });
}

