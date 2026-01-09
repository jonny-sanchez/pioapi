import { injectable } from "tsyringe";
import IAguinaldoRepository from "../interface/IAguinaldoRepository";
import { QueryTypes } from "sequelize";
import { sequelizeInit } from "../config/database";
import tAguinaldoModel from "../models/nomina/tables/tAguinaldoModel";

@injectable()
export default class AguinaldoRepository implements IAguinaldoRepository {

    async findByYearAndUser(year: number, codEmpleado: number, error: boolean = true, raw: boolean = false): Promise<tAguinaldoModel | null> {
         const result = await tAguinaldoModel.findOne({
            where: {
                codEmpleado,
                anio: year
            },
            raw
        })
        if(!result && error) throw new Error(`Error no se encontro ningun aguinaldo.`);
        return result
    }

    async findBoletaCompletaByEmpleadoAndPeriodo(codEmpleado: number, idPeriodo: number): Promise<any> {
        const sequelize = sequelizeInit('NOMINA');
        const result = await sequelize.query(
            `SELECT 
                t1.idAguinaldo as idPlanilla,
                t1.codEmpleado as codEmpleado,
                t3.nombreEmpleadoCompleto as empleado,
                t3.aliasCodigo as codigo,
                t3.codDepto as departamento,
                t2.idPeriodo as idPeriodo,
                0 as diasLaborados,
                0 as ordinario,
                0 as sSimples,
                0 as sDobles,
                0 as bonifDecreto,
                0 as otrosIngresos,
                0 as igss,
                0 as isr,
                0 as ahorro,
                0 as seguro,
                0 as otrosDescuentos,
                t1.liquido as liquido,
                0 as neto,
                t2.nombrePeriodo AS nombrePeriodo,
                CONCAT(FORMAT(t2.fechaInicio, 'dd/MM/yyyy'), ' al ', FORMAT(t2.fechaFin, 'dd/MM/yyyy')) AS rangoPeriodo,
                FORMAT(t2.fechaInicio, 'yyyy/MM/dd') AS fechaInicioPeriodo,
                FORMAT(t2.fechaFin, 'yyyy/MM/dd') AS fechaFinPeriodo,
                t2.pagada as pagada
                FROM tAguinaldo t1
                INNER JOIN tPeriodoEspecialBoleta as t2
                ON t1.anio = YEAR(t2.fechaFin)
                INNER JOIN vwDetalleEmpleado as t3
                ON t1.codEmpleado = t3.codEmpleado
                WHERE t1.codEmpleado = :codEmpleado AND t2.idPeriodo = :idPeriodo`,
            {
                replacements: { codEmpleado, idPeriodo },
                type: QueryTypes.SELECT,
                plain: true
            }
        );
        
        return result;
    }

}