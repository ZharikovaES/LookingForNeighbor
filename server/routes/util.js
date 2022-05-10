import { Router } from "express";
import UtilController from "../controllers/util-controller.js";

const util = new Router();

util.get('/cities', UtilController.getCities);
util.get('/addresses', UtilController.getAddresses);
util.get('/jobs', UtilController.getJobs);
util.get('/universities', UtilController.getUniversities);
util.get('/faculties', UtilController.getFaculties);
util.get('/chairs', UtilController.getChairs);

export default util;