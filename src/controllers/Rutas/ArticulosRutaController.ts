import { JsonResponse, RequestAuth } from "../../types/ResponseTypes";
import { Response } from "express";
import { handleSend } from "../../utils/HandlerFactory";
import { inject, injectable } from "tsyringe";
import ArticulosRutaViewRepository from "../../repositories/ArticulosRutaViewRepository";
import { PedidosRutaDtoType } from "../../dtos/Rutas/PedidosRutaDto";
import { ListArticulosRutaDtoType } from "../../dtos/Rutas/ListArticulosRutaDto";
import ArticulosRutaService from "../../services/Rutas/ArticulosRutaService";

@injectable()
export default class ArticulosRutaController {

    constructor(
        @inject(ArticulosRutaViewRepository) private articulosRutaViewRepository:ArticulosRutaViewRepository,
        @inject(ArticulosRutaService) private articulosRutaService:ArticulosRutaService 
    ) {}

    async listArticulosRuta(req:RequestAuth<PedidosRutaDtoType>, res:Response<JsonResponse<any[]>>) {
        await handleSend(res, async() => {
            const result = await this.articulosRutaViewRepository.getAllByPedido(req.body.id_pedido)
            return result
        }, "Articulos listados correctamente.")
    }

    async listEntradaArticulosTiendaPOS(req:RequestAuth<ListArticulosRutaDtoType>, res:Response<JsonResponse<any>>) {
        await handleSend(res, async() => {
            const result = await this.articulosRutaService.getListArtExternalServicePOS(req.body)
            return result
        }, "Articulos Entrada listados correctamente.")
    }

}