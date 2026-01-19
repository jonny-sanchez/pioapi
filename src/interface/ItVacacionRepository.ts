import tVacacionModel from "../models/nomina/tables/tVacacionModel"

export default interface ItVacacionRepository {

    // findPeriodosVacacionesByUser(codEmpleado:number) : Promise<any>;

    findPlanillaVacacion(idVacacion:number, error:boolean, raw:boolean) : Promise<tVacacionModel|null>

    findBoletaCompletaByEmpleadoAndPeriodo(codEmpleado: number, idPeriodo: number) : Promise<any>

}