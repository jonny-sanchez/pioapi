import TipoBoletaModel from "../models/pioapp/tables/TipoBoletaModel";

export default interface ITipoBoletaRepository {

    getAll() : Promise<TipoBoletaModel[]>

}