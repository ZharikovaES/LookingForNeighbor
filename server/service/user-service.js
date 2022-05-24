import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import userModel from "../models/user.js";
import MailService from "./mail-service.js";
import TokenService from "./token-service.js";
import ApiError from "../exceptions/ApiError.js";
import ConvertService from "./convert-service.js";
import RelevanceByRatingService from "./relevancy-by-ratings-service.js";

export default class UserService{
    static async registration(data){
        const candidate = await userModel.findByCityIdByEmail(data.location.city.idKladr, data.user.email);
        if (candidate) throw ApiError.BadRequest(`Пользователь с электронным адресом ${data.user.email} уже существует`);
        data.user.password = await bcrypt.hash(data.user.password, 4);
        data.user.activationLink = uuidv4();
        const records = await userModel.create(data.location, data.user, data.searchedUser, data.apartment);
        const { location, user, searchedUser, apartment } = ConvertService.convertDataDbObjToClientObj(records);
        // delete user.password;
        // delete user.accessToken;
        // delete user.refreshToken;
        await MailService.sendActivationMail(user.email, process.env.API_URL + 'api/activate/' + data.location.city.idKladr + "/" + user.activationLink);
        const tokens = TokenService.generateTokens({...location, ...user});
        await TokenService.saveToken(location, user.id, tokens.refreshToken);
        return {...tokens, location, user, searchedUser, apartment}
    }
    static async activate(cityId, activationLink){
        const user = await userModel.findByCityIdByActivationLink(cityId, activationLink);
        if (!user) throw new ApiError.BadRequest('Некорректная сслыка активация');
        user.isActivated = true;
        await userModel.update({ city: { idKladr: cityId} }, user);
    }
    static async login(email, password){
        const records = await userModel.findByEmail(email);
        const {location, user, searchedUser, apartment} = ConvertService.convertDataDbObjToClientObj(records);
        if (!user) throw ApiError.BadRequest('Пользователь с таким email не найден');
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) throw ApiError.BadRequest('Неверный пароль');
        // delete user.password;
        // delete user.accessToken;
        // delete user.refreshToken;
        const tokens = TokenService.generateTokens({...location, ...user});
        await TokenService.saveToken(location, user.id, tokens.refreshToken);
        return {...tokens, location, user, searchedUser, apartment};
    }
    static async logout(cityId, userId){
        const user = await TokenService.removeToken(cityId, userId);
        return user;
    }
    static async refresh (refreshToken) {
        if (!refreshToken) throw ApiError.UnauthorizedError();
        const userData = TokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await TokenService.findToken(userData.city.idKladr, userData.id);
        // console.log("tokenFromDB:");
        // console.log(tokenFromDB);
        if (!(userData && tokenFromDB)) throw ApiError.UnauthorizedError();
        const records = await userModel.findByCityIdByUserId(userData.city.idKladr, userData.id);
        const { location, user, searchedUser, apartment } = ConvertService.convertDataDbObjToClientObj(records);
        delete user.password;
        delete user.accessToken;
        delete user.refreshToken;
        const tokens = TokenService.generateTokens({...location, ...user});

        await TokenService.saveToken(location, user.id, tokens.refreshToken);
        return {...tokens, location, user, searchedUser, apartment };
    }

    static async getUserByCityIdByUserId(cityId, userId, currentUserId){
        const records = await userModel.findByCityIdByUserIdRating(cityId, userId, currentUserId);
        const result = ConvertService.convertDataDbObjToClientObj(records);
        return result;
    }


    static async getSimplifiedUsersByCityIdByLimit(cityId, typeContent, limit){
        let result = null;
        if (typeContent === 0){
            const records = await userModel.findByCityId(cityId, limit);
            result = ConvertService.convertDataDbObjToClientSimplifiedObj(records);
        } else if (typeContent === 1){
            const records = await userModel.findByCityId(cityId, limit);
            result = ConvertService.convertDataDbObjToClientSimplifiedObj(records);
        } else if (typeContent === 2){
    
        }
        return result;
    }

    static async getSimplifiedUsersByCityIdByUserIdByLimit(cityId, userId, typeContent, typeOfSimilarity, matchByParameters, relevanceRange, typeOfRating, scoreRange, limit){
        let result = null;
        if (typeOfSimilarity === 0) {
            if (matchByParameters === 0) {
                if (typeContent === 0){
                    const records = await userModel.findUsersByCityIdByUserId(cityId, userId, relevanceRange, limit);
                    result = ConvertService.convertDataDbObjToClientSimplifiedObj(records);
                } else if (typeContent === 1){
                    const records = await userModel.findUsersByCityIdByUserId(cityId, userId, relevanceRange, limit);
                    result = ConvertService.convertDataDbObjToClientSimplifiedObj(records);
                } else if (typeContent === 2){
            
                }
            }
            else if (matchByParameters === 1){
                if (typeContent === 0){
                    const records = await userModel.findUsersByCityIdByUserIdPartialMatch(cityId, userId, relevanceRange, limit);
                    result = ConvertService.convertDataDbObjToClientSimplifiedObj(records);
                } else if (typeContent === 1){
                    const records = await userModel.findUsersByCityIdByUserIdPartialMatch(cityId, userId, relevanceRange, limit);
                    result = ConvertService.convertDataDbObjToClientSimplifiedObj(records);
                } else if (typeContent === 2){
            
                }
            }
            else if (matchByParameters === 2) {
                if (typeContent === 0){
                    const records = await userModel.findUsersByCityIdByUserIdFullMatch(cityId, userId, limit);
                    result = ConvertService.convertDataDbObjToClientSimplifiedObj(records);
                } else if (typeContent === 1){
                    const records = await userModel.findUsersByCityIdByUserIdFullMatch(cityId, userId, limit);
                    result = ConvertService.convertDataDbObjToClientSimplifiedObj(records);
                } else if (typeContent === 2){
            
                }
            }
        }
        else if (typeOfSimilarity === 1){
            if (typeContent === 0){
                if (typeOfRating === 0) {
                    const records = await userModel.findUsersByCityIdByUserIdByEstimatedScore(cityId, userId, scoreRange, limit);
                    result = ConvertService.convertDataDbObjToClientSimplifiedObjE(records);    
                } else {
                    const records = await userModel.findUsersByCityIdByUserIdByEstimatedScoreByTypeOfRating(cityId, userId, scoreRange, typeOfRating - 1, limit);
                    result = ConvertService.convertDataDbObjToClientSimplifiedObjE(records);    
                }
            } else if (typeContent === 1){
                if (typeOfRating === 0) {
                    const records = await userModel.findUsersByCityIdByUserIdByEstimatedScore(cityId, userId, scoreRange, limit);
                    result = ConvertService.convertDataDbObjToClientSimplifiedObjE(records);    
                } else {
                    const records = await userModel.findUsersByCityIdByUserIdByEstimatedScoreByTypeOfRating(cityId, userId, scoreRange, typeOfRating - 1, limit);
                    result = ConvertService.convertDataDbObjToClientSimplifiedObjE(records);    
                }
            } else if (typeContent === 2){
        
            }

        }
        return result;
    }
    static async pushNewRatingToUser(data){
        const { cityId, userId, ratedUserId, newRating, typeOfRating } = data;
        await userModel.pushNewRatingByCityIdByUserId(cityId, userId, ratedUserId, newRating, typeOfRating);
        RelevanceByRatingService.createMatrix(cityId, userId, typeOfRating);
    }
}