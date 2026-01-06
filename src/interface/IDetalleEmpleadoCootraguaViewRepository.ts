import DetalleEmpleadoCootraguaView from "../models/nomina/views/DetalleEmpleadoCootraguaView";
import UsersModel from "../models/pioapp/tables/UsersModel";

export default interface IDetalleEmpleadoCootraguaViewRepository {

    findByCodigo(codigo: number, error:boolean, raw:boolean) : Promise<DetalleEmpleadoCootraguaView | null>;

    findEmpleadoLowByUsersModel(users:UsersModel[], raw:boolean) : Promise<DetalleEmpleadoCootraguaView[]>

}