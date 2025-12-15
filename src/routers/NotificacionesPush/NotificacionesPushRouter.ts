import { Router } from "express";
import { container } from "tsyringe";
import NotificationPushController from "../../controllers/NotificationPush/NotificationPushController";
import authMiddleware from "../../middlewares/authMiddleware";

const notificacionesPushRouter = Router()
const notificationPushController = container.resolve(NotificationPushController)

notificacionesPushRouter.use(authMiddleware)

notificacionesPushRouter.post(
    '/send',
    notificationPushController.sendNotificationHandler.bind(notificationPushController)
)

export default notificacionesPushRouter