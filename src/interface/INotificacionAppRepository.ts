import { Transaction } from "sequelize";
import NotificacionAppModel from "../models/pioapp/tables/NotificacionAppModel";

export default interface INotificacionAppRepository {

    create(data:Partial<NotificacionAppModel>, includes: any[], t:Transaction|null, raw:boolean) : Promise<NotificacionAppModel>

    getAllTodayByIdUser(id_users:number, includes: any[], raw:boolean) : Promise<NotificacionAppModel[]>

    updateStatusLeido(id_notificacion_app:number, value:boolean, t:Transaction|null, error:boolean, raw:boolean, includes: any[]) : Promise<NotificacionAppModel|null>

    getAllPreviousByIdUser(id_users:number, includes: any[], raw:boolean) : Promise<NotificacionAppModel[]>

    count(where:Partial<NotificacionAppModel>) : Promise<number>

}