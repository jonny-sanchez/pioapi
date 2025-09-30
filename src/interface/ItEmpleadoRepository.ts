import tEmpleadoModel from "../models/nomina/tables/tEmpleadoModel";

export default interface ItEmpleadoRepository {

    findByCodigo(codigo: number, error:boolean, raw:boolean) : Promise<tEmpleadoModel | null >;

}