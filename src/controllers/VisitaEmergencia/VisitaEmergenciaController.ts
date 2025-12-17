import { inject, injectable } from "tsyringe";
import { handleSend } from "../../utils/HandlerFactory";
import { JsonResponse, RequestAuth } from "../../types/ResponseTypes";
import { Response } from "express";
import { UpdateVisitaEmergenciaDtoType } from "../../dtos/VisitaEmergencia/UpdateVisitaEmergenciaDto";
import VisitaEmergenciaService from "../../services/VisitaEmergencia/VisitaEmergenciaService";
import { Transaction } from "sequelize";
import { FindVisitaEmergenciaDtoType } from "../../dtos/VisitaEmergencia/FindVisitaEmergenciaDto";

@injectable()
export default class VisitaEmergenciaController {

    constructor(
        @inject(VisitaEmergenciaService) private visitaEmergenciaService:VisitaEmergenciaService
    ) {}

    async updateVisitaEmergencia(req:RequestAuth<UpdateVisitaEmergenciaDtoType>, res:Response<JsonResponse<any>>) {
        await handleSend(res, async(t) => {
            const result = await this.visitaEmergenciaService.updateData(req.body, t as Transaction)
            return result
        }, 'Visita emergencia editada correctamente.', true, 'PIOAPP')
    }

    async getVisitaEmergencia(req:RequestAuth<FindVisitaEmergenciaDtoType>, res:Response<JsonResponse<any>>) {
        await handleSend(res, async() => {
            const result = await this.visitaEmergenciaService.findVisitaEmergencia(req.body)
            return result
        }, 'Visita listada correctamente.')
    }

}