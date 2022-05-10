import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import userModel from "../models/user.js";
import MailService from "./mail-service.js";
import TokenService from "./token-service.js";
import ApiError from "../exceptions/ApiError.js";
import ConvertService from "./convert-service.js";

export default class UserService{
    static async registration(data){
        const candidate = await userModel.findByCityIdByEmail(data.location.city.idKladr, data.user.email);
        if (candidate) throw ApiError.BadRequest(`Пользователь с электронным адресом ${data.user.email} уже существует`);
        data.user.password = await bcrypt.hash(data.user.password, 4);
        data.user.activationLink = uuidv4();
        const records = await userModel.create(data.location, data.user, data.searchedUser, data.apartment);
        const { location, user, searchedUser, apartment } = ConvertService.convertDataDbObjToClientObj(records);
        user.password = '';
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
        console.log(email, password);
        const records = await userModel.findByEmail(email);
        console.log(records);
        console.log(ConvertService.convertDataDbObjToClientObj);         
        const {location, user, searchedUser, apartment} = ConvertService.convertDataDbObjToClientObj(records);
        if (!user) throw ApiError.BadRequest('Пользователь с таким email не найден');
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) throw ApiError.BadRequest('Неверный пароль');
        const tokens = TokenService.generateTokens({...location, ...user});
        await TokenService.saveToken(location, user.id, tokens.refreshToken);
        return {...tokens, location, user, searchedUser, apartment}
    }
    static async logout(cityId, userId){
        const user = await TokenService.removeToken(cityId, userId);
        return user;
    }
    static async refresh (refreshToken) {
        if (!refreshToken) throw ApiError.UnauthorizedError();
        console.log(refreshToken);
        const userData = TokenService.validateRefreshToken(refreshToken);
        console.log("userData:");
        console.log(userData);
        const tokenFromDB = await TokenService.findToken(userData.city.idKladr, userData.id);
        // console.log("tokenFromDB:");
        // console.log(tokenFromDB);
        if (!(userData && tokenFromDB)) throw ApiError.UnauthorizedError();
        const records = await userModel.findByCityIdByUserId(userData.city.idKladr, userData.id);
        const { location, user, searchedUser, apartment } = ConvertService.convertDataDbObjToClientObj(records);
        const tokens = TokenService.generateTokens({...location, ...user});

        await TokenService.saveToken(location, user.id, tokens.refreshToken);
        return {...tokens, location, user, searchedUser, apartment };
    }

    static async getUserByCityIdByUserId(cityId, userId){
        const records = await userModel.findByCityIdByUserId(cityId, userId);
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
        // console.log(result);
        return result;
    }

    static async getSimplifiedUsersByCityIdByUserIdByLimit(cityId, userId, typeContent, matchByParameters, limit){
        let result = null;

        if (matchByParameters === 0) {
            if (typeContent === 0){
                const records = await userModel.findUsersByCityIdByUserId(cityId, userId, limit);
                result = ConvertService.convertDataDbObjToClientSimplifiedObj(records);
            } else if (typeContent === 1){
                const records = await userModel.findUsersByCityIdByUserId(cityId, userId, limit);
                result = ConvertService.convertDataDbObjToClientSimplifiedObj(records);
            } else if (typeContent === 2){
        
            }
        }
        else if (matchByParameters === 1){
            if (typeContent === 0){
                const records = await userModel.findUsersByCityIdByUserIdPartialMatch(cityId, userId, limit);
                result = ConvertService.convertDataDbObjToClientSimplifiedObj(records);
            } else if (typeContent === 1){
                const records = await userModel.findUsersByCityIdByUserIdPartialMatch(cityId, userId, limit);
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
        // console.log(result);
        return result;
    }

}