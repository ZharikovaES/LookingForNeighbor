import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../..';
import AuthenticationButton from '../UI/button/AuthenticationButton';
import Input from '../UI/input/Input';

const LoginForm = props => {
    const { store } = useContext(Context);
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const navigate = useNavigate();

    const title = "Вход в систему";

    return (
        <div>
            <form className="height-full" onSubmit={async e => {
                e.preventDefault();
                await store.login(email, password);
                navigate("../"); 
            }}>
                <h2>{ title }</h2>
                <Input
                    handleChange={ e => setEmail(e.target.value) }
                    value={ email }
                    label="Введите адрес электронной почты"
                    id="input-email"
                    type="text"
                    placeholder="Ваш email"
                    required={ true }
                />
                <Input
                    handleChange={ e => setPassword(e.target.value) }
                    value={ password }
                    label="Введите пароль"
                    id="input-password"
                    type="password"
                    placeholder="Ваш пароль"
                    required={ true }
                />
                <div className="bottom row justify-content-sm-center m-4">
                    <button
                        className={"btn btn-outline-primary"}
                    >
                        Войти
                    </button>
                </div>
            </form>
        </div>
    );
}
export default observer(LoginForm);