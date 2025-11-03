import { inject, injectable } from "tsyringe";
import tPeriodoRepository from "../../repositories/tPeriodoRepository";
import tPeriodoModel from "../../models/nomina/tables/tPeriodoModel";

@injectable()
export default class PeriodoService {

    constructor(
        @inject(tPeriodoRepository) private tPeriodoRepository: tPeriodoRepository
    ) {}

    /**
     * Obtener los últimos periodos pagados
     */
    async obtenerUltimosPeriodosPagados(limite: number = 5): Promise<{
        idPeriodo: number,
        nombrePeriodo: string | null,
        fechaInicio: string,
        fechaFin: string,
        pagada: boolean,
        noQuincena: number | null,
        activo: boolean
    }[]> {
        const periodos = await this.tPeriodoRepository.findUltimosPeriodosPagados(limite, true);
        
        return periodos.map((periodo: any) => ({
            idPeriodo: periodo.idPeriodo,
            nombrePeriodo: periodo.nombrePeriodo,
            fechaInicio: periodo.fechaInicio,
            fechaFin: periodo.fechaFin,
            pagada: periodo.pagada,
            noQuincena: periodo.noQuincena,
            activo: periodo.activo
        }));
    }

    /**
     * Obtener un periodo por ID
     */
    async obtenerPeriodoPorId(idPeriodo: number): Promise<tPeriodoModel | null> {
        return await this.tPeriodoRepository.findById(idPeriodo);
    }

    /**
     * Verificar si un periodo está pagado
     */
    async verificarPeriodoPagado(idPeriodo: number): Promise<{
        existe: boolean,
        pagado: boolean,
        periodo?: {
            idPeriodo: number,
            nombrePeriodo: string | null,
            fechaInicio: Date,
            fechaFin: Date
        }
    }> {
        const periodo = await this.tPeriodoRepository.findById(idPeriodo);
        
        if (!periodo) {
            return { existe: false, pagado: false };
        }

        return {
            existe: true,
            pagado: periodo.pagada,
            periodo: {
                idPeriodo: periodo.idPeriodo,
                nombrePeriodo: periodo.nombrePeriodo,
                fechaInicio: periodo.fechaInicio,
                fechaFin: periodo.fechaFin
            }
        };
    }

    /**
     * Obtener periodos por estado de pago
     */
    async obtenerPeriodosPorEstado(pagada: boolean = true): Promise<tPeriodoModel[]> {
        return await this.tPeriodoRepository.findByPagada(pagada);
    }

}