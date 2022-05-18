import React, { useState } from "react";
import Channel from "./Channel";
import classes from "./ChannelList.module.css"

const ChannelList = ({ currentChannelId, channels, handelClick }) => {
    let list = channels?.length ? channels.map(c => <Channel 
                                                            isActive={currentChannelId === c._id}
                                                            key={c._id} 
                                                            id={c._id} 
                                                            username={c.participants.username} 
                                                            dateOfBirth={c.participants.dateOfBirth} 
                                                            updateDate={c.updateDate}
                                                            onClick={e => {
                                                                handelClick(c._id);
                                                            }}
                                                    />) : "Чаты отсутсвуют"
        
    return (
        <div className={classes.channelList}>
            {list}
        </div>
    );
}
export default ChannelList;