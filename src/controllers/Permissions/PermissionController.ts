import { inject, injectable } from "tsyringe";
import ResumenPermissionMenuViewRepository from "../../repositories/ResumenPermissionMenuViewRepository";
import { handleSend } from "../../utils/HandlerFactory";
import { JsonResponse, RequestAuth } from "../../types/ResponseTypes";
import { Response } from "express";

@injectable()
export default class PermissionController {

    constructor(
        @inject(ResumenPermissionMenuViewRepository) private resumenPermissionMenuViewRepository:ResumenPermissionMenuViewRepository
    ) {}

    async findMenusByRol(req:RequestAuth, res:Response<JsonResponse<any[]>>) {
        await handleSend(res, async () => {
            const result = await this.resumenPermissionMenuViewRepository.getPermissionByRol(req.user?.id_rol ?? 0)
            return result  
        }, "Permisos listados correctamente.")
    }

}