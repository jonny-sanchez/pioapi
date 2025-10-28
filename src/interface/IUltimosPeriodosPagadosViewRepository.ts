import UltimosPeriodosPagadosView from "../models/nomina/views/UltimosPeriodosPagadosView";

export default interface IUltimosPeriodosPagadosViewRepository {

    getAll(raw:boolean) : Promise<UltimosPeriodosPagadosView[]>
}