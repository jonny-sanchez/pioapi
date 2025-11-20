import path from "path";
import { inject, injectable } from "tsyringe";
import FsService from "../fs/FsService";
import { ListContentByLogDtoType } from "../../dtos/Logs/ListContentByLogDto";
import { groupByField } from "../../utils/Json/JsonHelper";

@injectable()
export default class LogsService {

    private LOG_DIR:string = path.join(process.cwd(), 'src', 'storage', 'logs')

    constructor(@inject(FsService) private fsService:FsService) {}

    async getFileLogsJson() : Promise<any> {
        const resultFiles = await this.fsService.getNameFilesJson(this.LOG_DIR, '.log')
        return resultFiles
    }

    async getContentFile(data:ListContentByLogDtoType) : Promise<any> {
        const contentResult = await this.fsService.getContentJson(this.LOG_DIR, data.name_file)
        const groupDataByField = groupByField(contentResult, 'type')
        return groupDataByField
    }

}