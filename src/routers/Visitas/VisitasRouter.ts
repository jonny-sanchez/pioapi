import { container } from "tsyringe";
import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import VisitasController from "../../controllers/Visitas/VisitasController";
import validateFields from "../../middlewares/validateFields";
import { CreateVisitaDto } from "../../dtos/CreateVisitaDto";

const visitasRouter = Router()
const visitasController = container.resolve(VisitasController)

visitasRouter.use(authMiddleware)

visitasRouter.post('/create', validateFields(CreateVisitaDto), visitasController.createVisita.bind(visitasController))

export default visitasRouter