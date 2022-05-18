import React, { useState } from "react";
import UtilService from "../../API/UtilService";
import Checkbox from "../UI/input/Checkbox";
import GroupInputsRadio from "../UI/input/GroupInputsRadio";
import GroupRangeTwoValues from "../UI/range/GroupRangeTwoValues";
import RangeTwoValues from "../UI/range/RangeTwoValues";

import RangeValue from '../UI/range/RangeValue';
import GroupSelectLocation from "../UI/select/GroupSelectLocation";
import MultiSelectSearch from "../UI/select/MultiSelectSearch";


const DesiredApartment = props => {
    const rooms = [
        {
            label: "Студия",
            value: 1
        },
        {
            label: "1",
            value: 2
        },
        {
            label: "2",
            value: 3
        },
        {
            label: "3",
            value: 4
        },
        {
            label: "4",
            value: 5
        },
        {
            label: "5",
            value: 6
        },
        {
            label: "6",
            value: 7
        },
        {
            label: "7+",
            value: 8
        },
    ];
    const usability = [
        {
            label: "Кондиционер",
            value: 1
        },
        {
            label: "Холодильник",
            value: 2
        },
        {
            label: "Стиральная машина",
            value: 3
        },
        {
            label: "Посудомоечная машина",
            value: 4
        },
        {
            label: "Мебель",
            value: 5
        },
        {
            label: "Балкон",
            value: 6
        },

    ];
    const permissions = [
        {
            label: "Можно с детьми",
            value: 1
        },
        {
            label: "Можно с животными",
            value: 2
        }
    ];
    const housingСlasses = [
        {
            label: "Эконом",
            value: 1
        },
        {
            label: "Комфорт",
            value: 2
        },
        {
            label: "Бизнес",
            value: 3
        },
        {
            label: "Элитное",
            value: 4
        },
    ];
    const repairs = [
        {
            label: "нет",
            value: 1
        },
        {
            label: "косметический",
            value: 2
        },
        {
            label: "евроремонт",
            value: 3
        },
        {
            label: "дизайнерский",
            value: 4
        }
    ];
    const typesOfBuilding = [
        {
            label: "нет",
            value: 1
        },
        {
            label: "кирпичный",
            value: 2
        },
        {
            label: "монолитный",
            value: 3
        },
        {
            label: "панельный",
            value: 4
        },
        {
            label: "блочный",
            value: 5
        },
        {
            label: "деревянный",
            value: 6
        },
        {
            label: "железобетонный",
            value: 7
        },

    ];
    const parking = [
        {
            label: "закрытая",
            value: 1
        },
        {
            label: "подземная",
            value: 2
        },
        {
            label: "открытая",
            value: 3
        },
    ];
    const [limitsOfArea, setLimitsOfArea] = useState([
        [0.0, 10000.0],
        [0.0, props.apartment.fullArea[1]]
    ]);
    const [limitsOfFloorCount, setLimitsOfFloorCount] = useState([
        [1, 300],
        [1, props.apartment.floorCount[1]]
    ]);
    const budget = { min: 5000, max: 300000 };
    const ceilingHeight = { min: 1.5, max: 10.0 };
    const builtYear = { min: 1700, max: props.currentYear };

    return (
        <div>
            <GroupSelectLocation
                items={ props.location.places }
                cityId={ props.location.city.idKladr }
                placeholder="Не важно"
                getData={ UtilService.getAddresses }
                handleChange={ items => props.handleChange({ location: {...props.location, places: items } }) }
            />
            <RangeValue
                label="Сколько вы готовы тратить ежемесячно на аренду жилья?"
                step={1}
                min={budget.min}
                max={budget.max}
                value={props.apartment.budget}
                handleChange={ value => props.handleChange({ apartment: {...props.apartment, budget: value } }) }
            />
            <MultiSelectSearch
                label="Количество комнат"
                placeholder="Не важно"
                options={ rooms }
                values={ props.apartment.rooms.map(el => { return { label: rooms[+el - 1].label, value: +el }}) }
                handleChange={ values => props.handleChange({ apartment: {...props.apartment, 
                                        rooms: [...values.map(el => +el.value)]
                                }}) }
            />
            <GroupRangeTwoValues
                label="Площадь"
                labels={["Общая площадь", "Площадь кухни"]}
                steps={[0.1, 0.1]}
                limits={limitsOfArea}
                values={[
                    props.apartment.fullArea,
                    props.apartment.kitchenArea
                ]}
                handleChange = {(values, limits) => {
                    props.handleChange({ apartment: {...props.apartment, fullArea: values[0], kitchenArea: values[1] } });
                    setLimitsOfArea(limits);
                }}
            />
            <RangeTwoValues
                label="Высота потолков"
                step={0.1}
                min={ ceilingHeight.min }
                max={ ceilingHeight.max }
                values={props.apartment.ceilingHeight}
                style={{thumb: {
                    height: '42px',
                    width: '42px',                        
                }}}
                handleChange={ values => {
                    props.handleChange({ apartment: {...props.apartment, ceilingHeight: values } });
                }}
            />
            <GroupRangeTwoValues
                label="Этажи"
                labels={["Этажность дома", "Этаж"]}
                steps={[1, 1]}
                limits={ limitsOfFloorCount }
                values={[
                    props.apartment.floorCount,
                    props.apartment.floor
                ]}
                handleChange = {(values, limits) => {
                    props.handleChange({ apartment: {...props.apartment, floorCount: values[0], floor: values[1] }});
                    setLimitsOfFloorCount(limits);
                }}
            />
            <GroupInputsRadio
                label="Тип санузла"
                values={ [
                    {value: 0, name: "Не важно"}, 
                    {value: 1, name: "Совместный"}, 
                    {value: 2, name: "Раздельный"}
                ] }
                value={ props.apartment.typeOfBathroom }
                handleChange={ e => props.handleChange({ apartment: {...props.apartment, typeOfBathroom: +e.target.value }}) }
                name="bathroom"
            />
            <GroupInputsRadio
                label="Вид из окна"
                values={ [
                    {value: 0, name: "Не важно"}, 
                    {value: 1, name: "Во двор"}, 
                    {value: 2, name: "На улицу"}
                ] }
                value={ props.apartment.view }
                handleChange={ e => props.handleChange({ apartment: {...props.apartment, view: +e.target.value }}) }
                name="view"
            />
            <MultiSelectSearch
                label="Ремонт"
                placeholder="Не важно"
                options={ repairs }
                values={ props.apartment.repairs.map(el => { return { label: repairs[+el - 1].label, value: +el }}) }
                handleChange={ values => props.handleChange({ apartment: {...props.apartment, 
                        repairs: [...values.map(el => el.value)]
                                }}) }
            />
            <MultiSelectSearch
                label="Парковка"
                placeholder="Не важно"
                options={ parking }
                values={ props.apartment.parking.map(el => { return { label: parking[+el - 1].label, value: +el }}) }
                handleChange={ values => props.handleChange({ apartment: {...props.apartment, 
                        parking: [...values.map(el => el.value)]
                                }}) }
            />
            <MultiSelectSearch
                label="Выберите удобства, которые обязательно должны присутствовать в жилье"
                placeholder="Не важно"
                options={ usability }
                values={ props.apartment.usability.map(el => { return { label: usability[+el - 1].label, value: +el }}) }
                handleChange={ values => props.handleChange({ apartment: {...props.apartment, 
                                    usability: [...values.map(el => el.value)]
                                }}) }
            />
            <MultiSelectSearch
                label="Дети и животные"
                placeholder="Не важно"
                options={ permissions }
                values={ props.apartment.permissions.map(el => { return { label: permissions[+el - 1].label, value: +el }}) }
                handleChange={ values => props.handleChange({ apartment: {...props.apartment, 
                                    permissions: [...values.map(el => el.value)]
                                }}) }
            />
            <MultiSelectSearch
                label="Класс жилья"
                placeholder="Не важно"
                options={ housingСlasses }
                values={ props.apartment.housingСlass.map(el => { return { label: housingСlasses[+el - 1].label, value: +el }}) }
                handleChange={ values => props.handleChange({ apartment: {...props.apartment, 
                                    housingСlass: [...values.map(el => el.value)]
                                }}) }
            />
            <MultiSelectSearch
                label="Тип дома"
                placeholder="Не важно"
                options={ typesOfBuilding }
                values={ props.apartment.typeOfBuilding.map(el => { return { label: typesOfBuilding[+el - 1].label, value: +el }}) }
                handleChange={ values => props.handleChange({ apartment: {...props.apartment, 
                                    typeOfBuilding: [...values.map(el => el.value)]
                                }}) }
            />
            <RangeTwoValues
                label="Год постройки дома"
                step={1}
                min={ builtYear.min }
                max={ builtYear.max }
                values={props.apartment.builtYear}
                style={{thumb: {
                    height: '42px',
                    width: '42px',                        
                }}}
                handleChange={ values => {
                    props.handleChange({ apartment: {...props.apartment, builtYear: values } });
                }}
            />
            <Checkbox
                label="Подбирать объявления только с фото"
                checked={props.apartment.hasPhoto}
                id="photo-exists"
                handleChange={ value => {
                    props.handleChange({ apartment: {...props.apartment, hasPhoto: value } });
                }}
            />

        </div>
    );
}

export default DesiredApartment;