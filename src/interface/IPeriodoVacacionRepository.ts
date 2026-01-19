import PeriodoVacacionView from "../models/nomina/views/PeriodoVacacionView";

export default interface IPeriodoVacacionRepository {

    getByUser(codEmpleado:number, raw:boolean, include:any[]) : Promise<PeriodoVacacionView[]>

    findById(idPeriodo:number, raw:boolean) : Promise<PeriodoVacacionView|null>

}