import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Context } from '../..';
import AuthenticationButton from '../UI/button/AuthenticationButton';
import Input from '../UI/input/Input';

const LoginForm = props => {
    const { store } = useContext(Context);
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const title = "Вход в систему";

    return (
        <div>
            <form className="height-full">
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
                    <AuthenticationButton 
                        authenticationFunc={() => store.login(email, password)}
                    >
                            Войти
                    </AuthenticationButton >
                </div>
            </form>
        </div>
    );
}
export default observer(LoginForm);