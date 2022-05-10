import axios from 'axios';
import { makeAutoObservable } from 'mobx';
import { API_URL } from '../http';
import AuthService from "../services/AuthService";

export default class Store{
    isAuth = false;
    isLoading = false;
    constructor(){
        makeAutoObservable(this);
        // this.store = !!localStorage.getItem('token');
        this.setLocation({
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
        });
    }
    setAuth(isAuth){
        this.isAuth = isAuth;
    }
    setLocation(location){
        this.location = location;
    }
    setUser(user){
        this.user = user;
    }
    setSearchedUser(searchedUser){
        this.searchedUser = searchedUser;
    }
    setApartment(apartment){
        this.apartment = apartment;
    }
    setLoading(isLoading){
        this.isLoading = isLoading;
    }
    checkDataOfUser(){
        return this.isAuth && this.user && this.apartment;
    }
    async registration(data){
        this.setLoading(true);
        try {
            console.log(data);
            const response = await AuthService.registration(data);
            localStorage.setItem('token', response.data.accessToken);
            this.setLocation(response.data.location);
            this.setUser(response.data.user);
            this.setSearchedUser(response.data.searchedUser);
            this.setApartment(response.data.apartment);
            this.setAuth(true);
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
            console.log(response.data);
            localStorage.setItem('token', response.data.accessToken);
            this.setLocation(response.data.location);
            this.setUser(response.data.user);
            this.setSearchedUser(response.data.searchedUser);
            this.setApartment(response.data.apartment);
            this.setAuth(true);
            
        } catch (error) {
            if (error.response)
                console.log(error.response.data.message);
            else console.log(error);
        } finally {
            this.setLoading(false);
        }
    }
    async logout(){
        this.setLoading(true);
        try {
            await AuthService.logout({ cityId: this.location.city.idKladr, userId: this.user.id });
            localStorage.removeItem('token');
            this.setUser({});
            this.setSearchedUser({});
            this.setApartment({});
            this.setLocation({
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
            });
            localStorage.removeItem('token')
            this.setAuth(false);

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
            this.setAuth(true);
            this.setLocation(response.data.location);
            this.setUser(response.data.user);
            this.setSearchedUser(response.data.searchedUser);
            this.setApartment(response.data.apartment);
            console.log(response.data);
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