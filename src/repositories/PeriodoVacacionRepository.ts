import { injectable } from "tsyringe";
import IPeriodoVacacionRepository from "../interface/IPeriodoVacacionRepository";
import PeriodoVacacionView from "../models/nomina/views/PeriodoVacacionView";
import { Op } from "sequelize";

@injectable()
export default class PeriodoVacacionRepository implements IPeriodoVacacionRepository {

    async paginateAndSearch(search: string|null, cursor: number|null, limit: number, raw:boolean, codEmpleado:number): Promise<PeriodoVacacionView[]> {
        const where: any = {};
        if (search) where.nombrePeriodo = { [Op.like]: `%${search.trim()}%` }
        if (cursor) where.idPeriodo = { [Op.lt]: cursor }
        // if (cursor) where.idPeriodo = {...(where?.idPeriodo || {}), [Op.gt]: cursor }
        const result = await PeriodoVacacionView.findAll({
            where: {
                ...where,
                pagada: true,
                activo: true,
                codEmpleado
            },
            limit,
            raw,
            order: [['idPeriodo', 'DESC']]
        })
        return result
    }

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