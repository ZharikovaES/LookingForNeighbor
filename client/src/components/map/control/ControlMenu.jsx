import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../../..";
import GroupInputsRadio from "../../UI/input/GroupInputsRadio";
import HeaderMenuLogo from "../../header/HeaderMenuLogo";
import classes from "./ControlMenu.module.css";
import RangeTwoValues from "../../UI/range/RangeTwoValues";
//typeOfSimilarity
const ControlMenu = props => {
    const { store } = useContext(Context);
    return (
        <div className={[props.classPosition, classes.controlMenu, "bg-light text-dark border border-2"].join(' ')}>
            <HeaderMenuLogo/>
            <aside className={classes.controlMenuAside}>
                {store.isAuth ? (
                    <div>
                        <GroupInputsRadio 
                            label="Отобразить на карте"
                            values={ [
                                {value: 0, name: "Все"},
                                {value: 1, name: "Только пользователей"},
                                {value: 2, name: "Только жилье"}
                            ] }
                            value={ props.filter.typeContent }
                            handleChange={ e => props.changeFilter({ typeContent: +e.target.value }) }
                            name="typeContent"
                        />
                        <GroupInputsRadio 
                            label="Формировать рекомендации"
                            values={ [
                                {value: 0, name: "По анкете/объявлению"},
                                {value: 1, name: "По оценкам, выставленнми пользователем"},
                            ] }
                            value={ props.filter.typeOfSimilarity }
                            handleChange={ e => props.changeFilter({ typeOfSimilarity: +e.target.value }) }
                            name="typeOfSimilarity"
                        />
                        { props.filter.typeOfSimilarity ? (
                            <p>* Для формирования рекомендаций по оценкам необходимо оценить хотя бы 5 анкет и/или объявлений...</p>
                        ) : (
                            <>
                                <GroupInputsRadio 
                                    label="Отобразить пользователей и/или жилье, у которых совпадение с анкетой"
                                    values={ [
                                        {value: 0, name: "И частичное, и полное"},
                                        {value: 1, name: "Частичное"},
                                        {value: 2, name: "Полное"}
                                    ] }
                                    value={ props.filter.matchByParameters }
                                    handleChange={ e => props.changeFilter({ matchByParameters: +e.target.value }) }
                                    name="matchByParameters"
                                />
                                { [0, 1].includes(props.filter.matchByParameters) && 
                                    (
                                        <RangeTwoValues
                                            label="Определите диапазон значений релевантности отображаемых объектов (от наименьшего до наибольшего сходства)"
                                            step={0.2}
                                            values={props.filter.relevanceRange}
                                            min={0.0}
                                            max={1.0}
                                            style={{thumb: {
                                                height: '32px',
                                                width: '32px',                        
                                            }}}
                                            hasMarks={true}
                                            handleChange={ values => props.changeFilter({ relevanceRange: values }) }
                                        />
                                    )
                                }
                            </>
                        ) }
                    </div>
                ) : (
                    <div>
                        <GroupInputsRadio 
                            label="Отобразить на карте"
                            values={ [
                                {value: 0, name: "Все"},
                                {value: 1, name: "Только пользователей"},
                                {value: 2, name: "Только жилье"}
                            ] }
                            value={ props.filter.typeContent }
                            handleChange={ e => props.changeFilter({ typeContent: +e.target.value }) }
                            name="typeContent"
                        />
                    </div>
                )}
            </aside>
        </div>
    );
}
export default observer(ControlMenu);