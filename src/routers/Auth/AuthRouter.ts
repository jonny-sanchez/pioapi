import { Router } from "express";
import AuthController from "../../controllers/Auth/AuthController";
import { container } from "tsyringe";
import validateFields from "../../middlewares/validateFields";
import { LoginDto } from "../../dtos/LoginDto";

const authRouter = Router()
const authController = container.resolve(AuthController)

authRouter.post('/login', validateFields(LoginDto), authController.login.bind(authController))


export default authRouter