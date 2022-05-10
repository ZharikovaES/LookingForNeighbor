import React, { useRef } from 'react';
import classes from './BalloonContentBody.module.css'

const BalloonContentFooter = ({userId, navigate}) => {
    // const refUser = useRef(null);
    // refUser && refUser.addEventListener('click', e => {
    //     console.log(2);
    // })

    return (
        <div className={[classes.partialInfoControl, 'row justify-content-evenly'].join(' ')}>
            <button className={[classes.infoControlLinkItem, 'col-md-5 btn btn-primary lh-sm'].join(' ')} type="button" onclick="window.openDescription('index');">Посмотреть анкету</button>
            {/* <button className="infoControlLinkItem"></button> */}
            <button className={[classes.infoControlBtnAdd, 'col-md-5 btn btn-primary lh-sm'].join(' ')} type="button" onClick={() => navigate(`/users/${userId}`)}>Добавить в избранное</button>
        </div>
    );
}
export default BalloonContentFooter;