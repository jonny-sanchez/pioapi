import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import validateFields from "../../middlewares/validateFields";
import VisitaEmergenciaController from "../../controllers/VisitaEmergencia/VisitaEmergenciaController";
import { container } from "tsyringe";
import { UpdateVisitaEmergenciaDto } from "../../dtos/VisitaEmergencia/UpdateVisitaEmergenciaDto";
import { FindVisitaEmergenciaDto } from "../../dtos/VisitaEmergencia/FindVisitaEmergenciaDto";

const visitaEmergenciaRouter = Router()
const visitaEmergenciaController = container.resolve(VisitaEmergenciaController)

visitaEmergenciaRouter.use(authMiddleware)

visitaEmergenciaRouter.put(
    '/update/:id_visita',
    validateFields(UpdateVisitaEmergenciaDto, null, true),
    visitaEmergenciaController.updateVisitaEmergencia.bind(visitaEmergenciaController)
)

visitaEmergenciaRouter.get(
    '/:id_visita',
    validateFields(FindVisitaEmergenciaDto, null, true),
    visitaEmergenciaController.getVisitaEmergencia.bind(visitaEmergenciaController)
)

export default visitaEmergenciaRouter