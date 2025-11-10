import { Transaction } from "sequelize";
import tSolicitudEspecialInsumosModel from "../models/pdv/tables/tSolicitudEspecialInsumosModel";

export default interface ISolicitudEspecialInsumosRepository {

    updateByIdSolicitud(idSolicitud:number, data:Partial<tSolicitudEspecialInsumosModel>, error: boolean, t:Transaction | null) : Promise<number>

}