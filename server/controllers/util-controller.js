import UtilService from "../services/util-service.js";

export default class UtilController{
    static async getCities(req, res, next){
        try{
            const query = req.query;
            const cities = await UtilService.getCities(query.query);
            res.json(cities);
        } catch (error) {
            console.log(error.response);
            next(error);
        }
    }
    static async getAddresses(req, res, next){
        try{
            const query = req.query;
            const addresses = await UtilService.getAddresses(query.cityId, query.query);
            res.json(addresses);
        } catch (error) {
            next(error);
        }
    }
    static async getJobs(req, res, next){
        try{
            const query = req.query;
            const jobs = await UtilService.getJobs(query.text);
            res.json(jobs);
        } catch (error) {
            next(error);
        }

    }
    static async getUniversities(req, res, next){
        try{
            const query = req.query;
            const universities = await UtilService.getUniversities(query.countryId, query.query);
            res.json(universities);
        } catch (error) {
            next(error);
        }

    }
    static async getFaculties(req, res, next){
        try{
            const query = req.query;
            const faculties = await UtilService.getFaculties(query.universityId);
            res.json(faculties);
        } catch (error) {
            next(error);
        }

    }
    static async getChairs(req, res, next){
        try{
            const query = req.query;
            const chairs = await UtilService.getChairs(query.facultyId);
            res.json(chairs);
        } catch (error) {
            next(error);
        }
    }
}