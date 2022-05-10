import React from "react";
import Wrapper from "../wrapper/Wrapper";
import SelectSearch from "./SelectSearch";

const GroupSelectLocation = props => {
    return (
        <div>
            <Wrapper
                label="Укажите, где вы бы хотели снимать жилье"
            >
                <SelectSearch
                    label="Введите адрес"
                    placeholder={ props.placeholder }
                    value={ '0' }
                    name={ '' }
                    getData={ async value => {
                        return await props.getData({ cityId: props.cityId, query: value}) 
                    } }
                    handleChange={ item => {
                        console.log(item);
                        if (item.label) {
                            const newItems = [ ...props.items.filter(el => el.value !== item.value), { value: item.value, label: item.label} ];
                            props.handleChange(newItems)    
                        }
                    } }
                    
                />
                <ul>
                    {
                        props.items.map(el => (
                            <li key={ el.value }>
                                { el.label }
                            </li>
                        ))

                    }
                </ul>
            </Wrapper>
        </div>
    );
}
export default GroupSelectLocation;