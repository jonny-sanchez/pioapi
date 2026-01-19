import { inject, injectable } from "tsyringe";
import PeriodoService from "../../services/Nomina/PeriodoService";
import { JsonResponse, RequestAuth, userToken } from "../../types/ResponseTypes";
import { Response } from "express";
import { handleSend } from "../../utils/HandlerFactory";

@injectable()
export default class PeriodoController {

    constructor(
        @inject(PeriodoService) private periodoService: PeriodoService
    ) {}

    /**
     * Obtener los últimos periodos pagados
     */
    async obtenerUltimosPeriodosPagados(req: RequestAuth, res: Response<JsonResponse<any>>) {
        await handleSend(res, async () => {
            const { limite } = req.query as { limite?: string };
            const limiteNumerico = limite ? parseInt(limite) : 5;

            const periodos = await this.periodoService.obtenerUltimosPeriodosPagados(
                limiteNumerico,
                req.user as userToken
            );
            return periodos;
        }, 'Últimos periodos pagados obtenidos exitosamente.', true, 'NOMINA');
    }

    /**
     * Obtener periodo por ID
     */
    async obtenerPeriodoPorId(req: RequestAuth, res: Response<JsonResponse<any>>) {
        await handleSend(res, async () => {
            const { id_periodo } = req.params as { id_periodo: string };

            const periodo = await this.periodoService.obtenerPeriodoPorId(parseInt(id_periodo));
            
            if (!periodo) {
                throw new Error("Periodo no encontrado");
            }

            return periodo;
        }, 'Periodo obtenido exitosamente.', true, 'NOMINA');
    }

    /**
     * Verificar si un periodo está pagado
     */
    async verificarPeriodoPagado(req: RequestAuth, res: Response<JsonResponse<any>>) {
        await handleSend(res, async () => {
            const { id_periodo } = req.params as { id_periodo: string };

            const resultado = await this.periodoService.verificarPeriodoPagado(parseInt(id_periodo));
            return resultado;
        }, 'Verificación de periodo completada.', true, 'NOMINA');
    }

    /**
     * Obtener periodos por estado
     */
    async obtenerPeriodosPorEstado(req: RequestAuth, res: Response<JsonResponse<any>>) {
        await handleSend(res, async () => {
            const { pagada } = req.query as { pagada?: string };
            const estadoPagada = pagada === 'true';

            const periodos = await this.periodoService.obtenerPeriodosPorEstado(estadoPagada);
            return periodos;
        }, 'Periodos obtenidos exitosamente.', true, 'NOMINA');
    }

}