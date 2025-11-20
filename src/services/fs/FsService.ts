import { injectable } from "tsyringe";
import { promises as fs } from 'fs';
import { join } from "path";
import { PaserJsonFileContent } from "../../utils/Json/JsonHelper";
import HandleLogData from "../../types/Logs/HandleLogData";

@injectable()
export default class FsService {

    constructor () {}

    async getNameFilesJson(dirname:string, typeFiles?:string) : Promise<string[]> {
        let files:string[] = await fs.readdir(dirname)
        if(typeFiles) files = files.filter(f => f.endsWith(typeFiles))
        return files
    }

    async getContentJson(dirname:string, nameFile:string) : Promise<HandleLogData[]> {
        const filePath:string = join(dirname, nameFile)
        const content:string = await fs.readFile(filePath, 'utf-8')
        const resultJson:HandleLogData[] = PaserJsonFileContent(content)
        return resultJson
    }

}