import React from "react";

const Input = props =>  {
    return (
        <div className="form-group">
            { props.label && (<label htmlFor={props.id}>{props.label}</label>) }
            <input 
                onChange={ props.handleChange }
                value={ props.value }
                type={props.type}
                name={props.name}
                placeholder={props.placeholder}
                id={props.id}
                required={ props.required }
                minLength={ props.minLength }
                maxLength={ props.maxLength }
                size={ props.size }
                disabled={ props.disabled }
                className="form-control"
                // className={ props.valid ? "valid" : "invalid" }
                />
        </div>
    );
}
export default Input;