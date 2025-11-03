import ItPlanillaRepository from "../interface/ItPlanillaRepository";
import tPlanillaModel from "../models/nomina/tables/tPlanillaModel";
import { injectable } from "tsyringe";
import { sequelizeInit } from "../config/database";
import { QueryTypes } from "sequelize";

@injectable()
export default class tPlanillaRepository implements ItPlanillaRepository {

    async findById(idPlanilla: number, raw: boolean = false): Promise<tPlanillaModel | null> {
        const result = await tPlanillaModel.findByPk(idPlanilla, { raw });
        return result;
    }

    async findByEmpleadoAndPeriodo(
        codEmpleado: number, 
        idPeriodo: number, 
        raw: boolean = false
    ): Promise<tPlanillaModel | null> {
        const result = await tPlanillaModel.findOne({
            where: {
                codEmpleado,
                idPeriodo
            },
            raw
        });
        return result;
    }

    async findByEmpleado(codEmpleado: number, raw: boolean = false): Promise<tPlanillaModel[]> {
        const result = await tPlanillaModel.findAll({
            where: { codEmpleado },
            order: [['idPeriodo', 'DESC']],
            raw
        });
        return result;
    }

    async findByPeriodo(idPeriodo: number, raw: boolean = false): Promise<tPlanillaModel[]> {
        const result = await tPlanillaModel.findAll({
            where: { idPeriodo },
            order: [['empleado', 'ASC']],
            raw
        });
        return result;
    }

    async findByEmpresa(idEmpresa: number, raw: boolean = false): Promise<tPlanillaModel[]> {
        const result = await tPlanillaModel.findAll({
            where: { idEmpresa },
            order: [['idPeriodo', 'DESC'], ['empleado', 'ASC']],
            raw
        });
        return result;
    }

    async findByDepartamento(departamento: string, raw: boolean = false): Promise<tPlanillaModel[]> {
        const result = await tPlanillaModel.findAll({
            where: { departamento },
            order: [['idPeriodo', 'DESC'], ['empleado', 'ASC']],
            raw
        });
        return result;
    }

    async findByEmpresaAndPeriodo(
        idEmpresa: number, 
        idPeriodo: number, 
        raw: boolean = false
    ): Promise<tPlanillaModel[]> {
        const result = await tPlanillaModel.findAll({
            where: {
                idEmpresa,
                idPeriodo
            },
            order: [['empleado', 'ASC']],
            raw
        });
        return result;
    }

    async calculateTotalLiquidoByPeriodo(idPeriodo: number): Promise<number> {
        const sequelize = sequelizeInit('NOMINA');
        const result = await sequelize.query(
            `SELECT ISNULL(SUM(liquido), 0) as total FROM dbo.tPlanilla WHERE idPeriodo = :idPeriodo`,
            {
                replacements: { idPeriodo },
                type: QueryTypes.SELECT,
                plain: true
            }
        ) as any;
        
        return parseFloat(result?.total || 0);
    }

    async getEmpleadosSinPlanilla(idPeriodo: number): Promise<any[]> {
        const sequelize = sequelizeInit('NOMINA');
        const result = await sequelize.query(
            `SELECT e.codEmpleado, e.nombreEmpleado, e.apellidoEmpleado 
             FROM dbo.tEmpleado e 
             LEFT JOIN dbo.tPlanilla p ON e.codEmpleado = p.codEmpleado AND p.idPeriodo = :idPeriodo
             WHERE p.codEmpleado IS NULL AND e.activo = 1`,
            {
                replacements: { idPeriodo },
                type: QueryTypes.SELECT
            }
        );
        
        return result;
    }

    async getAll(raw: boolean = false): Promise<tPlanillaModel[]> {
        const result = await tPlanillaModel.findAll({
            order: [['idPeriodo', 'DESC'], ['empleado', 'ASC']],
            raw
        });
        return result;
    }

    /**
     * Obtener información completa de la boleta con datos del periodo
     */
    async findBoletaCompletaByEmpleadoAndPeriodo(
        codEmpleado: number, 
        idPeriodo: number
    ): Promise<any> {
        const sequelize = sequelizeInit('NOMINA');
        const result = await sequelize.query(
            `SELECT 
                p.idPlanilla,
                p.codEmpleado,
                p.empleado,
                p.codigo,
                p.departamento,
                p.idPeriodo,
                p.diasLaborados,
                p.ordinario,
                p.sSimples,
                p.sDobles,
                p.bonifDecreto,
                p.otrosIngresos,
                p.igss,
                p.isr,
                p.ahorro,
                p.seguro,
                p.otrosDescuentos,
                p.liquido,
                p.neto,
                per.nombrePeriodo AS nombrePeriodo,
                CONCAT(FORMAT(per.fechaInicio, 'dd/MM/yyyy'), ' al ', FORMAT(per.fechaFin, 'dd/MM/yyyy')) AS rangoPeriodo,
                FORMAT(per.fechaInicio, 'yyyy/MM/dd') AS fechaInicioPeriodo,
                FORMAT(per.fechaFin, 'yyyy/MM/dd') AS fechaFinPeriodo,
                per.pagada
            FROM dbo.tPlanilla p
            INNER JOIN dbo.tPeriodo per ON p.idPeriodo = per.idPeriodo
            WHERE p.codEmpleado = :codEmpleado AND p.idPeriodo = :idPeriodo`,
            {
                replacements: { codEmpleado, idPeriodo },
                type: QueryTypes.SELECT,
                plain: true
            }
        );
        
        return result;
    }

}