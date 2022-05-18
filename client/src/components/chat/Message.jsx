import React from "react";
import classes from "./MessagesPanel.module.css"

const Message = ({ username, text, className}) => {
    console.log(username);
    return (
        <div className={[classes.messageItem, className].join(' ')}>
            <div><b>{username}</b></div>
            <span>{text}</span>
        </div>
    );
}
export default Message;