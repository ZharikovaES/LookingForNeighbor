import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Context } from "..";
import AuthForm from "../components/forms/AuthForm";
import RegistrationForm from "../components/forms/RegistrationForm";
import DesiredApartment from "../components/profile/DesiredApartment";
import InfoUser from "../components/profile/InfoUser";
import SearchedUser from "../components/profile/SearchedUser";
import AuthenticationButton from "../components/UI/button/AuthenticationButton";

const Registration = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();
    const fromPage = location.state?.from?.pathname || '/';
    
    useEffect(() => {
        if (store.isAuth)
            navigate(fromPage);
    }, [store.isAuth]);

    const [ step, setStep ] = useState(0);
    const characteristics = [
            {
                label: "аккуратный",
                value: 1
            },
            {
                label: "имею стабильный доход",
                value: 2
            },
            {
                label: "есть автомобиль",
                value: 3
            },
            {
                label: "умею готовить",
                value: 4
            },
            {
                label: "уважаю чужие границы",
                value: 5
            },
            {
                label: "чистоплотный",
                value: 6
            },
            {
                label: "люблю слушать музыку без наушников",
                value: 7
            }
        ];
    const stageTitles = ["Заполните информацию о себе", 
                         "Заполните информацию об искомом пользователе",
                         "Заполните информацию об искомом жилье"];
                        
    const changeStep = step => {
        switch (step) {
            case 1:
                return (<InfoUser 
                            location={ store.location }
                            newUser={ store.user } 
                            characteristics={ characteristics }
                            handleLocationChange={ newProperty => {
                                store.updateLocation(newProperty);
                            } }
                            handleUserChange={ newProperty => {
                                store.updateUser(newProperty);
                            } }
                        />);
            case 2:
                return (<SearchedUser 
                            searchedUser={ store.searchedUser }
                            characteristics={ characteristics }
                            handleChange={ newProperty => {
                                store.updateSearchedUser(newProperty);
                            } }
                    />);
            case 3:
                return (<DesiredApartment 
                            location={ store.location }
                            apartment={ store.apartment }
                            currentYear={ store.currentYear }
                            handleLocationChange={ newProperty => {
                                store.updateLocation(newProperty);
                            } }
                            handleApartmentChange={ newProperty => {
                                store.updateApartment(newProperty);
                            } }

                        />);
        }
    }

    
    return (
        <div className="container-md">
            { !step ?   <AuthForm
                            title="Регистрация"
                            onSubmit={ (email, password) => {
                                if (store.checkUserRegData){
                                    store.setRegistrationProcess(true);
                                    setStep(step + 1);
                                }
                            }}
                            handleUser={ newProperty => {
                                store.updateUser(newProperty);
                            } }
                        >
                            <RegistrationForm
                                newUser={ store.user } 
                                handleChange={ newProperty => {
                                    console.log(newProperty);
                                    store.updateUser(newProperty);
                                } }
                            />
                        </AuthForm> 
            : 
            <form className="height-full" style={{position: "relative"}}>
                <h2>{ stageTitles[step] }</h2>
                <div style={{paddingBottom: "130px"}}>
                    { changeStep(step) }
                </div>
                <div className="bottom row justify-content-sm-center m-4" style={{position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 4}}>
                    <button 
                        className="btn btn-outline-primary col-sm-4 me-sm-4"
                        type="button"
                        disabled={step === 0} 
                        onClick={e => setStep(step - 1)}
                    >
                        Назад
                    </button>
                    { step === 3 ? 
                        (
                            <AuthenticationButton 
                                className="col-sm-4"
                                authenticationFunc={() => {
                                    store.registration();
                                }}
                            >
                                    Зарегистрироваться
                            </AuthenticationButton>    
                        ) : (
                            <button
                                className="btn btn-outline-primary col-sm-4"
                                type="button"
                                onClick={e => setStep(step + 1)}
                            >
                                Далее
                            </button>
                        )
                    }
                </div>
            </form>
        }
        </div>
    );
}
export default observer(Registration);