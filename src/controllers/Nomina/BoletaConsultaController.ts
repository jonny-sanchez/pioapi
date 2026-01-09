import { inject, injectable } from "tsyringe";
import BoletaConsultaService from "../../services/Nomina/BoletaConsultaService";
import { JsonResponse, RequestAuth, userToken } from "../../types/ResponseTypes";
import { Response } from "express";
import { handleSend } from "../../utils/HandlerFactory";
import { ConsultaBoletaDtoType } from "../../dtos/ConsultaBoletaDto";
import { TipoPeriodoEnum } from "../../types/PeriodosNomina/PeriodosPagadosType";

@injectable()
export default class BoletaConsultaController {

    constructor(
        @inject(BoletaConsultaService) private boletaConsultaService: BoletaConsultaService
    ) {}

    /**
     * Obtener resumen de pago
     */
    async obtenerResumenPago(req: RequestAuth, res: Response<JsonResponse<any>>) {
        await handleSend(res, async () => {
            const { id_periodo } = req.body as ConsultaBoletaDtoType;

            if (!req.user) {
                throw new Error("Usuario no autenticado");
            }

            const user = req.user as userToken;
            const resumen = await this.boletaConsultaService.obtenerResumenPago(
                Number(user.id_users), // cod_empleado del usuario autenticado
                id_periodo
            );

            return resumen;
        }, 'Resumen de pago obtenido exitosamente.', true, 'NOMINA');
    }

    /**
     * Obtener detalle completo de pago
     */
    async obtenerDetalleCompleto(req: RequestAuth, res: Response<JsonResponse<any>>) {
        await handleSend(res, async () => {
            const { id_periodo, tipo } = req.body as ConsultaBoletaDtoType;

            if (!req.user) {
                throw new Error("Usuario no autenticado");
            }

            const user = req.user as userToken;
            const detalle = await this.boletaConsultaService.obtenerDetalleCompleto(
                Number(user.id_users),
                Number(user.id_users), // cod_empleado del usuario autenticado
                id_periodo,
                tipo || TipoPeriodoEnum.QUINCENA
            );

            return detalle;
        }, 'Detalle completo de pago obtenido exitosamente.', true, 'NOMINA');
    }

    /**
     * Verificar existencia de boleta
     */
    async verificarExistenciaBoleta(req: RequestAuth, res: Response<JsonResponse<any>>) {
        await handleSend(res, async () => {
            const { id_periodo } = req.body as ConsultaBoletaDtoType;

            if (!req.user) {
                throw new Error("Usuario no autenticado");
            }

            const user = req.user as userToken;
            const resultado = await this.boletaConsultaService.verificarExistenciaBoleta(
                Number(user.id_users), // cod_empleado del usuario autenticado
                id_periodo
            );

            return resultado;
        }, 'Verificación completada.', true, 'NOMINA');
    }

}