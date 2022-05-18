import React from "react";
import classes from "./ChannelList.module.css"

const Channel = ({ isActive, username, dateOfBirth, updateDate, onClick }) => {
    return (
        <div className={[classes.channelItem, isActive ? classes.active : ''].join(' ')} onClick={onClick}>
            <div>{`${username}, ${(new Date().getFullYear() - new Date(dateOfBirth).getFullYear())} лет`}</div>
            <span>{(new Date(updateDate)).toLocaleDateString()}</span>
        </div>
    );
}
export default Channel;