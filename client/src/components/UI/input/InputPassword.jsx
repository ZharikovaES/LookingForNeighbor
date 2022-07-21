import React, { useEffect, useState } from "react";
import Input from "./Input";

const InputPassword = props => {
    const [ noConfirmPassword, setNoConfirmPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ valid, setValid ] = useState(false);

    const handleChange = e => {
        setNoConfirmPassword(e.target.value);
        setConfirmPassword('');
        setValid(false);
    }

    const checkEnteredPassword = e => {
        if (e.target.value === noConfirmPassword) {
            props.onChange(e.target.value);
            setValid(true);
        } else setValid(false);
        setConfirmPassword(e.target.value);
    }
    useEffect(() => {
        if (props.value) {
            setConfirmPassword(props.value);
            setValid(true);
        } else setValid(false);
        setNoConfirmPassword(props.value);
    }, [])


    return (
        <div>   
            <Input
                name={props.name}
                handleChange={ handleChange }
                value={ noConfirmPassword }
                label="Введите пароль"
                id="input-password"
                type="password"
                placeholder="Ваш пароль"
                required={ true }
                minLength={ 6 }
                maxLength={ 30 }
                size={ 30 }
                //className={ valid ? "valid" : "invalid" }
            />
            <Input 
                value={ confirmPassword }
                disabled={ !noConfirmPassword }
                handleChange={ checkEnteredPassword }
                label="Введите пароль повторно"
                id="input-confirm-password"
                type="password"
                placeholder="Ваш пароль"
                required={ true }
                // valid={ valid }
            />

        </div>
    );
}

export default InputPassword;