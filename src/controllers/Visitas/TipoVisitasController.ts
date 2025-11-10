import TipoVisitaRepository from "../../repositories/TipoVisitaRepository";
import { handleSend } from "../../utils/HandlerFactory";
import { RequestAuth, JsonResponse } from "../../types/ResponseTypes";
import { Response } from "express";
import { inject, injectable } from "tsyringe";
import ResumenPermissionTipoVisitaViewRepository from "../../repositories/ResumenPermissionTipoVisitaViewRepository";

@injectable()
export default class TipoVisitasController {

    constructor(
        @inject(TipoVisitaRepository) private tipoVisitaRepository:TipoVisitaRepository,
        @inject(ResumenPermissionTipoVisitaViewRepository) private resumenPermissionTipoVisitaViewRepository:ResumenPermissionTipoVisitaViewRepository
    ) {}

    async listAllTipoVisitas(req:RequestAuth, res:Response<JsonResponse<any>>) {
        await handleSend(res, async(t) => {
            const result = await this.resumenPermissionTipoVisitaViewRepository.getByRol(req.user?.id_rol ?? 0)
            return result
        }, 'Tipos visitas listados correctamente.')
    }

}