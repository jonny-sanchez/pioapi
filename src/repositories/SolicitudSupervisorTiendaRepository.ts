import { injectable } from "tsyringe";
import ISolicitudSupervisorTiendaRepository from "../interface/ISolicitudSupervisorTiendaRepository";
import tSolicitudSupervisorTiendaModel from "../models/pdv/tables/tSolicitudSupervisorTiendaModel";
import { Transaction } from "sequelize";

@injectable()
export default class SolicitudSupervisorTiendaRepository implements ISolicitudSupervisorTiendaRepository {

    async updateByIdSolicitud(idSolicitud: number, data: Partial<tSolicitudSupervisorTiendaModel>, error: boolean = true, t: Transaction | null = null): Promise<number> {
        const [filasActualizadas] = await tSolicitudSupervisorTiendaModel.update(data, {
            where: {
                idSolicitud: idSolicitud
            },
            transaction: t
        })
        if(filasActualizadas <= 0 && error) throw new Error(`Error al editar la solicitud con idSolicitud -> ${idSolicitud}`)
        return filasActualizadas
    }

}