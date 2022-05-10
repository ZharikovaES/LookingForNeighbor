import React, { useContext, useEffect, useState } from "react";
import { Context } from "../..";
import HeaderMenuNav from "../../components/header/HeaderMenuNav";
import Map from "../../components/map/Map";
import classes from "./Home.module.css";
import * as yandex from 'react-yandex-maps';
import UserService from "../../API/UserService";
import ControlMenu from "../../components/map/control/ControlMenu";

const Home = () => {
    const { store } = useContext(Context);
    const [simplifiedUsers, setSimplifiedUsers ] = useState([]);
    const [ filter, setFilter ] = useState({
                                                typeContent: 0,
                                                matchByParameters: 0
                                            });
    useEffect(async () => {
        if (store.isAuth){
            const simplifiedUsers = await UserService.getSimplifiedUsers({cityId: store.location.city.idKladr, userId: store.user.id, ...filter});
            console.log(simplifiedUsers);
            setSimplifiedUsers(simplifiedUsers.map(el => { return { ...el, coordinatesPlaces: el.coordinatesPlaces}}));

        } else {
            const simplifiedUsers = await UserService.getSimplifiedUsers({cityId: store.location.city.idKladr, ...filter});
            setSimplifiedUsers(simplifiedUsers.map(el => { return { ...el, coordinatesPlaces: el.coordinatesPlaces }}));
        } 
    }, [ filter, store.isAuth ]);

    return (
        <div className={classes.containerMain}>
            <ControlMenu 
                classPosition={classes.menuLeft}
                filter={filter}
                changeFilter={value => setFilter({ ...filter, ...value }) }
            />
            <HeaderMenuNav classPosition={classes.menuRight} classHeader={classes.headerRight}/>
            <yandex.YMaps query={{load: "package.full" }}>
                <div className={classes.containerMap}>
                    <Map
                        groupItems={simplifiedUsers}
                        center={store.location.city.coordinates}
                        />
                </div>
            </yandex.YMaps>
        </div>
    );
}
export default Home;