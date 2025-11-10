import { Transaction } from "sequelize";
import tSolicitudSupervisorTiendaModel from "../models/pdv/tables/tSolicitudSupervisorTiendaModel";

export default interface ISolicitudSupervisorTiendaRepository {

    updateByIdSolicitud(idSolicitud:number, data:Partial<tSolicitudSupervisorTiendaModel>, error: boolean, t:Transaction | null) : Promise<number>

}