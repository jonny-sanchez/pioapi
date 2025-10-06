import { inject, injectable } from "tsyringe";
import VisitasService from "../../services/Visitas/VisitasService";
import { JsonResponse, RequestAuth, userToken } from "../../types/ResponseTypes";
import { Response } from "express";
import { handleSend } from "../../utils/HandlerFactory";
import { Transaction } from "sequelize";
import { CreateVisitaDtoType, CreateVisitaDtoTypeFiles } from "../../dtos/CreateVisitaDto";
import VisitaRepository from "../../repositories/VisitaRepository";

@injectable()
export default class VisitasController {

    constructor(
        @inject(VisitasService) private visitasService:VisitasService,
        @inject(VisitaRepository) private visitaRepository:VisitaRepository 
    ) {}

    async createVisita(req:RequestAuth, res:Response<JsonResponse<any>>) {
        await handleSend(res, async(t)=> {
            const result = await this.visitasService.createVisitaAndSaveFile(
                t as Transaction, 
                req.body as CreateVisitaDtoType,
                req.user as userToken,
                req.files as CreateVisitaDtoTypeFiles
            )
            return result
        }, 'Visitada creada correctamente.', true, 'PIOAPP')
    }

    async listAllVisitas(req:RequestAuth, res:Response<JsonResponse<any[]>>) {
        await handleSend(res, async()=> {
            const result = await this.visitaRepository.getAll()
            return result
        }, 'Visitas listadas correctamente.')
    }

}