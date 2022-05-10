import React from "react";
import logo from "../../assets/img/logo.svg";
import classes from "./HeaderMenu.module.css";

const HeaderMenuLogo = props => {
    return (
        <header>
            <a href="/">
                <div className={classes.headerWrapper}>
                    <div className={classes.headerLogo}>
                        <img src={logo} alt="Ищу соседа" />
                    </div>
                    <h1 className={classes.headerTitle} >Ищу соседа!</h1>
                </div>
            </a>
        </header>
    );
}
export default HeaderMenuLogo;