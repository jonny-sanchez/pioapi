import TipoVisitaModel from "../models/pioapp/tables/TipoVisitaModel";

export default interface ITipoVisitaRepository {

    getAll(raw:boolean) : Promise<TipoVisitaModel[]> 

}