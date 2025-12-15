import { Expo } from "expo-server-sdk";
import { inject, injectable } from "tsyringe";
import { userToken } from "../../types/ResponseTypes";
import { Transaction } from "sequelize";
import TokenNotificationPushRepository from "../../repositories/TokenNotificationPushRepository";
import SendNotificationType from "../../types/NotificationPush/SendNotificationType";
import { dataMessageNotificacion, generateResponseNoTokens, sendNotificationsMessage } from "../../utils/Notificaciones/NotificacionesPushUtils";

@injectable()
export default class NotificationPushExpoService {

    private expo:Expo;

    constructor(
        @inject(TokenNotificationPushRepository) private tokenNotificationPushRepository:TokenNotificationPushRepository
    ) {
        this.expo = new Expo()
    }

    async sendNotificactionPushApp(user:userToken, t:Transaction) : Promise<SendNotificationType> {
        //obtener token push del dispositivo
        const tokensExpoPush = await this.tokenNotificationPushRepository.getAllByIdUser(
            Number(user.id_users), true
        )
        //obtener tokens solo validos y generar mensaje de la notificacion
        const validMessages = dataMessageNotificacion(
            tokensExpoPush, 'exponent_push_token', { title: 'PIOAPP', body: 'Tarea supervisor', priority: 'high' }
        )
        //validar que haya mensajes si no retornar 0
        if(validMessages.length <= 0) 
            return generateResponseNoTokens()
        //enviar notificaciones y obtner el response
        const resultSendNotification = await sendNotificationsMessage(
            this.expo, 
            validMessages
        ) 
        //retornar resultado de el envio de notificaciones push
        return { 
            status: true,
            message: 'Notificaciones enviadas correctamente.', 
            notificationSendSuccess: resultSendNotification.success,
            notificationSendFail: resultSendNotification.error,
            payloadNotificationSend: resultSendNotification.notiResult
        }
    }

}