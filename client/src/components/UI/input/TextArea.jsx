import React from "react";

const TextArea = props => {
    return (
        <div>
            { props.label && (<label>{ props.label }</label>) }
            <textarea
                className="form-control"
                maxLength={props.maxLength }
                placeholder={props.placeholder }
                onChange={ props.handleChange }
                value={ props.value }
            />
        </div>
    );
}
export default TextArea;