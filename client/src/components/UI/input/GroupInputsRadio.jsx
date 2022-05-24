import React, { useEffect, useState } from "react";

const GroupInputsRadio = props => {
    const [ currentValue, setCurrentValue ] = useState(props.values.map(el => el.value === props.value ? { ...el, checked: true} : { ...el, checked: false}));
    useEffect(() => {
        setCurrentValue(currentValue.map(el => el.value === props.value ? { ...el, checked: true} : { ...el, checked: false}));
    }, [props.value])

    return (
        <div className={props.className}>
            { props.label && (<label className="mb-1">{ props.label }</label>) }
            {
            currentValue.map((el, i) => 
                <div className="form-check" style={{ paddingLeft: "1.8em" }} key={ el.value }>
                    <input 
                        className="form-check-input"
                        name={ props.name } 
                        value={ el.value }
                        type="radio" 
                        id={ `${props.name}${i}` } 
                        checked={ el.checked }
                        onChange={ e => props.handleChange(e)}
                    />
                    <label 
                        className="form-check-label"
                        htmlFor={ `${props.name}${i}`}
                    >
                        { el.name }
                    </label>
                </div>   
            )
        }</div>

    );
};
export default GroupInputsRadio;