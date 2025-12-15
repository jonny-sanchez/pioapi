import { Transaction } from "sequelize";
import TokenNotificationPushModel from "../models/pioapp/tables/TokenNotificationPushModel";

export default interface ITokenNotificationPushRepository {

    create(data:Partial<TokenNotificationPushModel>, t:Transaction|null, raw:boolean) : Promise<TokenNotificationPushModel>

    upsertTokenNotificationPush(id_unique_device:string, data:Partial<TokenNotificationPushModel>, t:Transaction|null, raw:boolean) : Promise<TokenNotificationPushModel>

    countByIdUser(id_users:number) : Promise<number>

    getAllByIdUser(id_users: number, raw:boolean) : Promise<TokenNotificationPushModel[]>

}