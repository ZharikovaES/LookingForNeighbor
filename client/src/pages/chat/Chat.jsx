import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socketClient  from "socket.io-client";
import classes from "./Chat.module.css";
import { Context } from "../..";
import ChannelList from "../../components/chat/ChannelList";
import MessagesPanel from "../../components/chat/MessagesPanel";
import { URL } from '../../http';

const Chat = () => {
    const { store } = useContext(Context);
    const params = useParams();
    const refMessagesList = useRef(null);

    const [channels, setChannels] = useState([]);
    const [currentMessages, setCurrentMesssages] = useState([]);
    const [oldChannelId, setOldChannelId] = useState(null);
    const [currentChannelId, setCurrentChannelId] = useState(null);
    const [socket, setSocket] = useState(null);

    const handleSendMessage = (text) => {
        if (text) socket.emit('push message', {cityId: store.location.city.idKladr, channelId: currentChannelId, userId: store.user.id, text})
    }
    const messageAndChannelListener = (messages, channelId) => {
        setCurrentChannelId(channelId);
        setCurrentMesssages([...messages]);
                refMessagesList.current.scrollTop = refMessagesList.current.scrollHeight;
    }
    const messageListener = (messages, channelId) => {
        setCurrentMesssages([...messages]);
        refMessagesList.current.scrollTop = refMessagesList.current.scrollHeight;
    };
    useEffect(() => {
        if (socket) {
            socket.emit('change channel', {oldChannelId: oldChannelId, newChannelId: currentChannelId});
            setOldChannelId(currentChannelId);
            refMessagesList.current.scrollTop = refMessagesList.current.scrollHeight;    
        }
    }, [currentChannelId]);

    useEffect(() => {
        const socket = socketClient(URL);
        const channelsListener = (channels, id) => {
            setCurrentChannelId(id);
            setChannels([...channels]);
            setCurrentMesssages([...channels.find(el => el._id === id).messages]);
            refMessagesList.current.scrollTop = refMessagesList.current.scrollHeight;
        };
        socket.on('set channels and current channel', channelsListener);
        socket.on('set channels', channels => { 
            setChannels([...channels]);
            if (currentChannelId)
                setCurrentMesssages([...channels.find(el => el._id === currentChannelId).messages]);
        });
        socket.on('set channel and messages', messageAndChannelListener);
        socket.on('set message', messageListener);
        if (params.userId)
            socket.emit('create new chanel and get channels', { cityId: params.cityId, currentUserId: store.user.id, userId: params.userId });
        else socket.emit('get channels', { cityId: params.cityId, currentUserId: store.user.id });

        setSocket(socket);
        return () => socket.close();
    }, []);
    const changeCurrentChannelId = newCurrentChannelId => {
        setOldChannelId(currentChannelId);
        socket.emit('get channels and messages', { cityId: params.cityId, currentUserId: store.user.id, channelId: newCurrentChannelId });
    }

    return (
        <div className={[classes.chat, "height-full"].join(' ')}>
            <ChannelList currentChannelId={currentChannelId} channels={channels} handelClick={changeCurrentChannelId}/>{
            currentChannelId && <MessagesPanel messages={currentMessages} channel={channels.find(el => el._id === currentChannelId)} handleSendMessage={handleSendMessage} refMessagesList={refMessagesList}/>
            }
        </div>
    );
}

export default observer(Chat);