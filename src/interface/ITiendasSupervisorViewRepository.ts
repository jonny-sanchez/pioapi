import TiendasSupervisorView from "../models/nomina/views/TiendasSupervisorView";

export default interface ITiendasSupervisorViewRepository {

    getAllByCodigo(codigo:number, raw:boolean) : Promise<TiendasSupervisorView[]>

}