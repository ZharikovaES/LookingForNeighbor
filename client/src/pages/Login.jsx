import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useState } from "react";
import { Context } from "..";
import AuthForm from "../components/forms/AuthForm";
import LoginForm from "../components/forms/LoginForm/LoginForm";

const Login = () => {
    const { store } = useContext(Context)
    const [ loginData, setLoginData ] = useState({
                                            password: '',
                                            typeAuth: 0, 
                                            email: ''
                                        });

    return (
        <div className="container-md">
            <AuthForm
                title="Вход в систему"
                onSubmit={async () => {
                    if (loginData.email && loginData.password && !loginData.typeAuth) {
                        await store.login(loginData.email, loginData.password);
                    }
                }}
                handleUser={ newProperty => {
                    store.updateUser(newProperty);
                }}
            >
                <LoginForm
                    login={loginData.email}
                    password={loginData.password}
                    onChange={(val => {
                        setLoginData({ ...loginData, ...val })
                    })}
                />
            </AuthForm>
        </div>
    );
}
export default observer(Login);