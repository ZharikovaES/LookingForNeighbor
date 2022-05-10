import ApiError from "../exceptions/ApiError.js"
import TokenService from "../service/token-service.js";

export default (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) throw ApiError.UnauthorizedError();
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) throw ApiError.UnauthorizedError();
        const userData = TokenService.validateAccessToken(accessToken);
        if (!userData) throw ApiError.UnauthorizedError();
        req.location = userData.location;
        req.user = userData.user;
        req.user = userData.user;
        req.user = userData.user;
        next();
    } catch (error) {
        next(error);
    }
}