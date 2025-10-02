import { Transaction } from "sequelize";
import UsersRepository from "../../repositories/UsersRepository";
import { injectable, inject } from "tsyringe";
import tEmpleadoModel from "../../models/nomina/tables/tEmpleadoModel";
import CryptServices from "../Auth/CryptServices";
import UsersModel from "../../models/pioapp/tables/UsersModel";
import DetalleEmpleadoCootraguaView from "../../models/nomina/views/DetalleEmpleadoCootraguaView";

@injectable()
export default class UsersServices {

    constructor(
        @inject(UsersRepository) private usersRepository:UsersRepository,
        @inject(CryptServices) private cryptServices:CryptServices
    ) {}

    async findOrCreateUserLogin(codigoEmpleado:number, empleado:DetalleEmpleadoCootraguaView | null, t:Transaction, json:boolean = false) : Promise<UsersModel | null | undefined> {
        let user = await this.usersRepository.findById(codigoEmpleado, false)
        if(!user) user = await this.usersRepository.createUser(
        {
            id_users: empleado?.codEmpleado || null,
            codigo_user: empleado?.aliasCodigo || null,
            id_rol: empleado?.idRol || null,
            first_name: empleado?.nombreEmpleado || null,
            second_name: empleado?.segundoNombre || null,
            first_last_name: empleado?.apellidoEmpleado || null,
            second_last_name: empleado?.segundoApellido || null,
            email: empleado?.email || null,
            password: await this.cryptServices.Hash(empleado?.password || ''),
            dpi: empleado?.noDoc || null,
            fecha_nacimiento: empleado?.fechaNac || null,
            direccion: empleado?.direccion || null,
            puesto_trabajo: empleado?.nomPuesto || null
        }, t) 
        return json ? user?.toJSON() : user
    }

}