import PeriodoVacacionView from "../models/nomina/views/PeriodoVacacionView";

export default interface IPeriodoVacacionRepository {

    paginateAndSearch(search: string|null, cursor: number|null, limit: number, raw:boolean, codEmpleado:number) : Promise<PeriodoVacacionView[]>

    getByUser(codEmpleado:number, raw:boolean, include:any[]) : Promise<PeriodoVacacionView[]>

    findById(idPeriodo:number, raw:boolean) : Promise<PeriodoVacacionView|null>

}