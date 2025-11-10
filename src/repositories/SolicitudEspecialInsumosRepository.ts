import { Transaction } from "sequelize";
import tSolicitudEspecialInsumosModel from "../models/pdv/tables/tSolicitudEspecialInsumosModel";
import ISolicitudEspecialInsumosRepository from "./ISolicitudEspecialInsumosRepository";
import { injectable } from "tsyringe";

@injectable()
export default class SolicitudEspecialInsumosRepository implements ISolicitudEspecialInsumosRepository {

    async updateByIdSolicitud(idSolicitud: number, data: Partial<tSolicitudEspecialInsumosModel>, error: boolean = true, t: Transaction | null = null): Promise<number> {
        const [filasActualizadas] = await tSolicitudEspecialInsumosModel.update(data, {
            where: {
                idSolicitud: idSolicitud
            },
            transaction: t
        })
        if(filasActualizadas <= 0 && error) throw new Error(`Error al editar la solicitud con idSolicitud -> ${idSolicitud}`)
        return filasActualizadas
    }

}