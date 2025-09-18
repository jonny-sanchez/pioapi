import ITipoVisitaRepository from "../interface/ITipoVisitaRepository";
import TipoVisitaModel from "../models/pioapp/tables/TipoVisitaModel";
import { injectable } from "tsyringe";

@injectable()
export default class TipoVisitaRepository implements ITipoVisitaRepository {

    async getAll(raw: boolean = false): Promise<TipoVisitaModel[]> {
        const result = await TipoVisitaModel.findAll({ raw: raw })
        return result
    }

}