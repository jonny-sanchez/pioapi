import { Response } from "express";
import { JsonResponse, RequestAuth } from "../../types/ResponseTypes";
import { handleSend } from "../../utils/HandlerFactory";
import { inject, injectable } from "tsyringe";
import TiendasModuloRepository from "../../repositories/TiendasModuloRepository";
import { TiendaByCodigoDtoType } from "../../dtos/TiendasModulo/TiendaByCodigoDto";
import TiendasModuloService from "../../services/TiendasModulo/TiendasModuloService";

@injectable()
export default class TiendasModuloController {

    constructor(
        // @inject(TiendasModuloRepository) private tiendasModuloRepository:TiendasModuloRepository
        @inject(TiendasModuloService) private tiendasModuloService:TiendasModuloService
    ) {}

    async listAllTiendas(req:RequestAuth, res:Response<JsonResponse<any>>) {
        await handleSend(res, async(t)=>{
            const result = await this.tiendasModuloService.getAllTiendas()
            return result
        }, 'Tiendas listadas correctamente.')
    }

    async getTiendaByCodigo(req:RequestAuth<TiendaByCodigoDtoType>, res:Response<JsonResponse<any>>) {
        await handleSend(res, async() => {
            const result = await this.tiendasModuloService.findTienda(req.body)
            return result
        }, 'Tienda listada correctamente.')
    }

}