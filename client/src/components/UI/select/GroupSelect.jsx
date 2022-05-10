import React, { useState } from 'react';
import Wrapper from '../wrapper/Wrapper';
import SelectSearch from './SelectSearch';

const GroupSelect = props => {
    const handleChange = (value, index) => {
        const arr = props.values.map((el, i) => (i === index) ? { id: value.value, title: value.label } : { id: el.id, title: el.title });
        props.handleChange(arr); 
    }

    return (
        <Wrapper
            label={ props.label }
        >
            {
                props.values.map((element, index) => 
                (<SelectSearch
                    key={ element.label.eng }
                    label={ element.label.ru }
                    placeholder={ element.label.ru }
                    value={ element.id }
                    name={ element.title }
                    disabled={ index > 0 && !props.values[index - 1].id && !props.values[index - 1].title }
                    handleChange={ value => handleChange(value, index) }
                    getData={ async value => { return await props.getData(index, value) } }

                />)
                )
            }
        </Wrapper>
    );
}

export default GroupSelect;