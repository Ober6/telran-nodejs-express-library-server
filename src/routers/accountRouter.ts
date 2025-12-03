import express from "express";
import {accountController} from "../controllers/AccountController.js";
import {bodyValidator} from "../middleware/bodyValidator.js";
import {
    ChangePassDtoJoiSchema,
    LoginJoiSchema,
    ReaderDtoJoiSchema,
    UpdateAccountJoiSchema
} from "../utils/joiSchemas.js";
import {AuthRequest, Roles} from "../utils/libTypes.js";
import {HttpError} from "../errorHandler/HttpError.js";

export const accountRouter = express.Router();

const controller = accountController;

accountRouter.post('/', bodyValidator(ReaderDtoJoiSchema), controller.createAccount);
// accountRouter.get('/byId', async (req: AuthRequest, res) => {
//     const roles = req.roles;
//     if(!req.roles?.includes(Roles.READER))
//         throw new HttpError(403, "");
//     await controller.getAccountById(req, res);
// });
accountRouter.get('/byId', controller.getAccountById);
accountRouter.delete('/', controller.removeAccount);
accountRouter.patch('/password', bodyValidator(ChangePassDtoJoiSchema), controller.changePassword);
accountRouter.patch('/update', bodyValidator(UpdateAccountJoiSchema), controller.editAccount);
accountRouter.patch('/roles', controller.addRole);
accountRouter.post('/login', bodyValidator(LoginJoiSchema), controller.login);