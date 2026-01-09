import tPeriodoEspecialBoletaModel from "../models/nomina/tables/tPeriodoEspecialBoletaModel";

export default interface ItPeriodoEspecialBoletaRepository {

    getByYear(year:number, raw:boolean) : Promise<tPeriodoEspecialBoletaModel[]>

    find(idPeriodo:number, error:boolean, raw:boolean) : Promise<tPeriodoEspecialBoletaModel|null>

}