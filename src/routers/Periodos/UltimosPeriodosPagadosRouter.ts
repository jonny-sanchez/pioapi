import { Router } from "express";
import { container } from "tsyringe";
import authMiddleware from "../../middlewares/authMiddleware";
import UltimosPeriodosPagadosController from "../../controllers/Periodos/UltimosPeriodosPagadosController";

const ultimosPeriodosPagadosRouter = Router()
const ultimosPeriodosPagadosController = container.resolve(UltimosPeriodosPagadosController)

ultimosPeriodosPagadosRouter.use(authMiddleware)

ultimosPeriodosPagadosRouter.get('/all', ultimosPeriodosPagadosController.listAllPeriodos.bind(ultimosPeriodosPagadosController))

export default ultimosPeriodosPagadosRouter