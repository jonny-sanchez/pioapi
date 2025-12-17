import { Expo } from "expo-server-sdk";
import { inject, injectable } from "tsyringe";
import { userToken } from "../../types/ResponseTypes";
import { Transaction } from "sequelize";
import TokenNotificationPushRepository from "../../repositories/TokenNotificationPushRepository";
import SendNotificationType from "../../types/NotificationPush/SendNotificationType";
import { dataMessageNotificacion, generateResponseNoTokens, sendNotificationsMessage } from "../../utils/Notificaciones/NotificacionesPushUtils";
import NotificacionAppRepository from "../../repositories/NotificacionAppRepository";
import { NotificationSendDtoType } from "../../dtos/NotificacionesPush/NotificationSendDto";
import AsuntoNotificacionRepository from "../../repositories/AsuntoNotificacionRepository";
import AsuntoNotificacionModel from "../../models/pioapp/tables/AsuntoNotificacionModel";
import NotificationEventEmitter from "../../events/NotificationsPush/NotificationEventEmitter";
import { MarkerReadNotificationDtoType } from "../../dtos/NotificacionesPush/MarkerReadNotificationDto";

@injectable()
export default class NotificationPushExpoService {

    private expo:Expo;

    constructor(
        @inject(TokenNotificationPushRepository) private tokenNotificationPushRepository:TokenNotificationPushRepository,
        @inject(NotificacionAppRepository) private notificacionAppRepository:NotificacionAppRepository,
        @inject(AsuntoNotificacionRepository) private asuntoNotificacionRepository:AsuntoNotificacionRepository
    ) {
        this.expo = new Expo()
    }

    async sendNotificactionPushApp(data:NotificationSendDtoType, t:Transaction) : Promise<SendNotificationType> {
        //obtener token push del dispositivo
        const tokensExpoPush = await this.tokenNotificationPushRepository.getAllByIdUser(
            Number(data.user), true
        )
        //obtener el titulo del asunto
        const asunto = await this.asuntoNotificacionRepository.findById(data.id_asunto_notificacion, true, true) as AsuntoNotificacionModel
        //obtener tokens solo validos y generar mensaje de la notificacion
        const validMessages = dataMessageNotificacion(
            tokensExpoPush, 'exponent_push_token', { title: data.title, body: `${data.body}`, priority: 'high', data: data.data_payload }
        )
        //validar que haya mensajes si no retornar 0
        if(validMessages.length <= 0) 
            return generateResponseNoTokens()
        //guardar notificacion en db
        const notificacion =  await this.notificacionAppRepository.create({ 
            title: data.title,
            body: `${data.body}`,
            id_asunto_notificacion: asunto.id_asunto_notificacion,
            dataPayload: data.data_payload,
            id_users: data.user
        }, [AsuntoNotificacionModel], t, true)
        //enviar notificaciones y obtener el response
        const resultSendNotification = await sendNotificationsMessage(
            this.expo, 
            validMessages
        ) 
        //avisar al socket que se creo una nueva notificacion
        NotificationEventEmitter.emit('notificacion-nueva', notificacion)
        //retornar resultado de el envio de notificaciones push
        return { 
            status: true,
            message: 'Notificaciones enviadas correctamente.', 
            notificationSendSuccess: resultSendNotification.success,
            notificationSendFail: resultSendNotification.error,
            payloadNotificationSend: resultSendNotification.notiResult
        }
    }

    async notificationReadApp(data:MarkerReadNotificationDtoType, t:Transaction) : Promise<any> {
        //editar el estado de la notificacion y devolver la notificacion actualizada
        const noti = await this.notificacionAppRepository.updateStatusLeido(
            data.id_notificacion_app, true, t, true, true, [ AsuntoNotificacionModel ]
        )
        //avisar al socket que se leyo una notificacion
        NotificationEventEmitter.emit('notificacion-leida', noti)
        return noti
    } 

}