import jwt from "jsonwebtoken";
import userModel from "../models/user.js";

export default class TokenService{
    static generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        }
    }

    static validateAccessToken(token) {
        try{
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    static validateRefreshToken(token) {
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    static async saveToken(location, userId, refreshToken){
        const records = await userModel.findByCityIdByUserId(location.city.idKladr, userId);
        // if (user.refreshToken) {
            let locationDB = { city: records.map(i => i.get('city').properties)[0] };
            let userDB = records.map(i => i.get('user').properties)[0];    
            userDB.refreshToken = refreshToken;
            userModel.updateUser(locationDB, userDB);

        // }
        return userDB.refreshToken;
    }
    static async removeToken(cityId, userId) {
        const user = await userModel.deleteRefreshTokenByCityIdById(cityId, userId);
        return user;
    }
    static async findToken(cityId, userId) {
        const tokenData = await userModel.findTokenByCityIdByUserId(cityId, userId);
        return tokenData;
    }
}