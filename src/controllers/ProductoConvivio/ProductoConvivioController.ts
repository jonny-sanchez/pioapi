import { inject, injectable } from "tsyringe";
import { JsonResponse, RequestAuth, userToken } from "../../types/ResponseTypes";
import { Response } from "express";
import { handleSend } from "../../utils/HandlerFactory";
import { NwProductConvivioDtoType } from "../../dtos/ProductoConvivio/NwProductConvivioDto";
import ProductoConvivioService from "../../services/ProductoConvivio/ProductoConvivioService";
import { Transaction } from "sequelize";

@injectable()
export default class ProductoConvivioController {

    constructor (@inject(ProductoConvivioService) private productoConvivioService:ProductoConvivioService) {}

    async nwProductConvivio(req:RequestAuth<NwProductConvivioDtoType>, res:Response<JsonResponse<any>>) {
        await handleSend(res, async (t) => {
            const result = await this.productoConvivioService.createNwProductoConvivio(
                req.body,
                req.user as userToken,
                t as Transaction
            )
            return result
        }, 'Producto creado correctamente.', true, 'PIOAPP')
    }

}