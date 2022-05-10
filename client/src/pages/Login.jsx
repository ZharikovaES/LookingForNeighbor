import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "..";
import LoginForm from "../components/forms/LoginForm";

const Login = () => {
    const { store } = useContext(Context)
    const navigate = useNavigate();
    const location = useLocation();
    const fromPage = location.state?.from?.pathname || '/';
    useEffect(() => {
        if (store.isAuth)
        navigate(fromPage);
    }, [store.isAuth]);
    
    return (
        <div className="container-md">
            <LoginForm/>
        </div>
    );
}
export default observer(Login);