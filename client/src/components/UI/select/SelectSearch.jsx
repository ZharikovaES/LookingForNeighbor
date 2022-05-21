import React, { useEffect, useRef } from "react";
import { useState } from "react";
import Select from 'react-select';

const SelectSearch = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const timer = useRef(null);

    const changeInputValue = value => {
        if (timer.current) clearTimeout(timer.current);

        if (value) {
            setIsLoading(true);
            timer.current = setTimeout(async () => {
                if (value){
                    const data = await props.getData(value);
                    if (data) setOptions(data);
                }
                setIsLoading(false);
            }, 500);
        } else setIsLoading(false);
    };
    const changeSelect = data => {
        setIsLoading(false);
        if (data) props.handleChange(data);
        else props.handleChange({id: '0', name: ""});
    };


    return (
        <div>
            { props.label && (<label>{ props.label }</label>) }
            <Select
                defaultValue={props.value}
                isLoading={isLoading}
                isClearable={true}
                isSearchable={true}
                isDisabled={ props.disabled }
                options={ options }
                placeholder={props.placeholder}
                value={ options.find( el => el.value === props.value) || {value: props.value, name: props.name} }
                onInputChange={changeInputValue}
                onChange={changeSelect}
            />
        </div>
    );
}

export default SelectSearch;