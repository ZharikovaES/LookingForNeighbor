import React from "react";
import Select from 'react-select';

const SimpleSelect = props => {
    return (
        <div>
            { props.label && (<label>{ props.label }</label>) }
            <Select
                // isClearable={true}
                options={ props.options }
                value={ props.options.find( el => el.value === props.value.value) }
                onChange={ props.handleChange }
            />
        </div>
    );
}

export default SimpleSelect;