import { inject, injectable } from "tsyringe";
import tPeriodoRepository from "../../repositories/tPeriodoRepository";
import tPeriodoModel from "../../models/nomina/tables/tPeriodoModel";
import { PeriodosPagadosType, TipoPeriodoEnum } from "../../types/PeriodosNomina/PeriodosPagadosType";
import tPeriodoEspecialBoletaRepository from "../../repositories/tPeriodoEspecialBoletaRepository";
import PeriodoVacacionRepository from "../../repositories/PeriodoVacacionRepository";
import { userToken } from "../../types/ResponseTypes";
import { PeriodoPaginacionDtoType } from "../../dtos/PeriodoNomina/PeriodoPaginacionDto";
import tPeriodoEspecialBoletaModel from "../../models/nomina/tables/tPeriodoEspecialBoletaModel";
import PeriodoVacacionView from "../../models/nomina/views/PeriodoVacacionView";

@injectable()
export default class PeriodoService {

    constructor(
        @inject(tPeriodoRepository) private tPeriodoRepository: tPeriodoRepository,
        @inject(tPeriodoEspecialBoletaRepository) private periodoEspecialBoletaRepository:tPeriodoEspecialBoletaRepository,
        @inject(PeriodoVacacionRepository) private periodoVacacionRepository:PeriodoVacacionRepository
    ) {}

    async cursorPaginatePeriodos(data:PeriodoPaginacionDtoType, user:userToken) : Promise<any> {
        const search = data?.search || ""
        const cursor = data?.cursor || null
        const limit = Number(data?.limit || 10)
        const codEmpleado = Number(user.id_users)
        let paginate:tPeriodoModel[]|tPeriodoEspecialBoletaModel[]|PeriodoVacacionView[] = []

        if(data.tipo_periodo == TipoPeriodoEnum.QUINCENA)
            paginate = await this.tPeriodoRepository.paginateAndSearch(search, cursor, limit, true, codEmpleado)

        if(data.tipo_periodo == TipoPeriodoEnum.AGUINALDO)
            paginate = await this.periodoEspecialBoletaRepository.paginateAndSearch(search, cursor, limit, true, 1212, codEmpleado)

        if(data.tipo_periodo == TipoPeriodoEnum.BONO14)
            paginate = await this.periodoEspecialBoletaRepository.paginateAndSearch(search, cursor, limit, true, 7777, codEmpleado)

        if(data.tipo_periodo == TipoPeriodoEnum.VACACION)
            paginate = await this.periodoVacacionRepository.paginateAndSearch(search, cursor, limit, true, codEmpleado)

        return {
            list: paginate.map((per) => ({
                idPeriodo: per.idPeriodo,
                nombrePeriodo: per.nombrePeriodo,
                fechaInicio: per.fechaInicio,
                fechaFin: per.fechaFin,
                pagada: per.pagada,
                noQuincena: per.noQuincena,
                activo: per.activo,
                tipo: Number(data.tipo_periodo)
            })),
            nextCursor: paginate.length ? paginate[paginate.length - 1]?.idPeriodo : null,
            hasMore: paginate.length === limit
        }
    }

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