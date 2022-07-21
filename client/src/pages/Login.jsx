import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "..";
import AuthForm from "../components/forms/AuthForm";
import LoginForm from "../components/forms/LoginForm/LoginForm";

const Login = () => {
    const { store } = useContext(Context)
    const navigate = useNavigate();
    const location = useLocation();
    const [ loginData, setLoginData ] = useState({
                                            password: '',
                                            typeAuth: 0, 
                                            email: ''
                                        });
    const fromPage = location.state?.from?.pathname || '/';

    // useEffect(() => {
    //     if (store.isAuth)
    //         navigate(fromPage);
    // }, [store.isAuth]);

    // useEffect(() => {
    //     if (store.isRegistrationProcess)
    //         navigate("../registration");
    // }, [store.isRegistrationProcess]);
    
    return (
        <div className="container-md">
            <AuthForm
                title="Вход в систему"
                onSubmit={async () => {
                    if (loginData.email && loginData.password && !loginData.typeAuth) {
                        await store.login(loginData.email, loginData.password);
                        // navigate("../"); 
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
                        setLoginData({ ...loginData, ...val})
                    })}
                />
            </AuthForm>
        </div>
    );
}
export default observer(Login);