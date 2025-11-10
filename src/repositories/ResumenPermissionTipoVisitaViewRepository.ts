import { injectable } from "tsyringe";
import IResumenPermissionTipoVisitaViewRepository from "../interface/IResumenPermissionTipoVisitaViewRepository";
import ResumenPermissionTipoVisitaView from "../models/pioapp/views/ResumenPermissionTipoVisitaView";

@injectable()
export default class ResumenPermissionTipoVisitaViewRepository implements IResumenPermissionTipoVisitaViewRepository {

    async getByRol(id_rol: number, raw: boolean = false): Promise<ResumenPermissionTipoVisitaView[]> {
        const result = await ResumenPermissionTipoVisitaView.findAll({
            attributes: ['id_tipo_visita', 'name'],
            where: { id_rol: id_rol },
            raw
        })
        return result
    }

}