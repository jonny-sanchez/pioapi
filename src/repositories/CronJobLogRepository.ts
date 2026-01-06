import { Transaction } from "sequelize";
import ICronJobLogRepository from "../interface/ICronJobLogRepository";
import CronJobLogModel from "../models/pioapp/tables/CronJobLogModel";

export default class CronJobLogRepository implements ICronJobLogRepository {

    async create(data: Partial<CronJobLogModel>, t: Transaction | null = null, raw: boolean = false): Promise<CronJobLogModel> {
        const result = await CronJobLogModel.create(data, { transaction: t })
        if(!result) throw new Error(`Error al crear el log cron job.`);
        return raw ? result.get({ plain: true }) : result
    }

}