import { Router } from "express";
import AuthController from "../../controllers/Auth/AuthController";
import { container } from "tsyringe";
import validateFields from "../../middlewares/validateFields";
import { LoginDto } from "../../dtos/LoginDto";
import basicAuthMiddleware from "../../middlewares/basicAuthMiddleware";
import { LoginBiometricDto } from "../../dtos/Auth/LoginBiometricDto";

const authRouter = Router()
const authController = container.resolve(AuthController)

authRouter.post(
    '/login', 
    validateFields(LoginDto), 
    authController.login.bind(authController)
)

authRouter.post(
    '/biometric',
    basicAuthMiddleware,
    validateFields(LoginBiometricDto),
    authController.loginBiometric.bind(authController)
)

export default authRouter