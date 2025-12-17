import { Transaction } from "sequelize";
import VisitaEmergenciaModel from "../models/pioapp/webtables/VisitaEmergenciaModel";

export default interface IVisitaEmergenciaRepository {

    updateById(id_visita:number, data:Partial<VisitaEmergenciaModel>, t:Transaction|null, raw:boolean) : Promise<VisitaEmergenciaModel|null>

    findById(id_visita:number, error:boolean, raw:boolean) : Promise<VisitaEmergenciaModel|null>

}