import { Router } from "express";
import userModel from "../models/user.js";

import UserController from "../controllers/user-controller.js";


const user = Router();

user.get('/users/simplified', UserController.getSimplifiedInformationUsers);
user.get('/users/:cityId/:userId/:currentUserId', UserController.getUserById);
///authentication/google
user.post('/user/rating', UserController.postNewRating );

user.post('/authentication/google', UserController.authenticationGoogle);
user.post('/authentication/vk', UserController.authenticationVK);

user.post('/login', UserController.login);
user.post('/registration', UserController.registration);
user.post('/logout', UserController.logout);

user.get('/activate/:city/:link', UserController.activate);
user.get('/refresh', UserController.refresh);

user.put('/users', async (req, res) => {
    try{
        const user = req.body;
        const result = await userModel.update(user);
        res.json(result);
    } catch (e){
        console.error(e);
        res.status(500);
    }
});

user.delete('/users', async (req, res) => {
    try{
        const query = req.query;
        if (query) await userModel.deleteById(query.cityId, query.userId);
        res.json({ "deleteId": query.userId });
    } catch (e){
        console.error(e);
        res.status(500);
    }
});
// user.use((req, res, next) => {
//     res.setHeader("Content-Type", "application/json");
//     next();
// });



export default user;