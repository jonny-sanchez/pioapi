import { Router } from "express";
import { container } from "tsyringe";
import authMiddleware from "../../middlewares/authMiddleware";
import TipoBoletaController from "../../controllers/TipoBoleta/TipoBoletaController";

const TipoBoletaRouter = Router()
const tipoBoletaController = container.resolve(TipoBoletaController)

TipoBoletaRouter.use(authMiddleware)

TipoBoletaRouter.get('/', tipoBoletaController.getAllTipoBoletas.bind(tipoBoletaController))

export default TipoBoletaRouter