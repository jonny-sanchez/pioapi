import { JsonResponse, RequestAuth } from "../../types/ResponseTypes";
import { Response } from "express";
import { handleSend } from "../../utils/HandlerFactory";
import { inject, injectable } from "tsyringe";
import CategoryProductosConvivioRepository from "../../repositories/CategoryProductosConvivioRepository";

@injectable()
export default class CategoryProductoConvivioController {

    constructor(@inject(CategoryProductosConvivioRepository) private categoryProductosConvivioRepository:CategoryProductosConvivioRepository ) {}

    async listAll(req:RequestAuth, res:Response<JsonResponse<any[]>>) {
        await handleSend(res, async(t)=> {
            const result = await this.categoryProductosConvivioRepository.getAll()
            return result
        }, 'Categorias listadas correctamente.')
    }

}