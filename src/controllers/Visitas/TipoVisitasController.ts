import TipoVisitaRepository from "../../repositories/TipoVisitaRepository";
import { handleSend } from "../../utils/HandlerFactory";
import { RequestAuth, JsonResponse } from "../../types/ResponseTypes";
import { Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export default class TipoVisitasController {

    constructor(@inject(TipoVisitaRepository) private tipoVisitaRepository:TipoVisitaRepository) {}

    async listAllTipoVisitas(req:RequestAuth, res:Response<JsonResponse<any>>) {
        await handleSend(res, async(t) => {
            const result = await this.tipoVisitaRepository.getAll()
            return result
        }, 'Tipos visitas listados correctamente.')
    }

}