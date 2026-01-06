import { inject, injectable } from "tsyringe";
import IJob from "../../interface/Jobs/IJob";
import cron from 'node-cron'
import AuthJobService from "../../services/AuthJob/AuthJobService";

@injectable()
export default class AuthJob implements IJob{

    constructor(@inject(AuthJobService) private authJobService:AuthJobService) {}

    start(): void {
        //cron job todos los dias a media noche 
        // 0 0 * * *
        //cada minuto
        //* * * * *
        cron.schedule('0 0 * * *', async() => {
            await this.authJobService.actionSetLowAssociatesAll()
        }, { timezone: 'America/Guatemala' })

    }

}