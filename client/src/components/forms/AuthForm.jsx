import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../..";
import AuthSocial from "./AuthSocial/AuthSocial";

const AuthForm = ({ title, children, onSubmit, handleUser }) => {
    const { store } = useContext(Context);
    // const [ email, setEmail ] = useState('');
    // const [ password, setPassword ] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (store.isAuth) {
            console.log(store.isAuth);
            navigate("../");
        }
    }, [ store.isAuth ]);

    useEffect(() => {
        if (store.isRegistrationProcess) navigate("../registration");
    }, [store.isRegistrationProcess]);

    return (
    <div
        className="height-full row justify-content-center align-items-center"
    >
        <form className="col-6 pb-5" onSubmit={async e => {
            e.preventDefault();
            onSubmit();
        }}>
            <h2>{ title }</h2>
            <div className="">
                { children }
                <div 
                    className='row text-center'    
                >
                    <span>или</span>
                </div>
                <AuthSocial
                    handleUser={ handleUser }
                />
            </div>
        </form>
    </div>
    )
}
export default observer(AuthForm);