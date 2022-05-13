import { Router } from "express";
import userController from "../controllers/user-controller.js";
import userModel from "../models/user.js";

const user = Router();


user.get('/users/simplified', userController.getSimplifiedInformationUsers);
user.get('/users/:cityId/:userId', userController.getUserById);

user.post('/registration', userController.registration );
user.post('/login', userController.login);
user.post('/logout', userController.logout);

user.get('/activate/:city/:link', userController.activate);
user.get('/refresh', userController.refresh);

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