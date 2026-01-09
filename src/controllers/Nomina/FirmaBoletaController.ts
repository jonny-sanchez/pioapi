import { inject, injectable } from "tsyringe";
import FirmaBoletaService from "../../services/Nomina/FirmaBoletaService";
import { JsonResponse, RequestAuth, userToken } from "../../types/ResponseTypes";
import { Response } from "express";
import { handleSend } from "../../utils/HandlerFactory";
import { Transaction } from "sequelize";
import { FirmaBoletaDtoType, InvalidarFirmaDtoType, VerificarIntegridadDtoType } from "../../dtos/FirmaBoletaDto";
import { VerificarFirmaExistenteType } from "../../dtos/VerificarFirmaExistenteDto";
import { TipoPeriodoEnum } from "../../types/PeriodosNomina/PeriodosPagadosType";

@injectable()
export default class FirmaBoletaController {

    constructor(
        @inject(FirmaBoletaService) private firmaBoletaService: FirmaBoletaService
    ) {}

    /**
     * Endpoint para firmar una boleta de pago
     */
    async firmarBoleta(req: RequestAuth, res: Response<JsonResponse<any>>) {
        await handleSend(res, async () => {
            const result = await this.firmaBoletaService.firmarBoleta(
                req.body as FirmaBoletaDtoType,
                req.user as userToken
            );
            return result;
        }, 'Boleta firmada exitosamente.');
    }

    /**
     * Endpoint para obtener el historial de firmas del empleado
     */
    async obtenerHistorialFirmas(req: RequestAuth, res: Response<JsonResponse<any[]>>) {
        await handleSend(res, async () => {
            const result = await this.firmaBoletaService.obtenerHistorialFirmas(
                req.user as userToken
            );
            return result;
        }, 'Historial de firmas obtenido correctamente.');
    }

    /**
     * Endpoint para verificar la integridad de una firma
     */
    async verificarIntegridad(req: RequestAuth, res: Response<JsonResponse<any>>) {
        await handleSend(res, async () => {
            const esValida = await this.firmaBoletaService.verificarIntegridad(
                (req.body as VerificarIntegridadDtoType).id_firma_boleta_pago
            );
            return {
                id_firma_boleta_pago: (req.body as VerificarIntegridadDtoType).id_firma_boleta_pago,
                integridad_valida: esValida,
                mensaje: esValida 
                    ? 'La firma mantiene su integridad.' 
                    : 'La firma ha sido comprometida o los datos han cambiado.'
            };
        }, 'Verificación de integridad completada.');
    }

    /**
     * Endpoint para invalidar una firma (solo admin)
     */
    async invalidarFirma(req: RequestAuth, res: Response<JsonResponse<any>>) {
        await handleSend(res, async (t) => {
            const { id_firma_boleta_pago, motivo } = req.body as InvalidarFirmaDtoType;
            const result = await this.firmaBoletaService.invalidarFirma(
                id_firma_boleta_pago,
                motivo,
                t as Transaction
            );
            
            return {
                id_firma_boleta_pago,
                invalidada: result,
                motivo
            };
        }, 'Firma invalidada exitosamente.', true, 'PIOAPP');
    }

    /**
     * Verificar si existe una firma para un empleado en un periodo específico
     */
    async verificarFirmaExistente(req: RequestAuth, res: Response<JsonResponse<any>>) {
        await handleSend(res, async () => {
            // Los query parameters fueron inyectados al body y validados
            const { id_periodo, tipo } = req.body as VerificarFirmaExistenteType;

            if (!req.user) {
                throw new Error("Usuario no autenticado");
            }

            const result = await this.firmaBoletaService.verificarFirmaExistente(
                Number(req.user.id_users),
                id_periodo,
                tipo ?? TipoPeriodoEnum.QUINCENA
            );

            return result;
        }, 'Verificación de firma completada.', true, 'PIOAPP');
    }

}