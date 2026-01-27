import tPeriodoModel from "../models/nomina/tables/tPeriodoModel";

export default interface ItPeriodoRepository {

    paginateAndSearch(search: string|null, cursor: number|null, limit: number, raw:boolean, codEmpleado:number) : Promise<tPeriodoModel[]>
    
    findById(idPeriodo: number, raw?: boolean): Promise<tPeriodoModel | null>;
    
    findByActive(activo?: boolean, raw?: boolean): Promise<tPeriodoModel[]>;
    
    findByPagada(pagada?: boolean, raw?: boolean): Promise<tPeriodoModel[]>;
    
    findCurrentPeriodo(raw?: boolean): Promise<tPeriodoModel | null>;
    
    findByDateRange(fechaInicio: Date, fechaFin: Date, raw?: boolean): Promise<tPeriodoModel[]>;
    
    findByQuincena(noQuincena: number, raw?: boolean): Promise<tPeriodoModel[]>;
    
    marcarComoPagada(idPeriodo: number): Promise<boolean>;
    
    activarPeriodo(idPeriodo: number): Promise<boolean>;
    
    desactivarPeriodo(idPeriodo: number): Promise<boolean>;
    
    getAll(raw?: boolean): Promise<tPeriodoModel[]>;
    
    /**
     * Obtener los últimos periodos pagados ordenados por fecha (más recientes primero)
     */
    findUltimosPeriodosPagados(limite?: number, raw?: boolean): Promise<tPeriodoModel[]>;
    
}