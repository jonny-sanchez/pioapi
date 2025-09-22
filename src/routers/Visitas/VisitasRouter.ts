import { container } from "tsyringe";
import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import VisitasController from "../../controllers/Visitas/VisitasController";
import validateFields from "../../middlewares/validateFields";
import { CreateVisitaDto, fileConfigVisitaDto } from "../../dtos/CreateVisitaDto";

const visitasRouter = Router()
const visitasController = container.resolve(VisitasController)

visitasRouter.use(authMiddleware)

visitasRouter.post('/create', validateFields(CreateVisitaDto, fileConfigVisitaDto), visitasController.createVisita.bind(visitasController))

export default visitasRouter