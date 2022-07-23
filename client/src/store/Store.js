import axios from 'axios';
import { makeAutoObservable, toJS } from 'mobx';

import { API_URL } from '../http';
import AuthService from "../services/AuthService";

export default class Store{
    isAuth = false;
    isLoading = false;
    isRegistrationProcess = false;
    currentYear = new Date().getFullYear();
    _location = {
        country: {
            id: 1
        },
        city: {
                idKladr: '7700000000000', 
                name: 'Москва',
                coordinates: [55.75, 37.57]
            },
        places: [],
        coordinates: []   
    };
    _user = {
        id: '',
        typeAuth: 0,
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
    };
    _searchedUser = {
        isBusy: 0,
        gender: 0,
        age: [18, 100], 
        characteristics: [],
        religion: 0,
        hasPhoto: false
    };
    _apartment = {
        budget: [5000],
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
        builtYear: [1700, this.currentYear],
        hasPhoto: false
    };
    constructor(){
        makeAutoObservable(this, {}, { deep: true });
        this.setLoading(true);
        // this.store = !!localStorage.getItem('token');
    }
    setAuth(isAuth){
        this.isAuth = isAuth;
    }
    setRegistrationProcess(isRegistrationProcess){
        this.isRegistrationProcess = isRegistrationProcess;
        if (!isRegistrationProcess) this.clearRegistrationData();
    }
    updateUser(data){
        this.user = { ...this.user, ...data };
    }
    updateLocation(data){
        this.location = { ...this.location, ...data };
    }
    updateSearchedUser(data){
        this.searchedUser = { ...this.searchedUser, ...data };
    }
    updateApartment(data){
        this.apartment = { ...this.apartment, ...data };
    }
    get checkUserRegData () {
        return this.user.email && this.user.password && !this.user.typeAuth;
    }
    setLoading(isLoading){
        this.isLoading = isLoading;
    }
    get checkDataOfUser(){
        return this.isAuth && this.user && this.apartment;
    }
    get location() {
        return toJS(this._location);
    }
    get user() {
        return toJS(this._user);
    }
    get searchedUser() {
        return toJS(this._searchedUser);
    }
    get apartment() {
        return toJS(this._apartment);
    }
    set location(newValue) {
        this._location = newValue;
    }
    set user(newValue) {
        this._user = newValue;
    }
    set searchedUser(newValue) {
        this._searchedUser = newValue;
    }
    set apartment(newValue) {
        this._apartment = newValue;
    }
    async registration(){
        this.setLoading(true);
        try {
            const response = await AuthService.registration({ 
                                                                location: this.location,
                                                                user: this.user,
                                                                searchedUser: this.searchedUser,
                                                                apartment: this.apartment,
                                                            });
            localStorage.setItem('token', response.data?.accessToken);
            this.location = response.data.location;
            this.user = response.data.user;
            this.searchedUser = response.data.searchedUser;
            this.apartment = response.data.apartment;
            // this.setRegistrationProcess(false);
            console.log("finish");
            this.setAuth(true);
        } catch (error) {
            if (error.response)
                console.log(error.response.data.message);
            else console.log(error);
        } finally {
            this.setLoading(false);
        }
    }
    authenticationBySocial(data) {
        this.setLoading(true);
        try {
            if (data.isAuth) {
                localStorage.setItem('token', data.accessToken);
                this.location = data.location;
                this.user = data.user;
                this.searchedUser = data.searchedUser;
                this.apartment = data.apartment;
                this.setAuth(true);
            } else {
                this.setRegistrationProcess(true);
                this.setUser({ ...this.user, email: data.user?.email, username: data.user?.name});
            }
        } catch (error) {
            if (error.response)
                console.log(error.response.data.message);
            else console.log(error);
        } finally {
            this.setLoading(false);
        }
    }
    async authenticationByVK(data) {
        this.setLoading(true);
        try {
            const response = await AuthService.authenticationByVK(data);
            if (response.data.isAuth) {
                localStorage.setItem('token', response.data.accessToken);
                this.location = response.data.location;
                this.user = response.data.user;
                this.searchedUser = response.data.searchedUser;
                this.apartment = response.data.apartment;
                this.setAuth(true);
            } else {
                this.setRegistrationProcess(true);
                this.setUser({ ...this.user, email: response.data.user?.email, username: response.data.user?.name});
            }
        } catch (error) {
            if (error.response)
                console.log(error.response.data.message);
            else console.log(error);
        } finally {
            this.setLoading(false);
        }
    }

    async login(email, password){
        this.setLoading(true);
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem('token', response.data.accessToken);
            this.location = response.data.location;
            this.user = response.data.user;
            this.searchedUser = response.data.searchedUser;
            this.apartment = response.data.apartment;
            this.setAuth(true);
            
        } catch (error) {
            if (error.response)
                console.log(error.response.data.message);
            else console.log(error);
        } finally {
            this.setLoading(false);
        }
    }
    clearRegistrationData(){
        this.user = {
            id: '',
            typeAuth: 0,
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
        };
        this.searchedUser = {
            isBusy: 0,
            gender: 0,
            age: [18, 100], 
            characteristics: [],
            religion: 0,
            hasPhoto: false
        };
        this.apartment = {
            budget: [5000],
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
            builtYear: [1700, this.currentYear],
            hasPhoto: false        
        };
        this.location = {
            country: {
                id: 1
            },
            city: {
                    idKladr: '7700000000000', 
                    name: 'Москва',
                    coordinates: [55.75, 37.57]
                },
            places: [],
            coordinates: []   
        };
    }
    async logout(){
        this.setLoading(true);
        try {
            await AuthService.logout({ cityId: this.location.city.idKladr, userId: this.user.id });
            localStorage.removeItem('token');
            this.clearRegistrationData();
            this.setAuth(false);
            localStorage.removeItem('token')

        } catch (error) {
            if (error.response)
                console.log(error.response.data.message);
            else console.log(error);
        } finally{
            this.setLoading(false);
        }
    }
    async checkAuth(){
        this.setLoading(true);
        try {
            const response = await axios.get(API_URL + 'refresh', { withCredentials: true });
            localStorage.setItem('token', response.data.accessToken);
            this.location = response.data.location;
            this.user = response.data.user;
            this.searchedUser = response.data.searchedUser;
            this.apartment = response.data.apartment;
            this.setAuth(true);
            return this.isAuth;
        } catch (error){
            if (error.response)
                console.log(error.response.data.message);
            else console.log(error);
            return false;
        } finally {
            this.setLoading(false);
        }
    }
}