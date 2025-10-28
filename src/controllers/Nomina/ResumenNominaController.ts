import { inject, injectable } from "tsyringe";
import ResumenNominaService from "../../services/Nomina/ResumenNominaService";
import { JsonResponse, RequestAuth, userToken } from "../../types/ResponseTypes";
import { Response } from "express";
import { FindNominaDtoType } from "../../dtos/FindNominaDto";
import { handleSend } from "../../utils/HandlerFactory";

@injectable()
export default class PlanillasController {

    constructor(
        @inject(ResumenNominaService) private resumenNominaService: ResumenNominaService
    ) { }

    async findByCodigoAndPeriodo(req: RequestAuth, res: Response<JsonResponse<any[]>>) {
        await handleSend(res, async () => {
            return this.resumenNominaService.findByCodigoAndPeriodo(req.user as userToken, req.body as FindNominaDtoType);
        }, 'Resumen de nómina obtenida correctamente.');
    }
}