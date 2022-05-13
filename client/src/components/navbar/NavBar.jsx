import React, { useContext } from "react";
import { Link, useLocation, useMatch, useNavigate } from "react-router-dom";
import { Context } from "../..";
import classes from "./NavBar.module.css";

const NavBar = () => {
    const { store } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const publicLinksNavBar = [{path: "/", title: "Главная"}, {path: "/login", title: "Войти"}, {path: "/registration", title: "Регистрация"}];
    const privateLinksNavBar = [{path: "/", title: "Выйти"}];

    const logout = async () => {
        await store.logout();
        navigate('/');
    }
    return (
        <nav>
            <ul className={classes.navList}>
                { store.isAuth ? 
                    <li className="nav-item"><button className="nav-link" onClick={e => logout()}>Выйти</button></li> 
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