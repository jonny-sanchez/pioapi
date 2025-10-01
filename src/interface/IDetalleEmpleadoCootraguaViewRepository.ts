import DetalleEmpleadoCootraguaView from "../models/nomina/views/DetalleEmpleadoCootraguaView";

export default interface IDetalleEmpleadoCootraguaViewRepository {

    findByCodigo(codigo: number, error:boolean, raw:boolean) : Promise<DetalleEmpleadoCootraguaView | null>;

}