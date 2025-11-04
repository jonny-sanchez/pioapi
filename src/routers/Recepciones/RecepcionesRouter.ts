import { Router } from "express";
import { container } from "tsyringe";
import RecepcionesController from "../../controllers/Recepcciones/RecepcionesController";
import validateFields from "../../middlewares/validateFields";
import authMiddleware from "../../middlewares/authMiddleware";
import { saveRecepcionDto } from "../../dtos/recepciones/SaveRecepcionDto";

const recepcionesRouter = Router()
const recepcionesController = container.resolve(RecepcionesController)

recepcionesRouter.use(authMiddleware)

recepcionesRouter.post(
    '/save',
    validateFields(saveRecepcionDto),
    recepcionesController.uploadRecepccionesClient.bind(recepcionesController)
)

export default recepcionesRouter
