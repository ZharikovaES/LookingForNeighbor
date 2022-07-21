import React from 'react';
// import classes from "./LoginForm.module.css";
import Input from '../../UI/input/Input';

const LoginForm = props => {
    return (
        <div className="row">
            <Input
                handleChange={ e => props.onChange({ email: e.target.value}) }
                value={ props.email }
                label="Введите адрес электронной почты"
                id="input-email"
                name="email"
                type="text"
                placeholder="Ваш email"
                required={ true }
            />
            <Input
                handleChange={ e => props.onChange({ password: e.target.value}) }
                value={ props.password }
                label="Введите пароль"
                id="input-password"
                name="password"
                type="password"
                placeholder="Ваш пароль"
                required={ true }
            />
            <div
                className="form-group"
            >
                <button
                    className={"form-control btn btn-outline-primary my-3"}
                >
                    Войти
                </button>
            </div>
        </div>
    );
}
export default LoginForm;