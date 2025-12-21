import { injectable } from "tsyringe";
import INotificacionAppRepository from "../interface/INotificacionAppRepository";
import NotificacionAppModel from "../models/pioapp/tables/NotificacionAppModel";
import { col, fn, Op, Transaction, where } from "sequelize";

@injectable()
export default class NotificacionAppRepository implements INotificacionAppRepository {

    async create(data: Partial<NotificacionAppModel>, includes: any[] = [], t: Transaction | null = null, raw: boolean = false): Promise<NotificacionAppModel> {
        const result = await NotificacionAppModel.create(data, { transaction: t })
        if(!result) throw new Error(`Error al crear la notificacion.`)
        if (includes.length > 0) await result.reload({ include: includes, transaction: t })
        return raw ? result.get({ plain: true }) : result   
    }

    async getAllTodayByIdUser(id_users: number, includes: any[] = [], raw: boolean = false): Promise<NotificacionAppModel[]> {
        const result = await NotificacionAppModel.findAll({
            // includes
            where: {
                [Op.and]: [
                    // Filtra solo notificaciones de hoy
                    where(fn('DATE', col('NotificacionAppModel.createdAt')), fn('DATE', fn('NOW'))),
                    // Filtra solo por usuario específico
                    { id_users: id_users }
                ]
            },
            include: includes,
            order: [
                [ 'createdAt', 'DESC' ]
            ],
            raw
        })
        return result
    }

    async updateStatusLeido(id_notificacion_app: number, value: boolean, t: Transaction | null = null, error: boolean = true, raw: boolean = false, includes: any[]= []): Promise<NotificacionAppModel|null> {
        const noti = await NotificacionAppModel.findOne({
            where: {
                id_notificacion_app
            },
            include: includes,
            transaction: t
        })
        if (!noti) {
            if (error) throw new Error(`Error no se encontro ninguna notificacion con id: ${id_notificacion_app}`);
            return null
        }
        await noti.update(
          { leido: value },
          { transaction: t }
        )
        return raw ? noti.get({ plain: true }) : noti   
    }

    async getAllPreviousByIdUser(id_users: number, includes: any[] = [], raw: boolean = false): Promise<NotificacionAppModel[]> {
        const result = await NotificacionAppModel.findAll({
            where: {
                [Op.and]: [
                    // Filtra solo notificaciones diferentes a hoy
                    where(
                        fn('DATE', col(`${NotificacionAppModel.name}.createdAt`)), 
                        { [Op.ne]: fn('DATE', fn('NOW')) } 
                    ),
                    // Filtra solo por usuario específico
                    { id_users: id_users }
                ]
            },
            include: includes,
            order: [
                [ 'createdAt', 'DESC' ]
            ],
            raw
        })
        return result
    }
}