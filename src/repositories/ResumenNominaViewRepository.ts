import { injectable } from "tsyringe";
import ResumenNominaView from "../models/nomina/views/ResumenNominaView";
import IResumenNominaViewRepository from "../interface/IResumenNominaViewRepository";

@injectable()
export default class ResumenNominaViewRepository implements IResumenNominaViewRepository {
    async getByCodigoAndPeriodo(codigo: number, periodo: number, raw: boolean = false): Promise<ResumenNominaView[]> {
        const result = await ResumenNominaView.findAll({
            where: {
                codEmpleado: codigo,
                idPeriodo: periodo
            },
            raw: raw
        });
        return result;
    }
}