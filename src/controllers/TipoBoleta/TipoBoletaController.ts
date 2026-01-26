import { inject, injectable } from "tsyringe";
import { JsonResponse, RequestAuth } from "../../types/ResponseTypes";
import { Response } from "express";
import { handleSend } from "../../utils/HandlerFactory";
import TipoBoletaRepository from "../../repositories/TipoBoletaRepository";

@injectable()
export default class TipoBoletaController {

    constructor(
        @inject(TipoBoletaRepository) private tipoBoletaRepository:TipoBoletaRepository 
    ) {}

    async getAllTipoBoletas(req:RequestAuth, res:Response<JsonResponse<any[]>>) {
        await handleSend(res, async() => {
            const result = await this.tipoBoletaRepository.getAll()
            return result
        }, 'Tipos de Boletas listados correctamente.')
    } 

}