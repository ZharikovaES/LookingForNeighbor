import { validationResult } from "express-validator";
import ApiError from "../exceptions/ApiError.js";
import FileService from "../service/file-service.js";
import UserService from "../service/user-service.js";
import Joi from 'joi'

export default class UserController {
    static schemaRegistration = Joi.object({
        location: {
            country: {
                id: Joi.number()
                        .min(1)
                        .required()
            },
            city: {
                idKladr: Joi.string()
                            .pattern(/^[0-9]+$/, { name: 'numbers'})
                            .min(5)
                            .required(),
                name: Joi.string()
                            .pattern(/^[А-Яа-яA-Za-z\s-]+$/, { name: 'not numbers' })
                            .min(2)
                            .required(),
            },
            places: Joi.array().min(0).items({
                                                label: Joi.string(),
                                                value: Joi.string()
            }).required(),
            coordinates: Joi.array().min(0).max(2).items(Joi.number()).required()
        },
        user:{
            id: Joi.any(),
            username: Joi.string()
                            .pattern(/^[А-Яа-яA-Za-z]+$/, { name: 'letters' })
                            .min(3)
                            .max(30)
                            .required(),
            dateOfBirth: Joi.date()
                            .max(new Date(new Date().setHours(0, 0, 0, 0)).setFullYear(new Date().getFullYear() - 18))
                            .required(),
            gender: Joi.number()
                        .integer()
                        .min(0)
                        .max(1)
                        .required(),
            email: Joi.string()
                        .email()
                        .required(),
            password: Joi.string()
                            .pattern(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/, { name: 'letters and numbers' })
                            .min(5)
                            .max(15)
                            .required(),
            image: {
                file: Joi.object().required(),
                imagePreviewUrl: Joi.string().min(0).required()
            },
            smoking: Joi.number()
                        .integer()
                        .min(0)
                        .max(2)
                        .required(),
            attitudeAlcohol: Joi.number()
                                .integer()
                                .min(0)
                                .max(2)
                                .required(),
            job: {
                id: Joi.number()
                        .integer()
                        .min(0)
                        .required(),
                name: Joi.string()
                        .min(0)
                        .required(),
                professionalRoles: Joi.array().min(0).items({
                    id: Joi.number().integer().min(0).required(),
                    name: Joi.string().required()
                }).required(),
            },
            education: {
                university: {
                    id: Joi.number()
                            .integer()
                            .min(0)
                            .required(),
                    title: Joi.string()
                            .min(0)
                            .required(),
                },
                faculty: {
                    id: Joi.number()
                            .integer()
                            .min(0)
                            .required(),
                    title: Joi.string()
                            .min(0)
                            .required(),
                },
                chair: {
                    id: Joi.number()
                            .integer()
                            .min(0)
                            .required(),
                    title: Joi.string()
                            .min(0)
                            .required(),
                }
            },
            characteristics: Joi.array()
                                .min(0)
                                .max(7)
                                .items(Joi.number().integer().min(1).max(7))
                                .required(),
            religion: Joi.number()
                            .integer()
                            .min(1)
                            .max(5)
                            .required(),  
            attitudeСhildren: Joi.number()
                                    .integer()
                                    .min(0)
                                    .max(2)
                                    .required(),     
            attitudeAnimals: Joi.number()
                                    .integer()
                                    .min(0)
                                    .max(2)
                                    .required(),
            description: Joi.string()
                                .min(0)
                                .max(400)
                                .required()              
        },
        searchedUser: {
            isBusy: Joi.number()
                        .integer()
                        .min(0)
                        .max(2)
                        .required(),
            gender: Joi.number()
                        .integer()
                        .min(0)
                        .max(2)
                        .required(),
            age: Joi.array()
                    .length(2)
                    .items(Joi.number()
                                .integer()
                                .min(18)
                                .max(100))
                    .required(),
            characteristics: Joi.array()
                                .min(0)
                                .max(7)
                                .items(Joi.number().integer().min(1).max(7))
                                .required(),
            religion: Joi.number()
                            .integer()
                            .min(0)
                            .max(1)
                            .required(),
            hasPhoto: Joi.boolean()
                            .required()
        },
        apartment: {
            budget: Joi.number()
                        .integer()
                        .min(5000)
                        .max(300000)
                        .required(),
            rooms: Joi.array()
                        .min(0)
                        .max(8)
                        .items(Joi.number().integer().min(1).max(8))
                        .required(),
            fullArea: Joi.array()
                            .length(2)
                            .items(Joi.number()
                                        .min(0.0)
                                        .max(10000.0))
                            .required(),
            kitchenArea: Joi.array()
                            .length(2)
                            .items(Joi.number()
                                        .min(0.0)
                                        .max(10000.0))
                            .required(),
            ceilingHeight: Joi.array()
                            .length(2)
                            .items(Joi.number()
                                        .min(1.5)
                                        .max(10.0))
                            .required(),
            floorCount: Joi.array()
                            .length(2)
                            .items(Joi.number()
                                        .integer()
                                        .min(1)
                                        .max(300))
                            .required(),
            floor: Joi.array()
                            .length(2)
                            .items(Joi.number()
                                        .integer()
                                        .min(1)
                                        .max(300))
                            .required(),
            typeOfBathroom: Joi.number()
                                .integer()
                                .min(0)
                                .max(2)
                                .required(),
            view: Joi.number()
                        .integer()
                        .min(0)
                        .max(2)
                        .required(),
            repairs: Joi.array()
                        .min(0)
                        .max(4)
                        .items(Joi.number().integer().min(1).max(4))
                        .required(),
            parking: Joi.array()
                        .min(0)
                        .max(3)
                        .items(Joi.number().integer().min(1).max(3))
                        .required(),
            usability: Joi.array()
                            .min(0)
                            .max(6)
                            .items(Joi.number().integer().min(1).max(6))
                            .required(),
            permissions: Joi.array()
                            .min(0)
                            .max(2)
                            .items(Joi.number().integer().min(1).max(2))
                            .required(),
            housingСlass: Joi.array()
                                .min(0)
                                .max(4)
                                .items(Joi.number().integer().min(1).max(4))
                                .required(),
            typeOfBuilding: Joi.array()
                                .min(0)
                                .max(7)
                                .items(Joi.number().integer().min(1).max(7))
                                .required(),
            builtYear: Joi.array()
                            .length(2)
                            .items(Joi.number()
                                        .integer()
                                        .min(1700)
                                        .max(new Date().getFullYear()))
                            .required(),
            hasPhoto: Joi.boolean()
                            .required()
        },
    });
    static async postNewRating(req, res, next){
        try {
            const data = req.body;
            await UserService.pushNewRatingToUser(data);
            res.status(200);
        } catch (error) {
            next(error);
        }
    }
    static async registration(req, res, next) {
        try {
            const formData = req.files;
            const data = JSON.parse(formData.newUser.data.toString());
            UserController.schemaRegistration.validate(data);
            if (formData.imageUser)
                formData.imageUser.name = data.user.image.imagePreviewUrl = Date.now() + "-" + formData.imageUser.name.replace(/\s+/gi, "-");
            // if (!errors.isEmpty()) throw ApiError.BadRequest('Ошибка при валидации', errors.array());
            const result = await UserService.registration(data);

            console.log(result);
            // console.log(result.user.id, formData.imageUser);
            if (result.user.id && formData.imageUser) await FileService.uploadFile(result.user.id, formData.imageUser);

            res.cookie('refreshToken', result.refreshToken, { maxAge: 30 * 24* 3600, httpOnly: true });
            // delete result.refreshToken;
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await UserService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24* 3600, httpOnly: true });
            delete userData.refreshToken;
            res.status(200).json(userData);
        } catch (error) {
            next(error);
        }
    }
    static async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const { cityId, userId } = req.body;
            const result = await UserService.logout(cityId, userId);
            res.clearCookie('refreshToken');
            res.json(result);
        } catch (error) {
            next(error);

        }
    }
    static async activate(req, res, next) {
        try {
            const city = req.params.city;
            const activationLink = req.params.link;
            await UserService.activate(city, activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (error) {
            next(error);
        }
    }
    static async refresh(req, res, next) {
        try {
            console.log("refresh:");
            const { refreshToken } = req.cookies;
            const result = await UserService.refresh(refreshToken);
            console.log(result);
            res.cookie('refreshToken', result.refreshToken, { maxAge: 30 * 24* 3600, httpOnly: true });
            delete result.refreshToken;
            res.status(201).json(result);
        } catch (error) {
            next(error);

        }
    }
    static async getSimplifiedInformationUsers(req, res, next){
        try{
            const query = req.query;
            let users = [];
            console.log(query.typeOfRating);
            if (query) 
                if (query.userId) users = await UserService.getSimplifiedUsersByCityIdByUserIdByLimit(query.cityId, query.userId, parseInt(query.typeContent ?? 0), parseInt(query.typeOfSimilarity ?? 0), parseInt(query.matchByParameters ?? 0), query.relevanceRange.map(el => parseFloat(el)), parseInt(query.typeOfRating ?? 0), query.scoreRange ?? [1.0, 5.0], query.limit);
                else users = await UserService.getSimplifiedUsersByCityIdByLimit(query.cityId, parseInt(query.typeContent ?? 0), query.limit);
            res.json(users);    
        } catch (error){
            next(error);
        }
    }
    static async getUserById(req, res, next){
        try{
            const cityId = req.params.cityId;
            const userId = req.params.userId;
            const currentUserId = req.params.currentUserId;
            let result = {};
            if (cityId && userId && currentUserId) result = await UserService.getUserByCityIdByUserId(cityId, userId, currentUserId);
            else result = {};
            console.log(result);
            res.json(result);    
        } catch (error){
            next(error);
        }
    }
    // static async getSimplifiedInformationUsersByUserId(req, res, next){
    //     try{
    //         const query = req.query;
    //         let users = [];
    //         console.log(query);
    //         if (query) users = await UserService.getSimplifiedUsersByCityIdByUserIdByLimit(query.id, parseInt(query.typeContent), parseInt(query.matchByParameters ?? 0), query.limit);
    //         res.json(users);    
    //     } catch (error){
    //         next(error);
    //     }
    // }
    static async getUsers(req, res, next) {
        try{
            const query = req.query;
            let users = [];
            if (query) users = await UserService.getUsersByCityIdByLimit(query.id, query.limit);
            res.json(users);    
        } catch (error){
            next(error);
        }
    
    }
}

