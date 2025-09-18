import tEmpleadoRepository from "../../repositories/tEmpleadoRepository";
import { injectable, inject } from "tsyringe";
import { LoginDtoType } from "../../dtos/LoginDto"; 
import UsersRepository from "../../repositories/UsersRepository";
import { Transaction } from "sequelize";
import CryptServices from "./CryptServices";
import { generateToken } from "../../utils/Jwt";
import { userToken } from "../../types/ResponseTypes";

@injectable()
export default class AuthServices {

    constructor(
        @inject(tEmpleadoRepository) private tEmpleadoRepo:tEmpleadoRepository,
        @inject(UsersRepository) private usersRepository:UsersRepository,
        @inject(CryptServices) private cryptServices:CryptServices
    ) {}

    async validLogin(data:LoginDtoType, t:Transaction) : Promise<any | null> {
        const empleado = await this.tEmpleadoRepo.findByCodigo(data.codigo, true, true)
        if(data.password !== empleado?.password) throw new Error("Contraseña incorrecta.");
        let user = await this.usersRepository.findById(data.codigo, false)
        if(!user) user = await this.usersRepository.createUser(
        {
            id_users: empleado.codEmpleado,
            id_rol: 1,
            first_name: empleado.nombreEmpleado,
            second_name: empleado.segundoNombre,
            first_last_name: empleado.apellidoEmpleado,
            second_last_name: empleado.segundoApellido,
            email: empleado.email,
            password: await this.cryptServices.Hash(empleado.password),
        }, t) 
        const { password, ...userJson } = user?.toJSON()
        const token = generateToken(userJson as userToken)
        const userData = { ...userJson as userToken, token }
        return userData
    }


}