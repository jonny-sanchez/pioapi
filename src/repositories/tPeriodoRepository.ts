import ItPeriodoRepository from "../interface/ItPeriodoRepository";
import tPeriodoModel from "../models/nomina/tables/tPeriodoModel";
import { injectable } from "tsyringe";
import { Op } from "sequelize";
import { PeriodosPagadosType } from "../types/PeriodosNomina/PeriodosPagadosType";

@injectable()
export default class tPeriodoRepository implements ItPeriodoRepository {

    async findById(idPeriodo: number, raw: boolean = false): Promise<tPeriodoModel | null> {
        const result = await tPeriodoModel.findByPk(idPeriodo, { raw });
        return result;
    }

    async findByActive(activo: boolean = true, raw: boolean = false): Promise<tPeriodoModel[]> {
        const result = await tPeriodoModel.findAll({
            where: { activo },
            order: [['fechaInicio', 'DESC']],
            raw
        });
        return result;
    }

    async findByPagada(pagada: boolean = false, raw: boolean = false): Promise<tPeriodoModel[]> {
        const result = await tPeriodoModel.findAll({
            where: { pagada },
            order: [['fechaInicio', 'DESC']],
            raw
        });
        return result;
    }

    async findCurrentPeriodo(raw: boolean = false): Promise<tPeriodoModel | null> {
        const today = new Date();
        const result = await tPeriodoModel.findOne({
            where: {
                activo: true,
                fechaInicio: { [Op.lte]: today },
                fechaFin: { [Op.gte]: today }
            },
            raw
        });
        return result;
    }

    async findByDateRange(fechaInicio: Date, fechaFin: Date, raw: boolean = false): Promise<tPeriodoModel[]> {
        const result = await tPeriodoModel.findAll({
            where: {
                [Op.or]: [
                    {
                        fechaInicio: { [Op.between]: [fechaInicio, fechaFin] }
                    },
                    {
                        fechaFin: { [Op.between]: [fechaInicio, fechaFin] }
                    }
                ]
            },
            order: [['fechaInicio', 'DESC']],
            raw
        });
        return result;
    }

    async findByQuincena(noQuincena: number, raw: boolean = false): Promise<tPeriodoModel[]> {
        const result = await tPeriodoModel.findAll({
            where: { noQuincena },
            order: [['fechaInicio', 'DESC']],
            raw
        });
        return result;
    }

    async marcarComoPagada(idPeriodo: number): Promise<boolean> {
        const [affectedRows] = await tPeriodoModel.update(
            { pagada: true },
            { where: { idPeriodo } }
        );
        return affectedRows > 0;
    }

    async activarPeriodo(idPeriodo: number): Promise<boolean> {
        const [affectedRows] = await tPeriodoModel.update(
            { activo: true },
            { where: { idPeriodo } }
        );
        return affectedRows > 0;
    }

    async desactivarPeriodo(idPeriodo: number): Promise<boolean> {
        const [affectedRows] = await tPeriodoModel.update(
            { activo: false },
            { where: { idPeriodo } }
        );
        return affectedRows > 0;
    }

    async getAll(raw: boolean = false): Promise<tPeriodoModel[]> {
        const result = await tPeriodoModel.findAll({
            order: [['fechaInicio', 'DESC']],
            raw
        });
        return result;
    }

    async findUltimosPeriodosPagados(limite: number = 10, raw: boolean = false): Promise<tPeriodoModel[]> {
        const result = await tPeriodoModel.findAll({
            where: { 
                pagada: true,
                activo: true
            },
            order: [['fechaInicio', 'DESC']],
            limit: limite,
            raw
        });
        return result;
    }

}