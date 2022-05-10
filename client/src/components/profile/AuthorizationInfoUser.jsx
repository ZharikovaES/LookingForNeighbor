import React from "react";

import Input from "../UI/input/Input";
import CalendarDateOfBirth from "../UI/calendar/CalendarDateOfBirth";
import ImageUpload from "../UI/input/ImageUpload/ImageUpload";
import InputPassword from "../UI/input/InputPassword";
import GroupInputsRadio from '../UI/input/GroupInputsRadio';
import TextArea from '../UI/input/TextArea';

const AuthorizationInfoUser = props => {
    const handleChange = newProperty => {
        props.handleChange({ user: { ...props.newUser, ...newProperty }});
    }
    return (
        <div>
            <Input 
                handleChange={ e => handleChange({ username: e.target.value }) }
                value={ props.newUser.username }
                label="Введите Ваше имя"
                id="input-username"
                type="text"
                placeholder="Игорь"
                required={ true }
            />
            <CalendarDateOfBirth 
                handleChange={ value => handleChange({ dateOfBirth: value }) }
                value={ props.newUser.dateOfBirth }
                label="Выберите дату рождения"
                placeholderText="20.07.1999"
                id="input-date-of-birth"
                required={ true }
            />
            <GroupInputsRadio 
                label="Ваш пол"
                values={ [
                    {value: 0, name: "мужской"}, 
                    {value: 1, name: "женский"}
                ] }
                value={ props.newUser.gender }
                handleChange={ e => handleChange({ gender: +e.target.value }) }
                name="gender"
            />
            <ImageUpload 
                value={ props.newUser.image }
                handleChange={ value => handleChange({ image: value }) }
            />
            <TextArea
                label="Напишите что-нибудь о себе"
                placeholder="О себе..."
                maxLength={ 200 }
                value={ props.newUser.description }
                handleChange={ e => handleChange({ description: e.target.value }) }
            />
            <Input 
                handleChange={ e => handleChange({ email: e.target.value }) }
                value={ props.newUser.email }
                label="Введите адрес электронной почты"
                id="input-email"
                type="text"
                placeholder="Ваш email"
                required={ true }
            />
            <InputPassword
                value={ props.newUser.password }
                onChange={ value => handleChange({ password: value }) }
            />
        </div>
    );
}
export default AuthorizationInfoUser;