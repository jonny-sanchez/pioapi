import { col, fn, Op, where } from "sequelize";
import ItPeriodoEspecialBoletaRepository from "../interface/ItPeriodoEspecialBoletaRepository";
import tPeriodoEspecialBoletaModel from "../models/nomina/tables/tPeriodoEspecialBoletaModel";
import { injectable } from "tsyringe";

@injectable()
export default class tPeriodoEspecialBoletaRepository implements ItPeriodoEspecialBoletaRepository {

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