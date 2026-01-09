import tBono14Model from "../models/nomina/tables/tBono14Model";

export default interface IBono14Repository {

    findByYearAndUser(year:number, codEmpleado:number, error:boolean, raw:boolean) : Promise<tBono14Model|null>

    findBoletaCompletaByEmpleadoAndPeriodo(codEmpleado: number, idPeriodo: number) : Promise<any>

}