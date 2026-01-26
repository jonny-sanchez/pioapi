import { col, fn, Op, where } from "sequelize";
import ItPeriodoEspecialBoletaRepository from "../interface/ItPeriodoEspecialBoletaRepository";
import tPeriodoEspecialBoletaModel from "../models/nomina/tables/tPeriodoEspecialBoletaModel";
import { injectable } from "tsyringe";

@injectable()
export default class tPeriodoEspecialBoletaRepository implements ItPeriodoEspecialBoletaRepository {

    async paginateAndSearch(search: string | null, cursor: number | null, limit: number, raw: boolean, tipo:1212|7777): Promise<tPeriodoEspecialBoletaModel[]> {
        const where: any = {};
        if (search) where.nombrePeriodo = { [Op.like]: `%${search.trim()}%` }
        if (cursor) where.idPeriodo = { [Op.lt]: cursor }
        // if (cursor) where.idPeriodo = {...(where?.idPeriodo || {}), [Op.gt]: cursor }
        const result = await tPeriodoEspecialBoletaModel.findAll({
            where: {
                ...where,
                pagada: true,
                activo: true,
                tipo: tipo
            },
            limit,
            raw,
            order: [['idPeriodo', 'DESC']]
        })
        return result
    }

    async getByYear(year: number, raw: boolean = false): Promise<tPeriodoEspecialBoletaModel[]> {
        const result = await tPeriodoEspecialBoletaModel.findAll({
            where: where(
                fn('YEAR', col('fechaFin')),
                { [Op.eq]: year }
            ),
            order: [['fechaFin', 'DESC']],
            raw
        })
        return result
    }

    async find(idPeriodo: number, error: boolean = true, raw: boolean = false): Promise<tPeriodoEspecialBoletaModel | null> {
        const result = await tPeriodoEspecialBoletaModel.findByPk(idPeriodo)
        if(!result && error) throw new Error(`Error no se encontro ningun periodo con id: ${ idPeriodo }`)
        return raw ? result?.get({ plain: true }) : result 
    }

}