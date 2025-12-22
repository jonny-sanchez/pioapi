import IUsersRepository from "../interface/IUsersRepository";
import UsersModel from "../models/pioapp/tables/UsersModel";
import { injectable } from "tsyringe";
import { Transaction } from "sequelize";

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

}