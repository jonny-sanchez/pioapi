import { inject, injectable } from "tsyringe";
import { Transaction } from "sequelize";
import { userToken } from "../../types/ResponseTypes";
import FirmaBoletaPagoRepository from "../../repositories/FirmaBoletaPagoRepository";
import tPlanillaRepository from "../../repositories/tPlanillaRepository";
import tPeriodoRepository from "../../repositories/tPeriodoRepository";
import tFirmaBoletaRepository from "../../repositories/tFirmaBoletaRepository";
import { sequelizeInit } from "../../config/database";
import * as crypto from "crypto";
import { v4 as uuidv4 } from 'uuid';

export interface FirmaBoletaData {
    id_periodo: number;
    phone_gps_longitude: string;
    phone_gps_latitude: string;
    ip_dispositivo: string;
}

export interface BoletaFirmadaResponse {
    id_firma_boleta_pago: string;
    id_firma_boleta_pdv: number | null;
    empleado: string;
    periodo: string;
    monto_liquido: number;
    fecha_firma: Date;
    hash_boleta_firmada: string;
    firma_uuid: string | null;
}

@injectable()
export default class FirmaBoletaService {

    constructor(
        @inject(FirmaBoletaPagoRepository) private firmaBoletaPagoRepository: FirmaBoletaPagoRepository,
        @inject(tPlanillaRepository) private tPlanillaRepository: tPlanillaRepository,
        @inject(tPeriodoRepository) private tPeriodoRepository: tPeriodoRepository,
        @inject(tFirmaBoletaRepository) private tFirmaBoletaRepository: tFirmaBoletaRepository
    ) {}

    /**
     * Firma una boleta de pago por parte del empleado
     */
    async firmarBoleta(
        t: Transaction,
        data: FirmaBoletaData,
        user: userToken
    ): Promise<BoletaFirmadaResponse> {
        
        // 1. Validar que el período existe y está activo
        const periodo = await this.tPeriodoRepository.findById(data.id_periodo, true);
        if (!periodo) {
            throw new Error("El período especificado no existe.");
        }
        
        if (!periodo.activo) {
            throw new Error("El período no está activo para firmar boletas.");
        }

        if (!periodo.pagada) {
            throw new Error("Solo se pueden firmar boletas de períodos que ya han sido pagados.");
        }

        // 2. Obtener la planilla del empleado para este período
        const planilla = await this.tPlanillaRepository.findByEmpleadoAndPeriodo(
            Number(user.id_users), 
            data.id_periodo, 
            true
        );
        
        if (!planilla) {
            throw new Error("No se encontró planilla para este empleado en el período especificado.");
        }

        // 3. Verificar que no existe una firma válida previa en PostgreSQL
        const firmaExistente = await this.firmaBoletaPagoRepository.findByUserAndPeriodo(
            Number(user.id_users),
            data.id_periodo,
            true
        );

        if (firmaExistente) {
            throw new Error("Ya existe una firma válida para este empleado en este período.");
        }

        // 4. Verificar si ya existe una firma en el sistema PDV
        const firmaPdvExistente = await this.tFirmaBoletaRepository.findByEmpleadoAndPeriodo(
            Number(user.id_users),
            data.id_periodo,
            true
        );

        // 5. Generar hash de integridad y UUID para la firma
        const hashBoleta = this.generarHashBoleta(planilla);
        const firmaUuid = uuidv4();

        // 6. Crear el registro de firma en PostgreSQL (sistema principal)
        const firmaData = {
            id_users: user.id_users,
            id_periodo: data.id_periodo,
            phone_gps_longitude: data.phone_gps_longitude,
            phone_gps_latitude: data.phone_gps_latitude,
            hash_boleta_firmada: hashBoleta,
            userCreatedAt: user.id_users
        };

        const firma = await this.firmaBoletaPagoRepository.create(firmaData, t);
        
        if (!firma) {
            throw new Error("Error al registrar la firma de la boleta.");
        }

        // 7. Crear registro en tFirmaBoleta (SQL Server - PDV) solo si no existe
        let firmaPdv = null;
        if (!firmaPdvExistente) {
            try {
                const datosBoleta = this.generarDatosBoleta(planilla, periodo);
                const datosBolétaBase64 = Buffer.from(JSON.stringify(datosBoleta)).toString('base64');

                const firmaPdvData = {
                    empresa: "0000",
                    tienda: "0000",
                    // NO incluir FechaHora - se genera automáticamente por SQL Server 
                    codEmpleado: Number(user.id_users),
                    firma: firmaUuid,
                    idDispositivo: data.ip_dispositivo,
                    datosBoleta: datosBolétaBase64,
                    idPeriodo: data.id_periodo,
                    vigente: true
                };

                // Crear SIN transacción para evitar problemas de SQL Server
                // El registro PDV es secundario y no crítico
                firmaPdv = await this.tFirmaBoletaRepository.create(firmaPdvData, null);

                if (!firmaPdv) {
                    console.warn("No se pudo crear el registro en PDV, pero el proceso continúa.");
                }
            } catch (pdvError) {
                // Log del error pero no detener el proceso principal
                console.error("Error al guardar en sistema PDV:", pdvError);
                // Continuar sin fallar, ya que el registro principal (PostgreSQL) ya se guardó
                firmaPdv = null;
            }
        }

        // 8. Retornar respuesta estructurada
        return {
            id_firma_boleta_pago: firma.id_firma_boleta_pago,
            id_firma_boleta_pdv: firmaPdv ? firmaPdv.idFirmaBoleta : (firmaPdvExistente?.idFirmaBoleta || null),
            empleado: planilla.empleado,
            periodo: periodo.nombrePeriodo || `Período ${periodo.idPeriodo}`,
            monto_liquido: parseFloat(planilla.liquido?.toString() || "0"),
            fecha_firma: firma.createdAt,
            hash_boleta_firmada: hashBoleta,
            firma_uuid: firmaPdv ? firmaUuid : (firmaPdvExistente?.firma || null)
        };
    }

    /**
     * Obtiene el historial de firmas de un empleado
     */
    async obtenerHistorialFirmas(user: userToken): Promise<any[]> {
        const firmas = await this.firmaBoletaPagoRepository.findByUserId(Number(user.id_users), true);
        
        const historialPromises = firmas.map(async (firma) => {
            const periodo = await this.tPeriodoRepository.findById(firma.id_periodo, true);
            const planilla = await this.tPlanillaRepository.findByEmpleadoAndPeriodo(
                Number(user.id_users),
                firma.id_periodo,
                true
            );

            return {
                id_firma: firma.id_firma_boleta_pago,
                periodo: periodo?.nombrePeriodo || `Período ${firma.id_periodo}`,
                fecha_inicio: periodo?.fechaInicio,
                fecha_fin: periodo?.fechaFin,
                monto_liquido: parseFloat(planilla?.liquido?.toString() || "0"),
                fecha_firma: firma.createdAt,
                valido: firma.valido,
                motivo_invalidacion: firma.motivo_invalidacion
            };
        });

        return Promise.all(historialPromises);
    }

    /**
     * Verifica la integridad de una firma comparando el hash
     */
    async verificarIntegridad(id_firma_boleta_pago: string): Promise<boolean> {
        const firma = await this.firmaBoletaPagoRepository.findById(id_firma_boleta_pago);
        if (!firma) {
            throw new Error("Firma no encontrada.");
        }

        const planilla = await this.tPlanillaRepository.findByEmpleadoAndPeriodo(
            Number(firma.id_users),
            firma.id_periodo,
            true
        );

        if (!planilla) {
            throw new Error("No se encontró la planilla asociada a esta firma.");
        }

        const hashActual = this.generarHashBoleta(planilla);
        return hashActual === firma.hash_boleta_firmada;
    }

    /**
     * Invalida una firma existente
     */
    async invalidarFirma(
        id_firma_boleta_pago: string,
        motivo: string,
        t: Transaction
    ): Promise<boolean> {
        return await this.firmaBoletaPagoRepository.invalidarFirma(
            id_firma_boleta_pago,
            motivo,
            t
        );
    }

    /**
     * Genera los datos completos de la boleta para almacenar en base64
     */
    private generarDatosBoleta(planilla: any, periodo: any): any {
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

    /**
     * Genera un hash único basado en los datos críticos de la planilla
     */
    private generarHashBoleta(planilla: any): string {
        const datosParaHash = {
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
        };

        const dataString = JSON.stringify(datosParaHash, Object.keys(datosParaHash).sort());
        return crypto.createHash('sha256').update(dataString).digest('hex');
    }

    /**
     * Verifica si existe una firma válida para un empleado en un periodo específico
     */
    async verificarFirmaExistente(id_users: number, id_periodo: number): Promise<{
        existe: boolean,
        firma?: {
            id_firma_boleta_pago: string,
            fecha_firma: Date,
            valido: boolean,
            motivo_invalidacion?: string
        }
    }> {
        // Buscar firma en la base de datos principal
        const firmaExistente = await this.firmaBoletaPagoRepository.findByUserAndPeriodo(
            id_users, 
            id_periodo, 
            true
        );

        if (!firmaExistente) {
            return { existe: false };
        }

        const firmaData: {
            id_firma_boleta_pago: string,
            fecha_firma: Date,
            valido: boolean,
            motivo_invalidacion?: string
        } = {
            id_firma_boleta_pago: firmaExistente.id_firma_boleta_pago,
            fecha_firma: firmaExistente.createdAt,
            valido: firmaExistente.valido
        };

        if (firmaExistente.motivo_invalidacion) {
            firmaData.motivo_invalidacion = firmaExistente.motivo_invalidacion;
        }

        return {
            existe: true,
            firma: firmaData
        };
    }

}