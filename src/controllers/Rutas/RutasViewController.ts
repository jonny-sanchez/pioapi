import { inject, injectable } from "tsyringe";
import { JsonResponse, RequestAuth, userToken } from "../../types/ResponseTypes";
import { Response } from "express";
import { handleSend } from "../../utils/HandlerFactory";
import RutasViewService from "../../services/Rutas/RutasViewService";
import { ListRutasFilterDtoType } from "../../dtos/Rutas/ListRutasFilterDto";
import { ListTiendasDateDtoType } from "../../dtos/Rutas/ListTiendasDateDto";

@injectable()
export default class RutasViewController {

    constructor(@inject(RutasViewService) private rutasViewService:RutasViewService) {}

    async listAllByCodigoEmpleado(req:RequestAuth, res:Response<JsonResponse<any[]>>) {
        await handleSend(res, async() => {
            const result = await this.rutasViewService.filterRutas(
                req.body as ListRutasFilterDtoType,
                req.user as userToken
            )
            return result
        }, 'Rutas por usuario listadas correctamente.')
    }

    async listTiendasByFecha(req:RequestAuth, res:Response<JsonResponse<any[]>>) {
        await handleSend(res, async() => {
            const result = await this.rutasViewService.groupTiendasRutasByDate(
                req.body as ListTiendasDateDtoType,
                req.user as userToken
            )
            return result
        }, 'Tiendas rutas listadas correctamente.')
    }

}