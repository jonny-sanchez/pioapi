import { inject, injectable } from "tsyringe";
import { JsonResponse, RequestAuth, userToken } from "../../types/ResponseTypes";
import { Response, Request } from "express";
import { handleSend } from "../../utils/HandlerFactory";
import NotificationPushExpoService from "../../services/NotificationPushExpo/NotificationPushExpoService";
import { Transaction } from "sequelize";
import { NotificationSendDtoType } from "../../dtos/NotificacionesPush/NotificationSendDto";
import { MarkerReadNotificationDtoType } from "../../dtos/NotificacionesPush/MarkerReadNotificationDto";

@injectable()
export default class NotificationPushController {

    constructor(
        @inject(NotificationPushExpoService) private notificationPushExpoService:NotificationPushExpoService,
    ) {}

    async sendNotificationHandler(req:Request, res:Response<JsonResponse<any>>) {
        await handleSend(res, async(t) => {
            const result = await this.notificationPushExpoService.sendNotificactionPushApp(
                req.body as NotificationSendDtoType,
                t as Transaction
            )
            return result
        }, "Notificacion enviada correctamente.", true , 'PIOAPP')
    } 

    async markerNotificacionRead(req:RequestAuth<MarkerReadNotificationDtoType>, res:Response<JsonResponse<any>>) {
        await handleSend(res, async(t) => {
            const result = await this.notificationPushExpoService.notificationReadApp(
                req.body,
                t as Transaction
            )
            return result
        }, "Notificacion marcada como leida correctamente", true, 'PIOAPP')
    }

    async listNotificationsPrevious(req:RequestAuth<any>, res:Response<JsonResponse<any>>) {
        await handleSend(res, async() => {
            const result = await this.notificationPushExpoService.notificationPrevious(
                req.user as userToken
            )
            return result
        }, "Notificaciones anteriores listadas correctamente.")
    }

}