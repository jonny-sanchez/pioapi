import { injectable } from "tsyringe";
import IPeriodoVacacionRepository from "../interface/IPeriodoVacacionRepository";
import PeriodoVacacionView from "../models/nomina/views/PeriodoVacacionView";

@injectable()
export default class PeriodoVacacionRepository implements IPeriodoVacacionRepository {

    async getByUser(codEmpleado: number, raw: boolean = false, include: any[] = []): Promise<PeriodoVacacionView[]> {
        const result = await PeriodoVacacionView.findAll({
            where: { 
                codEmpleado
            },
            include,
            raw
        })
        return result
    }

    async findById(idPeriodo: number, raw: boolean = false): Promise<PeriodoVacacionView|null> {
        const result = await PeriodoVacacionView.findByPk(idPeriodo, { raw })
        return result
    }

}