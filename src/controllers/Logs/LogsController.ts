import { inject, injectable } from "tsyringe";
import { JsonResponse, RequestAuth } from "../../types/ResponseTypes";
import { Response } from "express"; 
import { handleSend } from "../../utils/HandlerFactory";
import LogsService from "../../services/Logs/LogsService";
import { ListContentByLogDtoType } from "../../dtos/Logs/ListContentByLogDto";

@injectable()
export default class LogsController {

    constructor(
        @inject(LogsService) private logsService:LogsService
    ) {}

    async listAllLogs(req:RequestAuth<any>, res:Response<JsonResponse<any[]>>) {
        await handleSend(res, async() => {
            const result = await this.logsService.getFileLogsJson()
            return result
        }, "Logs listados correctamente.")
    }

    async listContentByLog(req:RequestAuth<ListContentByLogDtoType>, res:Response<JsonResponse<any[]>>) {
        await handleSend(res, async() => {
            const result = await this.logsService.getContentFile(req.body)
            return result
        }, "Contenido del log listado correctamente.")
    }

}