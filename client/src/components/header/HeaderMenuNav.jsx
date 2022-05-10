import React from "react";
import NavBar from "../navbar/NavBar";
import classes from "./HeaderMenu.module.css";

const HeaderMenuNav = props => {
    return (
        <header className={[props.classPosition, props.classHeader, classes.headerNavList, "bg-light text-dark border border-2"].join(' ')}>
            <div className="header__wrapper">
                <NavBar/>
            </div>
        </header>
    );
}
export default HeaderMenuNav;