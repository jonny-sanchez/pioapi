import { Router } from "express";
import { container } from "tsyringe";
import ArticulosRutaController from "../../controllers/Rutas/ArticulosRutaController";
import authMiddleware from "../../middlewares/authMiddleware";
import validateFields from "../../middlewares/validateFields";
import { PedidosRutaDto } from "../../dtos/Rutas/PedidosRutaDto";

const articulosRutaRouter = Router()
const articulosRutaController = container.resolve(ArticulosRutaController)

articulosRutaRouter.use(authMiddleware)

articulosRutaRouter.get('/list', validateFields(PedidosRutaDto, null, true), articulosRutaController.listArticulosRuta.bind(articulosRutaController))

export default articulosRutaRouter