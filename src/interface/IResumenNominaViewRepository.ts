import ResumenNominaView from "../models/nomina/views/ResumenNominaView";

export default interface IResumenNominaViewRepository {

    getByCodigoAndPeriodo(codigo: number, periodo: number, raw:boolean) : Promise<ResumenNominaView[]>
}