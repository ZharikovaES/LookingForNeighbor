import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";

import classes from "./AuthSocial.module.css";

import { Context } from "../../..";
import AuthService from "../../../services/AuthService.js";
import { URL_VK_AUTH } from "../../../http";


const AuthSocial = ({ handleUser }) => {
    const { store } = useContext(Context);
    const googleAccount = window.google?.accounts;

    const handleCallbackResponse = async (response) => {
        const data = await AuthService.authenticationByGoogle(response.credential);
        console.log(data);
        store.authenticationBySocial(data);
        if (!data.isAuth) 
            handleUser({ typeAuth: 1, email: data?.user?.email, username: data?.user?.name })
    }
    const handleVKAuth = () => {
        window.setHash = async hash => {
            let str = hash.split('&').slice(-1)[0];
            if (str) {
                let emailArr = str.split("=");
                if (emailArr.length === 2) {
                    const data = await AuthService.authenticationByVK({ email: emailArr[1] });
                    store.authenticationBySocial(data);
                    if (!data?.isAuth) 
                        handleUser({ typeAuth: 2, email: data?.user?.email })
                }
            }
        }

        window.open(URL_VK_AUTH, 'vk-login', 'width=665,height=370');

    }
    useEffect(() => {
        googleAccount?.id.initialize({
            client_id: "19329219909-hf0lpqkdc5nrnb54r5n1ceoi9c347ecn.apps.googleusercontent.com",
            callback: handleCallbackResponse
        });
        googleAccount?.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size: "large" }
        );
    }, [ googleAccount?.id ]);


    return (
        <div
            className={["row justify-content-md-center mx-0", googleAccount ? "mt-3" : ''].join(' ')}
        >
            { googleAccount && 
                <div 
                    className={["col-6", classes.googlePositionBtn].join(' ')}
                    id="signInDiv"
                >
                    Через Google-аккаунт
                </div>
            }
            <button 
                className={["btn btn-outline-primary col", googleAccount ? "col-6" : "my-3 mx-0"].join(' ')}
                type="button"
                onClick={handleVKAuth}
            >
                Через VK-аккаунт
            </button>

        </div>

    );
}
export default observer(AuthSocial);