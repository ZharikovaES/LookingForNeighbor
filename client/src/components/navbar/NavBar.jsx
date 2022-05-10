import React, { useContext } from "react";
import { Link, useLocation, useMatch } from "react-router-dom";
import { Context } from "../..";
import classes from "./NavBar.module.css";

const NavBar = () => {
    const { store } = useContext(Context);
    const location = useLocation();
    const publicLinksNavBar = [{path: "/", title: "Главная"}, {path: "/login", title: "Войти"}, {path: "/registration", title: "Регистрация"}];
    const privateLinksNavBar = [{path: "/", title: "Выйти"}];
    return (
        <nav>
            <ul className={classes.navList}>
                { store.isAuth ? 
                    <li className="nav-item"><Link className="nav-link" to="/" onClick={e => store.logout()}>Выйти</Link></li> 
                    :
                    publicLinksNavBar.map(el => location.pathname === el.path || (
                        <li className="nav-item" key={el.path}><Link className="nav-link" to={el.path}>{ el.title }</Link></li>
                    ))
                }
            </ul>
        </nav>
    );
}
export default NavBar;