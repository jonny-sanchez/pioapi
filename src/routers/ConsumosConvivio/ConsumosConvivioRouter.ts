import { Router } from "express";
import { container } from "tsyringe";
import ConsumosConvivioController from "../../controllers/ConsumosConvivio/ConsumosConvivioController";
import authMiddleware from "../../middlewares/authMiddleware";
import validateFields from "../../middlewares/validateFields";
import { CreateConsumoConvivioDto } from "../../dtos/ConsumosConvivio/CreateConsumoConvivioDto";
import { ListConsumoPersonaConvivioDto } from "../../dtos/ConsumosConvivio/ListConsumoPersonaConvivioDto";

const consumosConvivioRouter = Router()
const consumosConvivioController = container.resolve(ConsumosConvivioController)

consumosConvivioRouter.use(authMiddleware)

consumosConvivioRouter.post(
    '/create',
    validateFields(CreateConsumoConvivioDto),
    consumosConvivioController.createConsumoConvivioPersona.bind(consumosConvivioController)
)

consumosConvivioRouter.delete(
    '/create',
    validateFields(CreateConsumoConvivioDto),
    consumosConvivioController.deleteConsumoConvivioPersona.bind(consumosConvivioController)
)

consumosConvivioRouter.get(
    '/list',
    validateFields(ListConsumoPersonaConvivioDto, null, true),
    consumosConvivioController.listConsumoPersona.bind(consumosConvivioController)
)

export default consumosConvivioRouter
