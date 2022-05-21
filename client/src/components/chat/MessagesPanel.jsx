import React, { useState } from "react";
import Message from "./Message";
import classes from "./MessagesPanel.module.css"

const MessagesPanel = ({ messages, channel, handleSendMessage, refMessagesList}) => {
    const [currentTextOfInput, setCurrentTextOfInput] = useState('');
    // console.log(messages);
    return (
        <div className={classes.messagesPanel}>
            <div className={classes.messagesList} ref={refMessagesList}>{
                !messages?.length ? (<div className={classes.noContentMessage}>Сообщения отсутствуют</div>) : 
                messages.map(el => {
                    const checkEqualId = el.idOwner === channel.participants.id;
                    return <Message key={el._id} id={el._id} className={checkEqualId ? classes.left : classes.right} username={checkEqualId ? channel.participants.username : "Вы"} text={el.text}/>
                })}</div>
            <form className={classes.messagesInput} onSubmit={e => {
                e.preventDefault();
                handleSendMessage(currentTextOfInput);
                setCurrentTextOfInput('');
            }}>
                <input type="text" value={currentTextOfInput} onChange={e => setCurrentTextOfInput(e.target.value)}/>‍
                <button >Отправить</button>
            </form>
        </div>
    );
}
export default MessagesPanel;