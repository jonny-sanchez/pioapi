import { col, fn, Op, Transaction, where } from "sequelize";
import ItFirmaBoletaRepository from "../interface/ItFirmaBoletaRepository";
import tFirmaBoletaModel from "../models/pdv/tables/tFirmaBoletaModel";
import { injectable } from "tsyringe";
import { TipoPeriodoEnum } from "../types/PeriodosNomina/PeriodosPagadosType";

@injectable()
export default class tFirmaBoletaRepository implements ItFirmaBoletaRepository {

    async create(data: any, t: Transaction | null = null): Promise<tFirmaBoletaModel | null> {
        // Excluir FechaHora del INSERT - SQL Server lo generará automáticamente
        const { FechaHora, ...dataWithoutFechaHora } = data;
        const result = await tFirmaBoletaModel.create(dataWithoutFechaHora, { transaction: t });
        if (!result) throw new Error("Error al crear la firma de boleta PDV.");
        return result;
    }

    async findByEmpleadoAndPeriodo(
        codEmpleado: number, 
        idPeriodo: number, 
        vigente: boolean = true, 
        raw: boolean = false
    ): Promise<tFirmaBoletaModel | null> {
        const result = await tFirmaBoletaModel.findOne({
            where: {
                codEmpleado,
                idPeriodo,
                vigente
            },
            raw
        });
        return result;
    }

    async findByTiendaAndPeriodo(
        empresa: string, 
        tienda: string, 
        idPeriodo: number, 
        raw: boolean = false
    ): Promise<tFirmaBoletaModel[]> {
        const result = await tFirmaBoletaModel.findAll({
            where: {
                empresa,
                tienda,
                idPeriodo,
                vigente: true
            },
            order: [['FechaHora', 'DESC']],
            raw
        });
        return result;
    }

    async findByEmpleado(codEmpleado: number, raw: boolean = false): Promise<tFirmaBoletaModel[]> {
        const result = await tFirmaBoletaModel.findAll({
            where: { codEmpleado },
            order: [['FechaHora', 'DESC']],
            raw
        });
        return result;
    }

    async findById(idFirmaBoleta: number, raw: boolean = false): Promise<tFirmaBoletaModel | null> {
        const result = await tFirmaBoletaModel.findByPk(idFirmaBoleta, { raw });
        return result;
    }

    async invalidarFirma(idFirmaBoleta: number, t: Transaction | null = null): Promise<boolean> {
        const [affectedRows] = await tFirmaBoletaModel.update(
            { vigente: false },
            { 
                where: { idFirmaBoleta }, 
                transaction: t 
            }
        );
        return affectedRows > 0;
    }

    async findByDispositivo(idDispositivo: string, raw: boolean = false): Promise<tFirmaBoletaModel[]> {
        const result = await tFirmaBoletaModel.findAll({
            where: { idDispositivo },
            order: [['FechaHora', 'DESC']],
            raw
        });
        return result;
    }

    async getAll(raw: boolean = false): Promise<tFirmaBoletaModel[]> {
        const result = await tFirmaBoletaModel.findAll({
            order: [['FechaHora', 'DESC']],
            raw
        });
        return result;
    }

    async findOrCreateByYearAndTipo(
        year: number, 
        tipo: number, 
        codEmpleado:number, 
        idPeriodo:number,
        data: Partial<tFirmaBoletaModel>, 
        t: Transaction | null = null, 
        raw: boolean = false
    ): Promise<tFirmaBoletaModel> {
        let firma = await tFirmaBoletaModel.findOne({
          where: {
            [Op.and]: [
              ...((tipo == TipoPeriodoEnum.BONO14 || tipo == TipoPeriodoEnum.AGUINALDO) ? [where(fn('YEAR', col('FechaHora')), year)] : []),
              { tipo },
              { codEmpleado },
              { idPeriodo }
            ]
          },
          transaction: t
        })
        if(!firma) firma = await tFirmaBoletaModel.create(data, { transaction: t })
        return raw ? firma.get({ plain: true }) : firma 
    }

}