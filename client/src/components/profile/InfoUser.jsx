import React from 'react';
import AboutUser from './AboutUser';
import AuthorizationInfoUser from './AuthorizationInfoUser';


const InfoUser = props => {
    return (
        <div>
            <AuthorizationInfoUser
                handleChange={props.handleChange}
                newUser={ props.newUser } 
            />
            <AboutUser
                handleChange={props.handleChange}
                newUser={ props.newUser } 
                location={props.location}
                characteristics={props.characteristics}
            />
        </div>
    );
}

export default InfoUser;