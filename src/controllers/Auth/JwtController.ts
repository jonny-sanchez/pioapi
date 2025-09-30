import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import JwtService from "../../services/Auth/JwtService";
import { JsonResponse } from "../../types/ResponseTypes";
import { handleSend } from "../../utils/HandlerFactory";
import { ValidJwtDtoType } from "../../dtos/ValidJwtDto";

@injectable()
export default class JwtController {

    constructor(@inject(JwtService) private jwtService:JwtService) {}

    async validJwt(req:Request, res:Response<JsonResponse<any>>) {
        await handleSend(res, async() => {
            const result = await this.jwtService.verifyJwtToken(req.body as ValidJwtDtoType)
            return result
        }, 'Token validado.')
    }

}