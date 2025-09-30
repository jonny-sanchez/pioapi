import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import TipoVisitasController from "../../controllers/Visitas/TipoVisitasController";
import { container } from "tsyringe";

const tipoVisitasRouter = Router()
const tipoVisitasController = container.resolve(TipoVisitasController)

tipoVisitasRouter.use(authMiddleware)

tipoVisitasRouter.get('/all', tipoVisitasController.listAllTipoVisitas.bind(tipoVisitasController))

export default tipoVisitasRouter