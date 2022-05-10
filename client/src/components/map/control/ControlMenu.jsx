import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../../..";
import GroupInputsRadio from "../../UI/input/GroupInputsRadio";
import HeaderMenuLogo from "../../header/HeaderMenuLogo";
import classes from "./ControlMenu.module.css";

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