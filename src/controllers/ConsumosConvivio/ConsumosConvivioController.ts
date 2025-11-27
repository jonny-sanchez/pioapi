import { inject, injectable } from "tsyringe";
import { handleSend } from "../../utils/HandlerFactory";
import { JsonResponse, RequestAuth, userToken } from "../../types/ResponseTypes";
import { Response } from "express";
import ConsumosConvivioService from "../../services/ConsumosConvivio/ConsumosConvivioService";
import { CreateConsumoConvivioDtoType } from "../../dtos/ConsumosConvivio/CreateConsumoConvivioDto";
import { Transaction } from "sequelize";
import { ListConsumoPersonaConvivioDtoType } from "../../dtos/ConsumosConvivio/ListConsumoPersonaConvivioDto";

@injectable()
export default class ConsumosConvivioController {

    constructor(@inject(ConsumosConvivioService) private consumosConvivioService:ConsumosConvivioService) {}

    async createConsumoConvivioPersona(req:RequestAuth<CreateConsumoConvivioDtoType>, res:Response<JsonResponse<any>>) {
        await handleSend(res, async(t)=> {
            const result = await this.consumosConvivioService.createConsumo(
                req.body, 
                t as Transaction,
                req.user as userToken
            )
            return result
        }, 'Consumo creado correctamente.', true, 'PIOAPP')
    }

    async listConsumoPersona(req:RequestAuth<ListConsumoPersonaConvivioDtoType>, res:Response<JsonResponse<any[]>>) {
        await handleSend(res, async() => {
            const result = await this.consumosConvivioService.getConsumoByPersona(req.body)
            return result
        }, 'Consumo listado correctmante.')
    }

}