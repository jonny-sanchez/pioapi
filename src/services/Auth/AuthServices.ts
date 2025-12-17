import { injectable, inject } from "tsyringe";
import { LoginDtoType } from "../../dtos/LoginDto"; 
import { Transaction } from "sequelize";
import CryptServices from "./CryptServices";
import { generateToken } from "../../utils/Jwt";
import { userToken } from "../../types/ResponseTypes";
import UsersServices from "../Users/UsersServices";
import DetalleEmpleadoCootraguaViewRepository from "../../repositories/DetalleEmpleadoCootraguaViewRepository";
import TokenNotificationPushRepository from "../../repositories/TokenNotificationPushRepository";

@injectable()
export default class AuthServices {

    constructor(
        // @inject(tEmpleadoRepository) private tEmpleadoRepo:tEmpleadoRepository,
        @inject(CryptServices) private cryptServices:CryptServices,
        @inject(UsersServices) private usersServices:UsersServices,
        @inject(DetalleEmpleadoCootraguaViewRepository) private detalleEmpleadoCootraguaViewRepository:DetalleEmpleadoCootraguaViewRepository,
        @inject(TokenNotificationPushRepository) private tokenNotificationPushRepository:TokenNotificationPushRepository
    ) {}

    async validLogin(data:LoginDtoType, t:Transaction) : Promise<any | null> {
        const { exponent_push_token, id_unique_device } = data
        const codigoEmpleado:number = Number(data.codigo.substring(2))
        // const empleado = await this.tEmpleadoRepo.findByCodigo(codigoEmpleado, true, true)
        const empleado = await this.detalleEmpleadoCootraguaViewRepository.findByCodigo(codigoEmpleado, true, true)
        const user = await this.usersServices.findOrCreateUserLogin(codigoEmpleado, empleado, t, true)
        //validar password
        const resultCompare = await this.cryptServices.Compare(data.password, user?.password)
        if(!resultCompare) throw new Error("Contraseña incorrecta.")
        const { password, ...userJson } = user as any
        //ingresar tokens "notification push" a dispositivo unico
        if(id_unique_device && exponent_push_token && user?.id_users)
            await this.tokenNotificationPushRepository.upsertTokenNotificationPush(
                id_unique_device,
                { id_unique_device, exponent_push_token, id_users: Number(user.id_users) },
                t
            )
        const token = generateToken(userJson as userToken)
        const userData = { ...userJson as userToken, token }
        return userData
    }


}