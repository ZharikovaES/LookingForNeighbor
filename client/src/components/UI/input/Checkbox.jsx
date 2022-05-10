import React from "react";

const Checkbox = ({ id, label, checked, handleChange}) => {
    return (
        <div className="form-check">
            <input 
                style={{display: 'inline-block'}}
                id={id}
                className="form-check-input" 
                type="checkbox"
                checked={checked}
                onChange={e => handleChange(e.target.checked)}
            />
            <label
                className="form-check-label"
                htmlFor={id}
            >
                { label }
            </label>
        </div>
    );
}

export default Checkbox;