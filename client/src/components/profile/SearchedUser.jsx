import React from 'react';
import Checkbox from '../UI/input/Checkbox';
import GroupInputsRadio from '../UI/input/GroupInputsRadio';
import RangeTwoValues from '../UI/range/RangeTwoValues';
import MultiSelectSearch from '../UI/select/MultiSelectSearch';

const SearchedUser = props => {
    const minAge = 18;
    const maxAge = 100;
    return (
        <div>
            <GroupInputsRadio 
                label="Занятость искомого пользователя"
                values={ [
                    {value: 0, name: "Не важно"}, 
                    {value: 1, name: "Работает"},
                    {value: 2, name: "Учится"}
                ] }
                value={ props.searchedUser.isBusy }
                handleChange={ e => props.handleChange({ searchedUser: {...props.searchedUser, isBusy: +e.target.value } }) }
                name="isBusy"
            />
            <GroupInputsRadio 
                label="Пол"
                values={ [
                    {value: 0, name: "Не важно"}, 
                    {value: 1, name: "Мужской"}, 
                    {value: 2, name: "Женский"}
                ] }
                value={ props.searchedUser.gender }
                handleChange={ e => props.handleChange({ searchedUser: {...props.searchedUser, gender: +e.target.value } }) }
                name="gender"
            />
            <RangeTwoValues
                label="Возраст искомого пользователя"
                step={1}
                min={minAge}
                max={maxAge}
                values={props.searchedUser.age}
                handleChange={ values => props.handleChange({ searchedUser: {...props.searchedUser, age: values } }) }
            />
            <MultiSelectSearch
                label="Характеристики, которыми должен обладать искомый сосед"
                placeholder="Не важно"
                options={ props.characteristics }
                values={ props.searchedUser.characteristics.map(el => { return { label: props.characteristics[+el - 1].label, value: +el } }) }
                handleChange={ values => {
                    props.handleChange({ searchedUser: {...props.searchedUser, 
                                                    characteristics: values.map(el => +el.value)
                                                }}) }}
            />
            <GroupInputsRadio 
                label="Религия"
                values={ [
                    {value: 0, name: "Не важно"}, 
                    {value: 1, name: "Схожа с религией, которую я исповедую (выбрал(-а) ранее)"},
                ] }
                value={ props.searchedUser.religion }
                handleChange={ e => props.handleChange({ searchedUser: {...props.searchedUser, religion: +e.target.value} }) }
                name="attitude-religion"
            />
            <Checkbox
                label="Подбирать пользователей только с фото"
                checked={props.searchedUser.hasPhoto}
                id="photo-exists"
                handleChange={ value => {
                    props.handleChange({ searchedUser: {...props.searchedUser, hasPhoto: value } });
                }}
            />
        </div>
    );
}

export default SearchedUser;