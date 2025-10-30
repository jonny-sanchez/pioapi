import { JsonResponse, RequestAuth } from "../../types/ResponseTypes";
import { Response } from "express";
import { handleSend } from "../../utils/HandlerFactory";
import { inject, injectable } from "tsyringe";
import ArticulosRutaViewRepository from "../../repositories/ArticulosRutaViewRepository";
import { PedidosRutaDtoType } from "../../dtos/Rutas/PedidosRutaDto";

@injectable()
export default class ArticulosRutaController {

    constructor(
        @inject(ArticulosRutaViewRepository) private articulosRutaViewRepository:ArticulosRutaViewRepository
    ) {}

    async listArticulosRuta(req:RequestAuth<PedidosRutaDtoType>, res:Response<JsonResponse<any[]>>) {
        await handleSend(res, async() => {
            const result = await this.articulosRutaViewRepository.getAllByPedido(req.body.id_pedido)
            return result
        }, "Articulos listados correctamente.")
    }

}