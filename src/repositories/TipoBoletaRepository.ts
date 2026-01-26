import { injectable } from "tsyringe";
import ITipoBoletaRepository from "../interface/ITipoBoletaRepository";
import TipoBoletaModel from "../models/pioapp/tables/TipoBoletaModel";

@injectable()
export default class TipoBoletaRepository implements ITipoBoletaRepository {
    
    async getAll(): Promise<TipoBoletaModel[]> {
        const result = await TipoBoletaModel.findAll({ 
            order: [['id_tipo_boleta','ASC']]
        })
        return result
    }

}