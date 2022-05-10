import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserService from "../services/UserService";

const ItemIdPage = () => {
    const [item, setIem] = useState({});
    const params = useParams();
    useEffect(async () => {
        const data = await UserService.fetchUserByCityIdByUserId(params.cityId, params.userId);
        console.log(data);
        setIem({ ...data });
    }, []);

    return (
        <div className="container">
            { item?.location?.city?.name && item.location.city.name }
        </div>
    );
}
export default ItemIdPage;