import { inject, injectable } from "tsyringe";
import tPlanillaRepository from "../../repositories/tPlanillaRepository";
import FirmaBoletaPagoRepository from "../../repositories/FirmaBoletaPagoRepository";

export interface ResumenPagoResponse {
    nombrePeriodo: string | null;
    totalRecibido: number;
    numeroBoleta: number;
    periodo: string;
    diasTrabajados: number;
    descuentos: {
        igss: number;
        isr: number;
        ahorro: number;
        seguro: number;
        otrosDescuentos: number;
        totalDescuentos: number;
    };
}

export interface DetalleCompletoResponse {
    numeroBoleta: number;
    empleado: {
        codigo: string | null;
        nombre: string | null;
    };
    periodo: {
        id: number;
        nombre: string | null;
        rango: string;
        fechaInicio: string;
        fechaFin: string;
    };
    diasTrabajados: number;
    firma?: {
        idFirmaBoleta: string;
        fechaFirma: Date;
        valido: boolean;
    };
    ingresos: {
        salarioOrdinario: number;
        horasSimples: number;
        horasDobles: number;
        bonificacion: number;
        otrosIngresos: number;
        totalIngresos: number;
    };
    descuentos: {
        igss: number;
        isr: number;
        ahorro: number;
        seguro: number;
        otrosDescuentos: number;
        totalDescuentos: number;
    };
    neto: number;
    liquido: number;
}

@injectable()
export default class BoletaConsultaService {

    constructor(
        @inject(tPlanillaRepository) private tPlanillaRepository: tPlanillaRepository,
        @inject(FirmaBoletaPagoRepository) private firmaBoletaRepository: FirmaBoletaPagoRepository
    ) {}

    /**
     * Obtener resumen de pago por empleado y periodo
     */
    async obtenerResumenPago(codEmpleado: number, idPeriodo: number): Promise<ResumenPagoResponse> {
        const boleta = await this.tPlanillaRepository.findBoletaCompletaByEmpleadoAndPeriodo(
            codEmpleado, 
            idPeriodo
        );

        if (!boleta) {
            throw new Error("No se encontró información de pago para este empleado en el periodo especificado");
        }

        const totalDescuentos = (boleta.igss || 0) + (boleta.isr || 0) + (boleta.ahorro || 0) + 
                               (boleta.seguro || 0) + (boleta.otrosDescuentos || 0);

        const fechaInicio = new Date(boleta.fechaInicio).toLocaleDateString('es-GT');
        const fechaFin = new Date(boleta.fechaFin).toLocaleDateString('es-GT');

        return {
            nombrePeriodo: boleta.nombrePeriodo,
            totalRecibido: boleta.liquido || 0,
            numeroBoleta: boleta.idPlanilla,
            periodo: `${fechaInicio} - ${fechaFin}`,
            diasTrabajados: boleta.diasLaborados || 0,
            descuentos: {
                igss: boleta.igss || 0,
                isr: boleta.isr || 0,
                ahorro: boleta.ahorro || 0,
                seguro: boleta.seguro || 0,
                otrosDescuentos: boleta.otrosDescuentos || 0,
                totalDescuentos
            }
        };
    }

    /**
     * Obtener detalle completo de pago por empleado y periodo
     */
    async obtenerDetalleCompleto(
        idUsers: number, 
        codEmpleado: number, 
        idPeriodo: number
    ): Promise<DetalleCompletoResponse> {
        const boleta = await this.tPlanillaRepository.findBoletaCompletaByEmpleadoAndPeriodo(
            codEmpleado, 
            idPeriodo
        );

        if (!boleta) {
            throw new Error("No se encontró información de pago para este empleado en el periodo especificado");
        }

        // Buscar si existe firma para esta boleta
        const firma = await this.firmaBoletaRepository.findByUserAndPeriodo(idUsers, idPeriodo);

        const totalIngresos = (boleta.ordinario || 0) + (boleta.sSimples || 0) + 
                             (boleta.sDobles || 0) + (boleta.bonifDecreto || 0) + 
                             (boleta.otrosIngresos || 0);

        const totalDescuentos = (boleta.igss || 0) + (boleta.isr || 0) + (boleta.ahorro || 0) + 
                               (boleta.seguro || 0) + (boleta.otrosDescuentos || 0);

        const response: DetalleCompletoResponse = {
            numeroBoleta: boleta.idPlanilla,
            empleado: {
                codigo: boleta.codigo?.trim() || null,
                nombre: boleta.empleado?.trim() || null
            },
            periodo: {
                id: boleta.idPeriodo,
                nombre: boleta.nombrePeriodo,
                rango: boleta.rangoPeriodo,
                fechaInicio: boleta.fechaInicioPeriodo,
                fechaFin: boleta.fechaFinPeriodo
            },
            diasTrabajados: boleta.diasLaborados || 0,
            ingresos: {
                salarioOrdinario: boleta.ordinario || 0,
                horasSimples: boleta.sSimples || 0,
                horasDobles: boleta.sDobles || 0,
                bonificacion: boleta.bonifDecreto || 0,
                otrosIngresos: boleta.otrosIngresos || 0,
                totalIngresos
            },
            descuentos: {
                igss: boleta.igss || 0,
                isr: boleta.isr || 0,
                ahorro: boleta.ahorro || 0,
                seguro: boleta.seguro || 0,
                otrosDescuentos: boleta.otrosDescuentos || 0,
                totalDescuentos
            },
            neto: boleta.neto || 0,
            liquido: boleta.liquido || 0
        };

        // Agregar información de firma si existe
        if (firma) {
            response.firma = {
                idFirmaBoleta: firma.id_firma_boleta_pago,
                fechaFirma: firma.createdAt,
                valido: firma.valido
            };
        }

        return response;
    }

    /**
     * Verificar si existe información de pago para un empleado en un periodo
     */
    async verificarExistenciaBoleta(codEmpleado: number, idPeriodo: number): Promise<{
        existe: boolean;
        pagado?: boolean;
    }> {
        const boleta = await this.tPlanillaRepository.findBoletaCompletaByEmpleadoAndPeriodo(
            codEmpleado, 
            idPeriodo
        );

        if (!boleta) {
            return { existe: false };
        }

        return {
            existe: true,
            pagado: boleta.pagada || false
        };
    }

}