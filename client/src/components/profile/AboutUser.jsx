import React from "react";

import SelectSearch from "../UI/select/SelectSearch";
import GroupInputsRadio from '../UI/input/GroupInputsRadio';
import UtilService from '../../API/UtilService';
import GroupSelect from '../UI/select/GroupSelect';
import MultiSelectSearch from '../UI/select/MultiSelectSearch';
import SimpleSelect from '../UI/select/SimpleSelect';


const AboutUser = props => {
    const labelGroupSelect = [ {ru: "Университет", eng: "University"}, 
                                { ru: "Факультет", eng: "Faculty"},
                                {ru: "Кафедра", eng: "Chair"}];
    const religions = [{
                label: "Атеизм",
                value: 1
            },
            {
                label: "Православие",
                value: 2
            },
            {
                label: "Буддизм",
                value: 3
            },
            {
                label: "Ислам",
                value: 4
            },
            {
                label: "Католицизм",
                value: 5
            }
    ];
    const handleChangeLocation = newProperty => {
        props.handleChange({ location: { ...props.location, ...newProperty} });
    };
    const handleChangeUser = newProperty => {
        props.handleChange({ user: { ...props.newUser, ...newProperty} });
    };
    return (
        <div>
            <SelectSearch 
                value={ props.location.city.idKladr }
                name={ props.location.city.name }
                getData={ async value => { return await UtilService.getCities({ query: value }) } }
                label="Выберите город, в котором планируете осуществлять поиск"
                placeholder="Город поиска..."
                handleChange={ value => handleChangeLocation({ city: { idKladr: value.value, name: value.label }}) }
            />
            <GroupInputsRadio 
                label="Вы курите? Если нет, то, как вы относитесь к проживанию с курящим в одной квартире?"
                values={ [
                    {value: 0, name: "Нет, нейтрально"},
                    {value: 1, name: "Нет, негативно"},
                    {value: 2, name: "Да"}
                ] }
                value={ props.newUser.smoking }
                handleChange={ e => handleChangeUser({ smoking: +e.target.value }) }
                name="smoking"
            />
            <GroupInputsRadio 
                label="Ваше отношение к алкоголю"
                values={ [
                    {value: 0, name: "Нейтральное"}, 
                    {value: 1, name: "Негативное"},
                    {value: 2, name: "Положительное"},
                ] }
                value={ props.newUser.attitudeAlcohol }
                handleChange={ e => handleChangeUser({ attitudeAlcohol: +e.target.value }) }
                name="attitude-alcohol"
            />
            <SelectSearch 
                value={ props.newUser.job.id }
                name={ props.newUser.job.name }
                getData={ async value => { return await UtilService.getJobs({ text: value}) } }
                label="Выберите свою профессию"
                placeholder="Ваша профессия..."
                handleChange={ value => handleChangeUser({ job: { id: value.value, name: value.label, professionalRoles: value.professional_roles} }) }
            />
            <GroupSelect
                label="Учеба"
                values={ Object.values(props.newUser.education).map((el, index) => { return {...el, label: labelGroupSelect[index]}})}
                getData={ async (index, value) => {
                    switch(index) {
                        case 0:
                            return await UtilService.getUniversities({ countryId: props.location.country.id, query: value })
                        case 1:
                            return await UtilService.getFaculties({ universityId: props.newUser.education.university.id })
                        case 2:
                            return await UtilService.getChairs({ facultyId: props.newUser.education.faculty.id })
                    }
                } }
                handleChange={ value => {
                    handleChangeUser({ education: {
                        university: value[0],
                        faculty: value[1],
                        chair: value[2],
                }}) }}
            />
            <MultiSelectSearch
                label="Выберите свои характеристики"
                placeholder="Ваши характеристики"
                options={ props.characteristics }
                values={ props.newUser.characteristics.map(el => { return { label: props.characteristics[+el - 1].label, value: +el } }) }
                handleChange={ values => handleChangeUser({ 
                                                    characteristics: values.map(el => +el.value)
                                            }) }
            />
            <SimpleSelect
                label="Ваша религия"
                value={ {label: religions.find(el => el.value === props.newUser.religion), value: props.newUser.religion } }
                options={ religions }
                handleChange={ ({ value }) => handleChangeUser({ religion: value }) }
            />
            <GroupInputsRadio 
                label="Как вы относитесь к тому, что с вами в квартире могут проживать дети?"
                values={ [
                    {value: 0, name: "Нейтральное"}, 
                    {value: 1, name: "Негативное"},
                    {value: 2, name: "Положительное"},
                ] }
                value={ props.newUser.attitudeСhildren }
                handleChange={ e => handleChangeUser({ attitudeСhildren: +e.target.value }) }
                name="attitude-children"
            />
            <GroupInputsRadio 
                label="Как вы относитесь к тому, что с вами в квартире могут проживать животные?"
                values={ [
                    {value: 0, name: "Нейтральное"}, 
                    {value: 1, name: "Негативное"},
                    {value: 2, name: "Положительное"},
                ] }
                value={ props.newUser.attitudeAnimals }
                handleChange={ e => handleChangeUser({ attitudeAnimals: +e.target.value }) }
                name="attitude-animals"
            />

        </div>
    );
}
export default AboutUser;