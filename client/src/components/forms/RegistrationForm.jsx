import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Context } from "../..";
import InfoUser from "../profile/InfoUser";
import SearchedUser from "../profile/SearchedUser";
import DesiredApartment from "../profile/DesiredApartment";
import AuthenticationButton from "../UI/button/AuthenticationButton";

const RegistrationForm = () => {
    const currentYear = new Date().getFullYear();
    const [ step, setStep ] = useState(0);
    const [ registrationData, setRegistrationData ] = useState({
                                                location: {
                                                    country: {
                                                        id: 1
                                                    },
                                                    city: {
                                                            idKladr: '0', 
                                                            name: '',
                                                            coordinates: []
                                                        },
                                                    places: [],
                                                    coordinates: []   
                                                },
                                                user: {
                                                    id: '',
                                                    username: '', 
                                                    dateOfBirth: new Date(new Date().setHours(0, 0, 0, 0)).setFullYear(new Date().getFullYear() - 18), 
                                                    gender: 0, 
                                                    image: { 
                                                        file: {}, 
                                                        imagePreviewUrl: '' 
                                                    },
                                                    email: '', 
                                                    password: '',
                                                    smoking: 0,
                                                    attitudeAlcohol: 0,
                                                    job: {
                                                        id: 0, 
                                                        name: '',
                                                        professionalRoles: []
                                                    },
                                                    education: {
                                                        university: {
                                                            id: 0,
                                                            title: ''
                                                        },
                                                        faculty: {
                                                            id: 0,
                                                            title: ''
                                                        },
                                                        chair: {
                                                            id: 0,
                                                            title: ''
                                                        }
                                                    },
                                                    characteristics: [],
                                                    religion: 1,
                                                    attitudeСhildren: 0,
                                                    attitudeAnimals: 0,    
                                                    description: ''
                                                },
                                                searchedUser: {
                                                    isBusy: 0,
                                                    gender: 0,
                                                    age: [18, 100], 
                                                    characteristics: [],
                                                    religion: 0   
                                                },
                                                apartment: {
                                                    budget: 5000,
                                                    rooms: [1],
                                                    fullArea: [0.0, 10000.0],
                                                    kitchenArea: [0.0, 10000.0],
                                                    ceilingHeight: [1.5, 10.0],
                                                    floorCount: [1, 300],
                                                    floor: [1, 300],
                                                    typeOfBathroom: 0,
                                                    view: 0,
                                                    repairs: [],
                                                    parking: [],
                                                    usability: [],
                                                    permissions: [],
                                                    housingСlass: [],
                                                    typeOfBuilding: [],
                                                    builtYear: [1700, currentYear],
                                                    hasPhoto: false
                                                }
                                            });

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

    const { store } = useContext(Context);

    const stageTitles = ["Заполните информацию о себе", 
                         "Заполните информацию об искомом пользователе",
                         "Заполните информацию об искомом жилье"];

    const handleChange = newProprty => {
        setRegistrationData({ ...registrationData, ...newProprty});
    }
    const changeStep = step => {
        switch (step) {
            case 0:
                return (<InfoUser 
                            location={ registrationData.location }
                            newUser={ registrationData.user } 
                            characteristics={ characteristics }
                            handleChange={ handleChange }
                        />);
            case 1:
                return (<SearchedUser 
                            searchedUser={ registrationData.searchedUser }
                            characteristics={ characteristics }
                            handleChange={ handleChange }
                    />);
            case 2:
                return (<DesiredApartment 
                            location={ registrationData.location }
                            apartment={ registrationData.apartment }
                            currentYear={ currentYear }
                            handleChange={ handleChange }
                        />);
        }
    }
    
    return (
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
                    { step === 2 ? 
                        (
                            <AuthenticationButton 
                                className="col-sm-4"
                                authenticationFunc={() => store.registration(registrationData)}
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
    );
}
export default observer(RegistrationForm);