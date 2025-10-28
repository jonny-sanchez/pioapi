import { Router } from "express";
import { container } from "tsyringe";
import authMiddleware from "../../middlewares/authMiddleware";
import RutasViewController from "../../controllers/Rutas/RutasViewController";
import validateFields from "../../middlewares/validateFields";
import { ListRutasFilterDto } from "../../dtos/Rutas/ListRutasFilterDto";
import { ListTiendasDateDto } from "../../dtos/Rutas/ListTiendasDateDto";

const rutasViewRouter = Router()
const rutasViewController = container.resolve(RutasViewController)

rutasViewRouter.use(authMiddleware)

rutasViewRouter.get('/list', validateFields(ListRutasFilterDto), rutasViewController.listAllByCodigoEmpleado.bind(rutasViewController))

rutasViewRouter.get('/tiendas/rutas', validateFields(ListTiendasDateDto), rutasViewController.listTiendasByFecha.bind(rutasViewController))

export default rutasViewRouter