import { Router } from "express";
import { container } from "tsyringe";
import TiendasModuloController from "../../controllers/Tiendas/TiendasModuloController";
import authMiddleware from "../../middlewares/authMiddleware";

const tiendasModuloRouter = Router()
const tiendasModuloController = container.resolve(TiendasModuloController)

tiendasModuloRouter.use(authMiddleware)

tiendasModuloRouter.get('/all', tiendasModuloController.listAllTiendas.bind(tiendasModuloController))

export default tiendasModuloRouter