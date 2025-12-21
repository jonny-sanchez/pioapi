import { Router } from "express";
import { container } from "tsyringe";
import NotificationPushController from "../../controllers/NotificationPush/NotificationPushController";
import authMiddleware from "../../middlewares/authMiddleware";
import validateFields from "../../middlewares/validateFields";
import { NotificationSendDto } from "../../dtos/NotificacionesPush/NotificationSendDto";
import { MarkerReadNotificationDto } from "../../dtos/NotificacionesPush/MarkerReadNotificationDto";

const notificacionesPushRouter = Router()
const notificationPushController = container.resolve(NotificationPushController)

notificacionesPushRouter.post(
    '/send',
    validateFields(NotificationSendDto),
    notificationPushController.sendNotificationHandler.bind(notificationPushController)
)

notificacionesPushRouter.use(authMiddleware)

notificacionesPushRouter.post(
    '/read',
    validateFields(MarkerReadNotificationDto),
    notificationPushController.markerNotificacionRead.bind(notificationPushController)
)

notificacionesPushRouter.get(
    '/previous',
    notificationPushController.listNotificationsPrevious.bind(notificationPushController)
)

export default notificacionesPushRouter