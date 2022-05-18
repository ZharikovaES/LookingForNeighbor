import React, { useContext, useMemo, useState } from "react";
import { renderToString } from "react-dom/server";
import { useNavigate } from "react-router-dom";
import * as yandex from 'react-yandex-maps';
import { Context } from "../../";
import { URL } from "../../http";
import BalloonContentBody from "./balloons/BalloonContentBody";

const Map = props => {
    const navigate = useNavigate();
    const { store } = useContext(Context);
    const items = useMemo(() => {
        const result = props.groupItems.reduce((acc, group) => {
            acc.push(...group.coordinatesPlaces.map((coordinate, index) => { return {
                coordinates: coordinate.split(' '),
                place: group.labelsPlaces[index],
                item: group,
                key: coordinate + group.id,
                
            }}));
            return acc
        }, []);
        return [...result];
    }, [props.groupItems]);
    const [ymaps, setYMaps] = useState(null);
    window.openItem = userId => {
        navigate(`/users/${store.location.city.idKladr}/${userId}`)
    };

    window.addItem = userId => {
        navigate(`/chat/${store.location.city.idKladr}/${userId}`)
    };

    return (
            <yandex.Map 
                width="100%" 
                height="100%" 
                defaultState={{ center: props.center, zoom: 9, controls: [] }}
                onLoad={ymaps => setYMaps(ymaps)}
            >
                <yandex.Clusterer
                    options={{
                        preset: 'islands#invertedVioletClusterIcons',
                        groupByCoordinates: false,

                    }}
                >
                    {
                        ymaps?.templateLayoutFactory && items.map((el, i) => { 
                            return (
                            <yandex.Placemark 
                                modules={["geoObject.addon.editor", "geoObject.addon.balloon", "geoObject.addon.hint"]}
                                key={el.key} 
                                geometry={el.coordinates} 
                                properties={{
                                    clusterCaption: el.item.username + (el.item.estimatedScore ? `${el.item.estimatedScore}%` : ''),
                                    balloonContentBody: renderToString(<BalloonContentBody
                                                                            userId={el.item.id}
                                                                            username={el.item.username}
                                                                            dateOfBirth={el.item.dateOfBirth}
                                                                            imagePreviewUrl={el.item.image.imagePreviewUrl}
                                                                            gender={el.item.gender}
                                                                            address={el.place}
                                                                        />),
                                    balloonContentFooter: ` <div class="row justify-content-evenly">
                                                                <button class="col-md-5 btn btn-primary lh-sm" type="button" onclick="window.openItem('${el.item.id}')">Посмотреть анкету</button>
                                                                <button class="col-md-5 btn btn-primary lh-sm" type="button" onclick="window.addItem('${el.item.id}')">Написать</button>
                                                            </div>
                                    `
                                }}
                                options={
                                    {
                                    iconLayout: ymaps?.templateLayoutFactory.createClass(`<div class="placemark-layout-container"><div class="polygon-layout bg-purple-light border border-2 border-purple-dark text-dark"><img src='${URL}${el.item.image.imagePreviewUrl}'></div></div>`),
                                    iconShape: {
                                        type: 'Polygon',
                                        coordinates: [[[0,-58],[10,-50],[25,-50],[25,0],[-25,0],[-25,-50],[-10,-50],[0,-58]]],
                                    }
                                    }
                        }/>
                        )})
                    }
                </yandex.Clusterer>
            </yandex.Map>
    );
}  
export default Map;