import { Response } from "express";
import { JsonResponse, RequestAuth } from "../../types/ResponseTypes";
import { handleSend } from "../../utils/HandlerFactory";
import { inject, injectable } from "tsyringe";
import TiendasModuloRepository from "../../repositories/TiendasModuloRepository";

@injectable()
export default class TiendasModuloController {

    constructor(@inject(TiendasModuloRepository) private tiendasModuloRepository:TiendasModuloRepository) {}

    async listAllTiendas(req:RequestAuth, res:Response<JsonResponse<any>>) {
        await handleSend(res, async(t)=>{
            const result = await this.tiendasModuloRepository.getAll()
            return result
        }, 'Tiendas listadas correctamente.')
    }

}