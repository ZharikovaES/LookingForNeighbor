import React from "react";
import { URL } from "../../../http";
import classes from "./BalloonContentBody.module.css";
import profileDefaultImg from '../../../assets/img/profile-default.png';

const BalloonContentBody = ({ username, dateOfBirth, imagePreviewUrl, gender, smoking, address }, navigate) => {
    const linkImg = imagePreviewUrl ? URL + imagePreviewUrl : profileDefaultImg;
    const genderUser = gender ? 'женский' : 'мужской';
    const smokingUser = smoking ? 'Нет' : 'Да';
    return (
        <div className={classes.partialInfo}>
            <div className={classes.partialInfoColumn}>
                <img className={["border border-3 border-purple-dark", classes.balloonImg].join(' ')} src={linkImg}/>
            </div>
            <div className={[classes.partialInfoDesc, classes.partialInfoColumn].join(' ')}>
                <h5 className={classes.partialInfoTitle}>{username + ', ' + (new Date().getFullYear() - new Date(dateOfBirth).getFullYear()) + ' лет'}</h5>
                <table>
                    <tr><td className={classes.partialInfoItemTitle}>Пол:</td><td>{genderUser}</td></tr>
                    <tr><td className={classes.partialInfoItemTitle}>Курит?</td><td>{smokingUser}</td></tr>
                    <tr><td className={classes.partialInfoItemTitle}>Пол:</td><td>{genderUser}</td></tr>
                    <tr><td className={classes.partialInfoItemTitle}>Адрес:</td><td>{address}</td></tr>
                </table>
            </div>
        </div>
    );
}

export default BalloonContentBody;