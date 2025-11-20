import { Router } from "express";
import { container } from "tsyringe";
import LogsController from "../../controllers/Logs/LogsController";
import authMiddleware from "../../middlewares/authMiddleware";
import validateFields from "../../middlewares/validateFields";
import { ListContentByLogDto } from "../../dtos/Logs/ListContentByLogDto";

const logsRouter = Router()
const logsController = container.resolve(LogsController)

logsRouter.use(authMiddleware)

logsRouter.get(
    '/list', 
    logsController.listAllLogs.bind(logsController)
)

logsRouter.get(
    '/list/content',
    validateFields(ListContentByLogDto, null, true),
    logsController.listContentByLog.bind(logsController)
)

export default logsRouter