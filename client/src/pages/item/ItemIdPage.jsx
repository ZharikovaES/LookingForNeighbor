import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserService from "../../services/UserService";
import { Rating } from 'react-simple-star-rating'
import { observer } from "mobx-react-lite";
import { URL } from "../../http";
import classes from "./ItemPage.module.css";
import { Context } from "../..";
import defaultImage from "../../assets/img/profile-default.png"
import MultiRating from "../../components/UI/rating/MultiRating";

const ItemIdPage = () => {
    const { store } = useContext(Context);
    const [item, setIem] = useState({ realScore: [0, 0, 0, 0, 0, 0, 0, 0] });
    // const [rating, setRating] = useState(0);
    const params = useParams();
    useEffect(async () => {
        const data = await UserService.fetchUserByCityIdByUserId(params.cityId, params.userId, store.user.id);
        console.log(data);
        setIem({ ...data, realScore: data.realScore.map(el => el * 20) });
    }, []);
    const labelsRatingUser = [
        "По вредным привычкам",
        "По профессии",
        "По образованию",
        "По указанным характеристикам и религиозным предпочтения",
        "По отношению к детям и к животным",
        "По доступному бюджету",
        "По указанным характеристикам искомой квартиры",
        "По указанным характеристикам дома, в которой должна находиться искомая квартира"
    ];
    const handleChange = (val, index) => {
        const realScore = item.realScore;
        realScore[index] = val;
        setIem({ ...item, realScore: [...realScore] });
        UserService.postRatingFromUser(item.location.city.idKladr, store.user.id, item.user.id, val / 20, index);
    }

    return (
        <div className="container">
            <MultiRating
                label="На сколько данный пользователь вам подходит? Оцените."
                labels={labelsRatingUser}
                values={item.realScore}
                handleChange={handleChange}
            />
            {item?.user && item?.apartment &&
            <table>
                <tbody>
                <tr><td><img className={["border border-2", classes.previewImg].join(' ')} src={ item?.user?.image?.imagePreviewUrl ? `${URL}/${item.user.id}/images-avatar/${item.user.image.imagePreviewUrl}` : defaultImage} alt="" /></td><td><strong>Информация о пользователе:</strong></td></tr>
                <tr><td>Имя пользователя:</td><td>{item.user.username}</td></tr>
                <tr><td>Идентификатор:</td><td>{item.user.id}</td></tr>
                <tr><td>Дата роджения:</td><td>{item.user.dateOfBirth}</td></tr>
                <tr><td>Пол:</td><td>{item.user.gender}</td></tr>
                <tr><td>Пользователь курит?</td><td>{item.user.smoking ? 'Да' : 'Нет'}</td></tr>
                <tr><td>Отношение к алкоголю:</td><td>{item.user.attitudeAlcohol ? 'Позитивное' : 'Негативное'}</td></tr>
                <tr><td>Профессия:</td><td>{item.user.job.name}</td></tr>
                <tr><td>Университет:</td><td>{item.user.education.university.tittle}</td></tr>
                <tr><td>Факультет:</td><td>{item.user.education.faculty.tittle}</td></tr>
                <tr><td>Кафедра:</td><td>{item.user.education.chair.tittle}</td></tr>
                <tr><td>Религия:</td><td>{item.user.religion}</td></tr>
                <tr><td>Отношение к детям:</td><td>{item.user.attitudeСhildren ? 'Позитивное' : 'Негативное'}</td></tr>
                <tr><td>Отношение к животным:</td><td>{item.user.attitudeAnimals ? 'Позитивное' : 'Негативное'}</td></tr>
                <tr><td>Характеристики:</td><td>{item.user.characteristics.join(', ')}</td></tr>
                <tr><td>О себе:</td><td>{item.user.description}</td></tr>
                <tr><td><strong>Ищет квартиру:</strong></td></tr>
                <tr><td>Не дороже:</td><td>{item.apartment.budget}</td></tr>
                <tr><td>Количество комнат:</td><td>{item.apartment.rooms.join(', ')}</td></tr>
                <tr><td>С общей площадью:</td><td>от {item.apartment.fullArea[0]}</td><td>до {item.apartment.fullArea[1]}</td></tr>
                <tr><td>С площадью кухни:</td><td>от {item.apartment.kitchenArea[0]}</td><td>до {item.apartment.kitchenArea[1]}</td></tr>
                <tr><td>С высотой потолков:</td><td>от {item.apartment.ceilingHeight[0]}</td><td>до {item.apartment.ceilingHeight[1]}</td></tr>
                <tr><td>В доме высотой:</td><td>от {item.apartment.floorCount[0]}</td><td>до {item.apartment.floorCount[1]} этажей</td></tr>
                <tr><td>На этаже:</td><td>от {item.apartment.floor[0]}</td><td>до {item.apartment.floor[1]}</td></tr>
                <tr><td>С санузлом:</td><td>{item.apartment.typeOfBathroom ? 'раздельным' : 'совмещённым'}</td></tr>
                <tr><td>С видом из окна:</td><td>{item.apartment.view ? 'во двор' : 'на улицу'}</td></tr>
                <tr><td>С ренмонтом:</td><td>{item.apartment.repairs.join(', ')}</td></tr>
                <tr><td>С парковкой:</td><td>{item.apartment.parking.join(', ')}</td></tr>
                <tr><td>С удобствами:</td><td>{item.apartment.usability.join(', ')}</td></tr>
                <tr><td>С разрешениями:</td><td>{item.apartment.permissions.join(', ')}</td></tr>
                <tr><td>Дом класса:</td><td>{item.apartment.housingСlass.join(', ')}</td></tr>
                <tr><td>Дом типа:</td><td>{item.apartment.typeOfBuilding.join(', ')}</td></tr>
                <tr><td>Дом построен:</td><td>от {item.apartment.builtYear[0]}</td><td>до {item.apartment.builtYear[1]}</td></tr>
                <tr><td>Обязательно с фото?</td><td>{item.apartment.hasPhoto ? 'Да' : 'Нет'}</td></tr>
                </tbody>
            </table>
}
        </div>
    );
}
export default observer(ItemIdPage);