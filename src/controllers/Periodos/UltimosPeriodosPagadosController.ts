import { Response } from "express";
import { JsonResponse, RequestAuth } from "../../types/ResponseTypes";
import { handleSend } from "../../utils/HandlerFactory";
import { inject, injectable } from "tsyringe";
import UltimosPeriodosPagadosViewRepository from "../../repositories/UltimosPeriodosPagadosViewRepository";

@injectable()
export default class UltimosPeriodosPagadosController {
    constructor(
        @inject(UltimosPeriodosPagadosViewRepository)
        private ultimosPeriodosPagadosViewRepository: UltimosPeriodosPagadosViewRepository
    ) {}

    async listAllPeriodos(req:RequestAuth, res:Response<JsonResponse<any>>) {
        await handleSend(res, async(t)=>{
            const result = await this.ultimosPeriodosPagadosViewRepository.getAll()
            return result
        }, 'Periodos listados correctamente.')
    }
}