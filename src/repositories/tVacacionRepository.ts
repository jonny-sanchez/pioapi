import { injectable } from "tsyringe";
import ItVacacionRepository from "../interface/ItVacacionRepository";
import { sequelizeInit } from "../config/database";
import { QueryTypes } from "sequelize";
import tVacacionModel from "../models/nomina/tables/tVacacionModel";

@injectable()
export default class tVacacionRepository implements ItVacacionRepository {

    async findPlanillaVacacion(idVacacion: number, error: boolean = true, raw: boolean = false): Promise<tVacacionModel|null> {
        const result = await tVacacionModel.findByPk(idVacacion)
        if(result && error) throw new Error(`No se encontro ningun planilla de vacaciones.`);
        return raw ? result?.get({ plain: true }) : result
    }

    async findBoletaCompletaByEmpleadoAndPeriodo(codEmpleado: number, idPeriodo: number): Promise<any> {
        const sequelize = sequelizeInit('NOMINA')
        const result = await sequelize.query(
            `SELECT 
                p.idVacacion as idPlanilla,
                p.codEmpleado,
                emp.nombreEmpleadoCompleto as empleado,
                emp.aliasCodigo as codigo,
                emp.codDepto as departamento,
                per.idPeriodo,
                0 as diasLaborados,
                0 as ordinario,
                0 as anticipo,
                0 as sSimples,
                0 as sDobles,
                0 as bonifDecreto,
                (vacacion + 150) as otrosIngresos,
                CAST(vacacion * 0.0483 as DECIMAL(10, 2)) as igss,
                0 as isr,
                0 as ahorro,
                0 as seguro,
                0 as otrosDescuentos,
                CAST((vacacion + 150) - (vacacion * 0.0483) AS DECIMAL(10,2)) as liquido,
                0 as neto,
                per.nombrePeriodo AS nombrePeriodo,
                CONCAT(FORMAT(per.fechaInicio, 'dd/MM/yyyy'), ' al ', FORMAT(per.fechaFin, 'dd/MM/yyyy')) AS rangoPeriodo,
                FORMAT(per.fechaInicio, 'yyyy/MM/dd') AS fechaInicioPeriodo,
                FORMAT(per.fechaFin, 'yyyy/MM/dd') AS fechaFinPeriodo,
                per.pagada
            FROM dbo.tVacacion p
            INNER JOIN dbo.vwPeriodoVacacion per ON p.idVacacion = per.idPeriodo
            INNER JOIN dbo.vwDetalleEmpleado emp ON p.codEmpleado = emp.codEmpleado
            WHERE p.codEmpleado = :codEmpleado AND p.idVacacion = :idPeriodo`,
            {
                replacements: { codEmpleado, idPeriodo },
                type: QueryTypes.SELECT,
                plain: true
            }
        );
        
        return result;

    }
    
}