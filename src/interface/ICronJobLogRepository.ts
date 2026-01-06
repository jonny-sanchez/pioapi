import { Transaction } from "sequelize";
import CronJobLogModel from "../models/pioapp/tables/CronJobLogModel";

export default interface ICronJobLogRepository {

    create(data:Partial<CronJobLogModel>, t:Transaction|null, raw:boolean) : Promise<CronJobLogModel>

}