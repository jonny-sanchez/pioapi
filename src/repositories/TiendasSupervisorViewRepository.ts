import ITiendasSupervisorViewRepository from "../interface/ITiendasSupervisorViewRepository";
import TiendasSupervisorView from "../models/nomina/views/TiendasSupervisorView";
import { injectable } from "tsyringe";

@injectable()
export default class TiendasSupervisorViewRepository implements ITiendasSupervisorViewRepository {

    async getAllByCodigo(codigo: number, raw: boolean = false): Promise<TiendasSupervisorView[]> {
        const result = await TiendasSupervisorView.findAll({ where: { codEmpleado: codigo }, raw: raw })
        return result
    }

}