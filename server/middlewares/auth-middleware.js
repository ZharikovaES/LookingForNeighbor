import ApiError from "../exceptions/ApiError.js"
import TokenService from "../services/token-service.js.js";

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
    // try {
    //     if (req.session?.passport?.user) {

    //         console.log('PASSPORT USER:',req.session.passport.user);

    //         const userObj = {};
    //         userObj.email = req.session.passport.user.emails[0].value;
    //         userObj.firstName = req.session.passport.user?.name?.givenName || '';
    //         userObj.lastName = req.session.passport.user?.name?.familyName || '';
    //         userObj.avatar = req.session.passport.user?.photos[0]?.value || '';
    //         userObj.socialId = req.session.passport.user.id;
    //         userObj.provider = req.session.passport.user.provider;

    //         // req.session.userId = await Users.findOne({socialId: userObj.socialId}, {_id: 1}).lean();
    //         // req.session.userId = req.session.userId || (await Users.fullSave(userObj))._id;

    //         res.redirect('/');
    //         // res.json(201);
    //     } else {
    //         next('Authentication error');
    //     }
    // } catch (e) {
    //     next(e);
    // }
}