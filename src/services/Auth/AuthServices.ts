import tEmpleadoRepository from "../../repositories/tEmpleadoRepository";
import { injectable, inject } from "tsyringe";
import { LoginDtoType } from "../../dtos/LoginDto"; 
import UsersRepository from "../../repositories/UsersRepository";
import { Transaction } from "sequelize";
import CryptServices from "./CryptServices";
import { generateToken } from "../../utils/Jwt";
import { userToken } from "../../types/ResponseTypes";
import UsersServices from "../Users/UsersServices";

@injectable()
export default class AuthServices {

    constructor(
        @inject(tEmpleadoRepository) private tEmpleadoRepo:tEmpleadoRepository,
        @inject(CryptServices) private cryptServices:CryptServices,
        @inject(UsersServices) private usersServices:UsersServices
    ) {}

    async validLogin(data:LoginDtoType, t:Transaction) : Promise<any | null> {
        const codigoEmpleado:number = Number(data.codigo.substring(2))
        const empleado = await this.tEmpleadoRepo.findByCodigo(codigoEmpleado, true, true)
        const user = await this.usersServices.findOrCreateUserLogin(codigoEmpleado, empleado, t, true)
        //validar password
        const resultCompare = await this.cryptServices.Compare(data.password, user?.password)
        if(!resultCompare) throw new Error("Contraseña incorrecta.")
        const { password, ...userJson } = user as any
        const token = generateToken(userJson as userToken)
        const userData = { ...userJson as userToken, token }
        return userData
    }


}