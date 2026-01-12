import { Transaction } from "sequelize";
import ITokenNotificationPushRepository from "../interface/ITokenNotificationPushRepository";
import TokenNotificationPushModel from "../models/pioapp/tables/TokenNotificationPushModel";
import { injectable } from "tsyringe";

@injectable()
export default class TokenNotificationPushRepository implements ITokenNotificationPushRepository{

    async create(data: Partial<TokenNotificationPushModel>, t: Transaction | null = null, raw: boolean = false): Promise<TokenNotificationPushModel> {
        const result = await TokenNotificationPushModel.create(data, { transaction: t })
        if(!result) throw new Error(`Error al crear el Token Notificaciones.`)
        return raw ? result.get({ plain: true }) : result
    }

    async upsertTokenNotificationPush(id_unique_device: string, data: Partial<TokenNotificationPushModel>, t: Transaction | null = null, raw: boolean = false): Promise<TokenNotificationPushModel> {
        const [item, created] = await TokenNotificationPushModel.findOrCreate({
            where: { id_unique_device },
            defaults: { ...data },
            transaction: t
        })
        if (!created) await item.update(data, { transaction: t });
        return raw ? item.get({ plain: true }) : item
    }

    async countByIdUser(id_users: number): Promise<number> {
        const total = await TokenNotificationPushModel.count({
            where: { id_users }
        })
        return total
    }

    async getAllByIdUser(id_users: number, raw: boolean = false): Promise<TokenNotificationPushModel[]> {
        const result = await TokenNotificationPushModel.findAll({
            where: {
                id_users
            },
            raw
        })
        return result
    }

}