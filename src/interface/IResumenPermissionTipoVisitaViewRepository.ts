import ResumenPermissionTipoVisitaView from "../models/pioapp/views/ResumenPermissionTipoVisitaView";

export default interface IResumenPermissionTipoVisitaViewRepository {

    getByRol(id_rol:number, raw:boolean) : Promise<ResumenPermissionTipoVisitaView[]>

}