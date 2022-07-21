import { observer } from "mobx-react-lite";
import React from "react";
import Input from "../UI/input/Input";
import InputPassword from "../UI/input/InputPassword";

const RegistrationForm = ({ handleChange, newUser }) => {
    console.log(newUser.email);
    return (
        <div className="row">
            <Input 
                handleChange={ e => handleChange({ email: e.target.value }) }
                value={ newUser.email }
                label="Введите адрес электронной почты"
                id="input-email"
                name="email"
                type="text"
                placeholder="Ваш email"
                required={ true }
            /> 
            <InputPassword
                name="password"
                value={ newUser.password }
                onChange={ value => handleChange({ password: value }) }
            />
            <div
                className="form-group"
            >
                <button
                    className={"form-control btn btn-outline-primary my-3"}
                >
                    Продолжить
                </button>
            </div>
        </div>
    );
}
export default RegistrationForm;