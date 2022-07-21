import { observer } from "mobx-react-lite";
import React from "react";
import AuthenticationButton from "../UI/button/AuthenticationButton";

const ProfileForm = () => {
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
export default observer(ProfileForm);