import { inject, injectable } from "tsyringe";
import { literal, Transaction } from "sequelize";
import { userToken } from "../../types/ResponseTypes";
import FirmaBoletaPagoRepository from "../../repositories/FirmaBoletaPagoRepository";
import tPlanillaRepository from "../../repositories/tPlanillaRepository";
import tPeriodoRepository from "../../repositories/tPeriodoRepository";
import tFirmaBoletaRepository from "../../repositories/tFirmaBoletaRepository";
import { sequelizeInit } from "../../config/database";
import * as crypto from "crypto";
import { v4 as uuidv4 } from 'uuid';
import tPeriodoEspecialBoletaRepository from "../../repositories/tPeriodoEspecialBoletaRepository";
import { TipoPeriodoEnum } from "../../types/PeriodosNomina/PeriodosPagadosType";
import { FirmaBoletaDtoType } from "../../dtos/FirmaBoletaDto";
import Bono14Repository from "../../repositories/Bono14Repository";
import AguinaldoRepository from "../../repositories/AguinaldoRepository";
import { generarDatosBoletaQuincena, hashBoleta, orderDataPlanillaQuincena } from "../../utils/Boletas/BoletasUtil";
import PeriodoVacacionRepository from "../../repositories/PeriodoVacacionRepository";
import tVacacionRepository from "../../repositories/tVacacionRepository";
import tPlanillaModel from "../../models/nomina/tables/tPlanillaModel";
import tBono14Model from "../../models/nomina/tables/tBono14Model";
import tAguinaldoModel from "../../models/nomina/tables/tAguinaldoModel";
import tVacacionModel from "../../models/nomina/tables/tVacacionModel";

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

interface VerificarFirmaExistenteResponse {
    existe: boolean,
    firma?: {
        id_firma_boleta_pago: string,
        fecha_firma: Date,
        valido: boolean,
        motivo_invalidacion?: string
    }
}

@injectable()
export default class FirmaBoletaService {

    constructor(
        @inject(FirmaBoletaPagoRepository) private firmaBoletaPagoRepository: FirmaBoletaPagoRepository,
        @inject(tPlanillaRepository) private tPlanillaRepository: tPlanillaRepository,
        @inject(tPeriodoRepository) private tPeriodoRepository: tPeriodoRepository,
        @inject(tFirmaBoletaRepository) private tFirmaBoletaRepository: tFirmaBoletaRepository,
        @inject(tPeriodoEspecialBoletaRepository) private periodoEspecialBoletaRepository:tPeriodoEspecialBoletaRepository,
        @inject(Bono14Repository) private bono14Repository:Bono14Repository,
        @inject(AguinaldoRepository) private aguinaldoRepository:AguinaldoRepository,
        @inject(PeriodoVacacionRepository) private periodoVacacionRepository:PeriodoVacacionRepository,
        @inject(tVacacionRepository) private vacacionRepository:tVacacionRepository  
    ) {}

    /**
     * Firma una boleta de pago por parte del empleado
     */
    async firmarBoleta(
        // data: FirmaBoletaData,
        data: FirmaBoletaDtoType,
        user: userToken
    )
    : Promise<BoletaFirmadaResponse> 
    {
        const tPioapp = await sequelizeInit('PIOAPP').transaction()
        const tPdv = await sequelizeInit('PDV').transaction()
        try {

            const isQuincena = TipoPeriodoEnum.QUINCENA == data.tipo
            const isBono14 = TipoPeriodoEnum.BONO14 == data.tipo
            const isAguinaldo = TipoPeriodoEnum.AGUINALDO == data.tipo
            const isVacacion = TipoPeriodoEnum.VACACION == data.tipo
            let periodo = null
            let planilla = null
            
            // 1. Validar que el período existe y está activo
            if(isQuincena) periodo = await this.tPeriodoRepository.findById(data.id_periodo, true);
            if(isAguinaldo || isBono14) periodo = await this.periodoEspecialBoletaRepository.find(data.id_periodo, false, true)
            if(isVacacion) periodo = await this.periodoVacacionRepository.findById(data.id_periodo, true)

            //validaciones de periodo
            if (!periodo) throw new Error("El período especificado no existe.");
            if (!periodo.activo) throw new Error("El período no está activo para firmar boletas.");
            if (!periodo.pagada) throw new Error("Solo se pueden firmar boletas de períodos que ya han sido pagados.");

            //obtner year del periodo
            const year = Number(new Date(periodo?.fechaFin ?? "").getFullYear() ?? 0)

            // 2. Obtener la planilla del empleado para este período
            if(isQuincena) planilla = await this.tPlanillaRepository.findByEmpleadoAndPeriodo(
                    Number(user.id_users), data.id_periodo, true
                )
            if(isBono14) planilla = await this.bono14Repository.findByYearAndUser(
                    year, Number(user.id_users), false, true
                )
            if(isAguinaldo) planilla = await this.aguinaldoRepository.findByYearAndUser(
                    year, Number(user.id_users), false, true
                )
            if(isVacacion) planilla = await this.vacacionRepository.findPlanillaVacacion(
                periodo?.idPeriodo ?? 0, false, true
            )

            if (!planilla) throw new Error("No se encontró planilla para este empleado en el período especificado.");

            //datos para firma pioapp
            const dataHash = isQuincena ? orderDataPlanillaQuincena(planilla) : planilla
            const hash = hashBoleta(dataHash)
            //datos para firma pdv
            const firmaUuid = uuidv4()
            const datosBoleta = isQuincena ? generarDatosBoletaQuincena(planilla, periodo) : {...planilla, ...periodo};
            const datosBoletaBase64 = Buffer.from(JSON.stringify(datosBoleta)).toString('base64')
            const periodoPdv = {
                [TipoPeriodoEnum.QUINCENA]: data.id_periodo,
                [TipoPeriodoEnum.AGUINALDO]: 1212,
                [TipoPeriodoEnum.BONO14]: 7777,
                [TipoPeriodoEnum.VACACION]: 8888
            }

            const firmaPioapp = await this.firmaBoletaPagoRepository.findOrCreate(
                { id_users: Number(user.id_users), id_periodo: data.id_periodo, id_tipo_boleta: data?.tipo || TipoPeriodoEnum.QUINCENA },
                { 
                    id_users: Number(user.id_users),
                    id_periodo: data.id_periodo,
                    phone_gps_longitude: data.phone_gps_longitude,
                    phone_gps_latitude: data.phone_gps_latitude,
                    hash_boleta_firmada: hash,
                    userCreatedAt: Number(user.id_users),
                    id_tipo_boleta: data?.tipo || TipoPeriodoEnum.QUINCENA 
                },
                tPioapp,
                true
            )

            if(!firmaPioapp) throw new Error(`Error al crear la firma en Pioapp.`);

            const firmaPdv = await this.tFirmaBoletaRepository.findOrCreateByYearAndTipo(
                year, data?.tipo || TipoPeriodoEnum.QUINCENA, Number(user.id_users), periodoPdv[data.tipo as TipoPeriodoEnum],
                {
                    empresa: "0000",
                    tienda: "0000",
                    ...(isQuincena ? {} : { FechaHora: literal(`CAST('${periodo.fechaFin}' as DATETIME)`) }),
                    codEmpleado: Number(user.id_users),
                    firma: firmaUuid,
                    idDispositivo: data.ip_dispositivo,
                    datosBoleta: datosBoletaBase64,
                    idPeriodo: periodoPdv[data.tipo as TipoPeriodoEnum],
                    vigente: true,
                    tipo: data?.tipo || TipoPeriodoEnum.QUINCENA 
                }, 
                tPdv, true
            )

            if(!firmaPioapp) throw new Error(`Error al crear la firma en Pdv.`);
            
            await tPioapp.commit()
            await tPdv.commit()
            
            // 8. Retornar respuesta estructurada
            const liquido = isVacacion 
                ? (planilla as tVacacionModel).vacacionLiquido 
                : (planilla as tPlanillaModel | tBono14Model | tAguinaldoModel).liquido
            
            return {
                id_firma_boleta_pago: firmaPioapp.id_firma_boleta_pago,
                id_firma_boleta_pdv: firmaPdv?.idFirmaBoleta ?? null,
                empleado: (planilla as any)?.empleado ?? '',
                periodo: periodo.nombrePeriodo || `Período ${periodo.idPeriodo}`,
                monto_liquido: parseFloat(liquido?.toString() || "0"),
                fecha_firma: firmaPioapp.createdAt,
                hash_boleta_firmada: hash,
                firma_uuid: firmaPdv?.firma || firmaUuid || null,
                // hola: firmaPdv
            };
            
        } catch (error) {
            await tPioapp.rollback()
            await tPdv.rollback()
            throw error
        }
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

        const planillaOrdenada = orderDataPlanillaQuincena(planilla)
        const hashActual = hashBoleta(planillaOrdenada)
        // const hashActual = this.generarHashBoleta(planilla);
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
     * Verifica si existe una firma válida para un empleado en un periodo específico
     */
    async verificarFirmaExistente(id_users: number, id_periodo: number, tipo:number): Promise<VerificarFirmaExistenteResponse> {
        // Buscar firma en la base de datos principal
        const firmaExistente = await this.firmaBoletaPagoRepository.findByUserAndPeriodo(
            id_users, 
            id_periodo, 
            true,
            false,
            tipo
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