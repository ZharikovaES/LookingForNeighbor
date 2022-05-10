import React, { useEffect, useRef } from "react";
import { useState } from "react";
import Select from 'react-select';

const MultiSelectSearch = props => {
    const changeInputValue = (inputValue, { action, prevInputValue })  => {
        switch (action) {
            case 'input-change':
                return inputValue;
              case 'set-value':
                props.handleChange({id: inputValue.value, name: inputValue.label});
              case 'menu-close':
              console.log(prevInputValue);
              let menuIsOpen = undefined;
              if (prevInputValue) {
                menuIsOpen = true;
              }
              this.setState({
                menuIsOpen,
              });
              return prevInputValue;
            default:
              return prevInputValue;
          }
  
    };
    const changeSelect = data => {
        props.handleChange(data);
    };

    return (
        <div>
            { props.label && (<label>{ props.label }</label>) }
            <Select
                placeholder={ props.placeholder }
                isMulti
                isClearable={ true }
                isSearchable={ true }
                options={ props.options }
                value={ props.values }
                isOptionSelected={(option, selectValue) => selectValue.some(i => i.label === option.label)}
                onChange={changeSelect}
            />
        </div>
    );
}

export default MultiSelectSearch;