import AuthServices from "../../services/Auth/AuthServices"
import { Request, Response } from "express"
import { JsonResponse } from "../../types/ResponseTypes"
import { injectable,inject } from "tsyringe"
import { handleSend } from "../../utils/HandlerFactory"
import { LoginDtoType } from "../../dtos/LoginDto"
import { Transaction } from "sequelize"

@injectable()
export default class AuthController {

    constructor (@inject(AuthServices) private authServices:AuthServices) {}

    async login(req:Request, res:Response<JsonResponse<any>>) {
        await handleSend(res, async (t) =>{
            const result = await this.authServices.validLogin(req.body as LoginDtoType, t as Transaction)
            return result
        }, 'Credenciales correctas', true, 'PIOAPP')
    }

}