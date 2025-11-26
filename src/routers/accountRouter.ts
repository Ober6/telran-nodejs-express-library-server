import express from "express";
import {accountController} from "../controllers/AccountController.js";

export const accountRouter = express.Router();

const controller = accountController;

accountRouter.post('/', controller.createReader); //Todo bodyValidator/Schema
accountRouter.get('/byId', controller.getAccountById);
accountRouter.delete('/', controller.removeAccount);
accountRouter.patch('/password', controller.changePassword);//Todo bodyValidator/Schema
accountRouter.patch('/update', controller.editAccount); //Todo bodyValidator/Schema