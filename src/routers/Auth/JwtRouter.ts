import { Router } from "express";
import JwtController from "../../controllers/Auth/JwtController";
import { container } from "tsyringe";
import validateFields from "../../middlewares/validateFields";
import { ValidJwtDto } from "../../dtos/ValidJwtDto";

const jwtRouter = Router()
const jwtController = container.resolve(JwtController)

jwtRouter.post('/valid', validateFields(ValidJwtDto), jwtController.validJwt.bind(jwtController))

export default jwtRouter