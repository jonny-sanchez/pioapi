import { inject, injectable } from "tsyringe";
import { JsonResponse, RequestAuth, userToken } from "../../types/ResponseTypes";
import { Response } from "express";
import { handleSend } from "../../utils/HandlerFactory";
import NotificationPushExpoService from "../../services/NotificationPushExpo/NotificationPushExpoService";
import { Transaction } from "sequelize";

@injectable()
export default class NotificationPushController {

    constructor(@inject(NotificationPushExpoService) private notificationPushExpoService:NotificationPushExpoService) {}

    async sendNotificationHandler(req:RequestAuth<any>, res:Response<JsonResponse<any>>) {
        await handleSend(res, async(t) => {
            const result = await this.notificationPushExpoService.sendNotificactionPushApp(
                req.user as userToken,
                t as Transaction
            )
            return result
        }, "Notificacion enviada correctamente.", true , 'PIOAPP')
    } 

}