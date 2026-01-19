import { inject, injectable } from "tsyringe";
import tPeriodoRepository from "../../repositories/tPeriodoRepository";
import tPeriodoModel from "../../models/nomina/tables/tPeriodoModel";
import { PeriodosPagadosType, TipoPeriodoEnum } from "../../types/PeriodosNomina/PeriodosPagadosType";
import tPeriodoEspecialBoletaRepository from "../../repositories/tPeriodoEspecialBoletaRepository";
import PeriodoVacacionRepository from "../../repositories/PeriodoVacacionRepository";
import { userToken } from "../../types/ResponseTypes";

@injectable()
export default class PeriodoService {

    constructor(
        @inject(tPeriodoRepository) private tPeriodoRepository: tPeriodoRepository,
        @inject(tPeriodoEspecialBoletaRepository) private periodoEspecialBoletaRepository:tPeriodoEspecialBoletaRepository,
        @inject(PeriodoVacacionRepository) private periodoVacacionRepository:PeriodoVacacionRepository
    ) {}

    /**
     * Obtener los últimos periodos pagados
     */
    async obtenerUltimosPeriodosPagados(limite: number = 5, user:userToken): Promise<PeriodosPagadosType[]> {

        const periodosEspeciales = await this.periodoEspecialBoletaRepository.getByYear(2025, true)
        const periodos = await this.tPeriodoRepository.findUltimosPeriodosPagados(limite, true);
        const periodosVacaciones = await this.periodoVacacionRepository.getByUser(Number(user.id_users), true)

        const periodosVacacionesFlat:PeriodosPagadosType[] = periodosVacaciones.map((periodoVac:any) => ({
            idPeriodo: periodoVac.idPeriodo,
            nombrePeriodo: periodoVac.nombrePeriodo,
            fechaInicio: periodoVac.fechaInicio,
            fechaFin: periodoVac.fechaFin,
            pagada: periodoVac.pagada,
            noQuincena: periodoVac.noQuincena,
            activo: periodoVac.activo,
            tipo: periodoVac.tipo
        }))

        const periodosAguinaldoBono14:PeriodosPagadosType[] = periodosEspeciales.map((perEspecial:any) => ({
            idPeriodo: perEspecial.idPeriodo,
            nombrePeriodo: perEspecial.nombrePeriodo,
            fechaInicio: perEspecial.fechaInicio,
            fechaFin: perEspecial.fechaFin,
            pagada: perEspecial.pagada,
            noQuincena: perEspecial.noQuincena,
            activo: perEspecial.activo,
            tipo: perEspecial.tipo == 1212 ? TipoPeriodoEnum.AGUINALDO : TipoPeriodoEnum.BONO14
        }))

        const peridosFlat:PeriodosPagadosType[] = periodos.map((periodo: any) => ({
            idPeriodo: periodo.idPeriodo,
            nombrePeriodo: periodo.nombrePeriodo,
            fechaInicio: periodo.fechaInicio,
            fechaFin: periodo.fechaFin,
            pagada: periodo.pagada,
            noQuincena: periodo.noQuincena,
            activo: periodo.activo,
            tipo: TipoPeriodoEnum.QUINCENA
        }));

        return [ ...peridosFlat, ...periodosAguinaldoBono14, ...periodosVacacionesFlat ]

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
            fechaFin: Date|string
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