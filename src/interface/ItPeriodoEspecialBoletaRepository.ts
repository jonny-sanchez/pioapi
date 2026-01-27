import tPeriodoEspecialBoletaModel from "../models/nomina/tables/tPeriodoEspecialBoletaModel";

export default interface ItPeriodoEspecialBoletaRepository {

    paginateAndSearch(search: string|null, cursor: number|null, limit: number, raw:boolean, tipo:1212|7777, codEmpleado:number) : Promise<tPeriodoEspecialBoletaModel[]>

    getByYear(year:number, raw:boolean) : Promise<tPeriodoEspecialBoletaModel[]>

    find(idPeriodo:number, error:boolean, raw:boolean) : Promise<tPeriodoEspecialBoletaModel|null>

}