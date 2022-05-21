import ChatService from "../service/chat-service.js";

export const connection = socket => {        
    socket.on("create new chanel and get channels", data => {
        ChatService.createChannelByUserIdAndGetChannelsByCityIdByUserId(socket, data);
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
    socket.on("get channels and messages", data => {
        ChatService.getChannelsAndMessagesByCityIdByUserId(socket, data);
    });
    socket.on("disconnect", () => {
    });
}

