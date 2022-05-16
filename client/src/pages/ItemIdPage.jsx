import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserService from "../services/UserService";
import { Rating } from 'react-simple-star-rating'
import { observer } from "mobx-react-lite";
import { Context } from "..";

const ItemIdPage = () => {
    const { store } = useContext(Context);
    const [item, setIem] = useState({realScore: 0});
    // const [rating, setRating] = useState(0);
    const params = useParams();
    useEffect(async () => {
        const data = await UserService.fetchUserByCityIdByUserId(params.cityId, params.userId, store.user.id);
        console.log(data);
        setIem({ ...data, realScore: data.realScore * 20 });
    }, []);

    return (
        <div className="container">
            { item?.location?.city?.name && item.location.city.name }
            <label>На сколько данный пользователь вам подходит? Оцентие.</label>
            <Rating
                ratingValue={item.realScore}
                onClick={(val) => {
                    console.log(val/20);
                    setIem({ ...item, realScore: val });
                    UserService.postRatingFromUser(item.location.city.idKladr, store.user.id, item.user.id, val / 20);
                }}
            />
        </div>
    );
}
export default observer(ItemIdPage);