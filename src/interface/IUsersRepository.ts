import DetalleEmpleadoCootraguaView from "../models/nomina/views/DetalleEmpleadoCootraguaView";
import UsersModel from "../models/pioapp/tables/UsersModel";
import { Transaction } from "sequelize";

export default interface IUsersRepository {
    
    findById(id:number, error:boolean, raw:boolean) : Promise<UsersModel | null>;

    createUser(data:any, t:Transaction | null) : Promise<UsersModel | null>;

    getUserActive(raw:boolean, include:any[]) : Promise<UsersModel[]>

    lowUsersUpdate(data:Partial<UsersModel>, empleados:DetalleEmpleadoCootraguaView[], t:Transaction|null) : Promise<number>

}