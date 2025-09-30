import { inject, injectable } from "tsyringe";
import VisitasService from "../../services/Visitas/VisitasService";
import { JsonResponse, RequestAuth, userToken } from "../../types/ResponseTypes";
import { Response } from "express";
import { handleSend } from "../../utils/HandlerFactory";
import { Transaction } from "sequelize";
import { CreateVisitaDtoType } from "../../dtos/CreateVisitaDto";

@injectable()
export default class VisitasController {

    constructor(@inject(VisitasService) private visitasService:VisitasService) {}

    async createVisita(req:RequestAuth, res:Response<JsonResponse<any>>) {
        await handleSend(res, async(t)=> {
            const result = await this.visitasService.createVisitaAndSaveFile(
                t as Transaction, 
                req.body as CreateVisitaDtoType,
                req.user as userToken,
                req.files
            )
            return result
        }, 'Visitada creada correctamente.', true, 'PIOAPP')
    }

}