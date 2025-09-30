import { Transaction } from "sequelize";
import UsersRepository from "../../repositories/UsersRepository";
import { injectable, inject } from "tsyringe";
import tEmpleadoModel from "../../models/nomina/tables/tEmpleadoModel";
import CryptServices from "../Auth/CryptServices";
import UsersModel from "../../models/pioapp/tables/UsersModel";

@injectable()
export default class UsersServices {

    constructor(
        @inject(UsersRepository) private usersRepository:UsersRepository,
        @inject(CryptServices) private cryptServices:CryptServices
    ) {}

    async findOrCreateUserLogin(codigoEmpleado:number, empleado:tEmpleadoModel | null, t:Transaction, json:boolean = false) : Promise<UsersModel | null | undefined> {
        let user = await this.usersRepository.findById(codigoEmpleado, false)
        if(!user) user = await this.usersRepository.createUser(
        {
            id_users: empleado?.codEmpleado,
            id_rol: 1,
            first_name: empleado?.nombreEmpleado,
            second_name: empleado?.segundoNombre,
            first_last_name: empleado?.apellidoEmpleado,
            second_last_name: empleado?.segundoApellido,
            email: empleado?.email,
            password: await this.cryptServices.Hash(empleado?.password),
        }, t) 
        return json ? user?.toJSON() : user
    }

}