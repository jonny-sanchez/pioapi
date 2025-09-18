import ITiendasModuloRepository from "../interface/ITiendasModuloRepository";
import TiendasModuloView from "../models/pdv/views/TiendasModuloView";
import { injectable } from "tsyringe";

@injectable()
export default class TiendasModuloRepository implements ITiendasModuloRepository {

    async getAll(raw: boolean = false): Promise<TiendasModuloView[]> {
        const result = await TiendasModuloView.findAll({ raw: raw })
        return result
    }

}