import { inject, injectable } from "tsyringe";
import { handleSend } from "../../utils/HandlerFactory";
import { JsonResponse, RequestAuth, userToken } from "../../types/ResponseTypes";
import { Response } from "express";
import { saveRecepcionDtoType } from "../../dtos/recepciones/SaveRecepcionDto";
import RecepcionesServices from "../../services/Recepciones/RecepcionesServices";
import { Transaction } from "sequelize";

@injectable()
export default class RecepcionesController {

    constructor(
        @inject(RecepcionesServices) private recepcionesServices:RecepcionesServices
    ) {}

    async uploadRecepccionesClient(req:RequestAuth<saveRecepcionDtoType>, res:Response<JsonResponse<any>>) {
        await handleSend(res, async(t) => {
            const result = await this.recepcionesServices.saveRecepcionService(
                req.body,
                req.user as userToken,
                t as Transaction
            )
            return result
        }, 'Recepccion creada correctamente.', true, 'PDV')
    }

}