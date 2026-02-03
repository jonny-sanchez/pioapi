import { Response } from "express";
import { JsonResponse, RequestAuth } from "../../types/ResponseTypes";
import { handleSend } from "../../utils/HandlerFactory";
import { inject, injectable } from "tsyringe";
import TiendasModuloRepository from "../../repositories/TiendasModuloRepository";
import { TiendaByCodigoDtoType } from "../../dtos/TiendasModulo/TiendaByCodigoDto";

@injectable()
export default class TiendasModuloController {

    constructor(@inject(TiendasModuloRepository) private tiendasModuloRepository:TiendasModuloRepository) {}

    async listAllTiendas(req:RequestAuth, res:Response<JsonResponse<any>>) {
        await handleSend(res, async(t)=>{
            const result = await this.tiendasModuloRepository.getAll()
            return result
        }, 'Tiendas listadas correctamente.')
    }

    async getTiendaByCodigo(req:RequestAuth<TiendaByCodigoDtoType>, res:Response<JsonResponse<any>>) {
        await handleSend(res, async() => {
            const result = await this.tiendasModuloRepository.findByEmpresaAndTienda(
                req.body.codigo_empresa, req.body.codigo_tienda, true
            )
            return result
        }, 'Tienda listada correctamente.')
    }

}