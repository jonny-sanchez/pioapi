import ResumenPermissionMenuView from "../models/pioapp/views/ResumenPermissionMenuView";

export default interface IResumenPermissionMenuViewRepository {

    getPermissionByRol(rol:number, raw:boolean) : Promise<ResumenPermissionMenuView[]>

}