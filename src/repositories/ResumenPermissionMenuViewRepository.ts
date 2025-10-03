import IResumenPermissionMenuViewRepository from "../interface/IResumenPermissionMenuViewRepository";
import ResumenPermissionMenuView from "../models/pioapp/views/ResumenPermissionMenuView";
import { injectable } from "tsyringe";

@injectable()
export default class ResumenPermissionMenuViewRepository implements IResumenPermissionMenuViewRepository{

    async getPermissionByRol(rol: number, raw: boolean = false): Promise<ResumenPermissionMenuView[]> {
        const result = await ResumenPermissionMenuView.findAll({ where: { id_rol: rol }, raw: raw })
        return result
    }

}