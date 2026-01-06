import IUsersRepository from "../interface/IUsersRepository";
import UsersModel from "../models/pioapp/tables/UsersModel";
import { injectable } from "tsyringe";
import { Op, Transaction } from "sequelize";
import DetalleEmpleadoCootraguaView from "../models/nomina/views/DetalleEmpleadoCootraguaView";

@injectable()
export default class UsersRepository implements IUsersRepository{

    async findById(id: number, error: boolean = true, raw:boolean = false): Promise<UsersModel | null> {
        const user = await UsersModel.findByPk(id, { raw: raw })
        if(error) if(!user) throw new Error("Usuario no encontrado.");
        return user
    }

    async createUser(data: any, t:Transaction | null = null): Promise<UsersModel | null> {
        const user = await UsersModel.create(data, { transaction: t })
        if(!user) throw new Error("Error al crear el usuario."); 
        return user
    }

    async getUserActive(raw: boolean = false, include: any[] = []): Promise<UsersModel[]> {
        const result = await UsersModel.findAll({
            where: {
                baja: false
            },
            include: include,
            raw
        }) 
        return result
    }

    async lowUsersUpdate(data: Partial<UsersModel>, empleados: DetalleEmpleadoCootraguaView[] = [], t:Transaction|null = null): Promise<number> {
        const result = await UsersModel.update(data, {
            where: {
                id_users: { [Op.in]: empleados.flatMap(({ codEmpleado }) => codEmpleado) }
            },
            transaction: t
            // returning: true
        })
        return result[0]
    }
}