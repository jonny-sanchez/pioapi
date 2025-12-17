import { Expo, ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk"
import SendNotificationType from "../../types/NotificationPush/SendNotificationType"

export const dataMessageNotificacion = (
    data:any[], 
    campo:string,
    mensaje:Omit<ExpoPushMessage, 'to'> 
) : ExpoPushMessage[] => {
    const validMessages = data
        .filter(el => Expo.isExpoPushToken(el[campo]))
        .map(el => ({
            ...mensaje,
            to: el[campo],
            sound: 'default',
            // data: { withSome: 'data' },
        }))
    return validMessages
}

export const generateResponseNoTokens = () : SendNotificationType => ({
    status: false,
    message: 'Ooops el usuario no tiene tokens expo push.', 
    notificationSendSuccess: 0,
    notificationSendFail: 0,
    payloadNotificationSend: []
})

export const sendNotificationsMessage = async (
    expo:Expo,
    mensajes:ExpoPushMessage[]
) => {
    let notiResult:ExpoPushTicket[] = []
    const chunckNotification = expo.chunkPushNotifications(mensajes)
    for (const noti of chunckNotification) {
        const notifications = await expo.sendPushNotificationsAsync(noti)
        notiResult.push(...notifications)
    }
    const error = notiResult?.filter(el=>el.status === 'error')?.length ?? 0
    const success = notiResult?.filter(el=>el.status === 'ok')?.length ?? 0
    return {
        notiResult,
        error,
        success
    }
}