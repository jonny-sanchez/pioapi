import { Router } from "express";
import { container } from "tsyringe";
import TiendasModuloController from "../../controllers/Tiendas/TiendasModuloController";
import authMiddleware from "../../middlewares/authMiddleware";
import validateFields from "../../middlewares/validateFields";
import { TiendaByCodigoDto } from "../../dtos/TiendasModulo/TiendaByCodigoDto";

const tiendasModuloRouter = Router()
const tiendasModuloController = container.resolve(TiendasModuloController)

tiendasModuloRouter.use(authMiddleware)

tiendasModuloRouter.get('/all', tiendasModuloController.listAllTiendas.bind(tiendasModuloController))

tiendasModuloRouter.get(
    '/', 
    validateFields(TiendaByCodigoDto, null, true),
    tiendasModuloController.getTiendaByCodigo.bind(tiendasModuloController)
)

export default tiendasModuloRouter