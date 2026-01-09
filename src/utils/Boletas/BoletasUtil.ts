import * as crypto from "crypto";

/**
 * Genera un hash único basado en los datos críticos de la planilla
 */
export const hashBoleta = (datosParaHash:any) => {
    const dataString = JSON.stringify(datosParaHash, Object.keys(datosParaHash).sort());
    return crypto.createHash('sha256').update(dataString).digest('hex');
}

export const orderDataPlanillaQuincena = (planilla:any) => {
    return {
        idPlanilla: planilla.idPlanilla,
        codEmpleado: planilla.codEmpleado,
        idPeriodo: planilla.idPeriodo,
        idEmpresa: planilla.idEmpresa,
        idDepartamento: planilla.departamento,
        diasLaborados: planilla.diasLaborados,
        salarioOrdinario: planilla.ordinario,
        horasSimples: planilla.sSimples || 0,
        horasDobles: planilla.sDobles || 0,
        bonificacion: planilla.bonifDecreto || 0,
        otrosIngresos: planilla.otrosIngresos || 0,
        neto: planilla.neto || 0,
        igss: planilla.igss || 0,
        isr: planilla.isr || 0,
        seguro: planilla.seguro || 0,
        ahorro: planilla.ahorro || 0,
        otrosDescuentos: planilla.otrosDescuentos || 0,
        liquido: planilla.liquido || 0
    }
}

/**
 * Genera los datos completos de la boleta para almacenar en base64
 */
export const generarDatosBoletaQuincena = (planilla: any, periodo: any): any => {
    return {
        idPlanilla: planilla.idPlanilla,
        codigoEmpleado: planilla.codigo,
        nombreEmpleado: planilla.empleado,
        departamento: planilla.departamento,
        periodo: periodo.nombrePeriodo,
        fechaInicio: periodo.fechaInicio,
        fechaFin: periodo.fechaFin,
        diasLaborados: planilla.diasLaborados,
        hSimples: planilla.hSimples,
        hDobles: planilla.hDobles,
        ordinario: planilla.ordinario || 0,
        extraordinarioSimple: planilla.sSimples || 0,
        extraordinarioDoble: planilla.sDobles || 0,
        otrosIngresos: planilla.otrosIngresos || 0,
        bonifDecreto: planilla.bonifDecreto || 0,
        totalIngresos: (planilla.ordinario || 0) + (planilla.sSimples || 0) + (planilla.sDobles || 0) + (planilla.otrosIngresos || 0) + (planilla.bonifDecreto || 0),
        igss: planilla.igss || 0,
        isr: planilla.isr || 0,
        seguro: planilla.seguro || 0,
        otrosDescuentos: planilla.otrosDescuentos || 0,
        ahorro: planilla.ahorro || 0,
        anticipos: planilla.anticipos || 0,
        totalDeducciones: (planilla.igss || 0) + (planilla.isr || 0) + (planilla.seguro || 0) + (planilla.otrosDescuentos || 0) + (planilla.ahorro || 0),
        liquido: planilla.liquido || 0,
        comentarios: planilla.comentarios || "",
        fechaHora: new Date().toISOString()
    };
}