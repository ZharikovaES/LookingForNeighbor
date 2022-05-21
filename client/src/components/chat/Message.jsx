import React from "react";
import classes from "./MessagesPanel.module.css"

const Message = ({ username, text, className}) => {
    return (
        <div className={[classes.messageItem, className].join(' ')}>
            <div><b>{username}</b></div>
            <div>{text}</div>
        </div>
    );
}
export default Message;