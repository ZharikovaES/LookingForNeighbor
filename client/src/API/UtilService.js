import axios from "axios";
import { API_URL } from "../http";

export default class UtilService {

    static async getCities(params){
        let result = [];
        const response = await axios.get(API_URL + 'cities', { params });
        if (response.data) {
            const cities = response.data;
            result = cities.map(el => { return { value: el.id, label: el.name }});
        }
        return result;
    }
    static async getAddresses(params){
        let result = [];
        const response = await axios.get(API_URL + 'addresses', { params });
        if (response.data) {
            result = response.data;
            // result = addresses.map(el => { return { value: el, label: el }});
        }
        console.log(result);
        return result;
    }
    static async getJobs(params){
        let result = [];
        if (params.text.length > 1) {
            const response = await axios.get(API_URL + 'jobs', { params });
            if (response.data) {
                    const items = response.data;
                    result = items.map(el => { return { ...el, value: el.id, label: el.text }});
                    console.log(result);
            }
        }
        return result;
    }
    static async getUniversities(params){
        let result = [];
        console.log(params);
        const response = await axios.get(API_URL + 'universities', { params });

        if (response.data) {
            const universities = response.data;
            result = universities.map(el => { return { value: el.id, label: el.title }});
        }
        console.log(result);
        return result;
    }
    static async getFaculties(params){
        let result = [];
        const response = await axios.get(API_URL + 'faculties', { params });
        if (response.data) {
            const faculties = response.data;
            result = faculties.map(el => { return { value: el.id, label: el.title }});
        }
        console.log(result);
        return result;
    }
    static async getChairs(params){
        let result = [];
        const response = await axios.get(API_URL + 'chairs', { params });
        if (response.data) {
            const chairs = response.data;
            result = chairs.map(el => { return { value: el.id, label: el.title }});
        }
        console.log(result);
        return result;
    }

}