import { Router } from "express";
import { container } from "tsyringe";
import PersonasConvivioController from "../../controllers/PersonasConvivio/PersonasConvivioController";
import authMiddleware from "../../middlewares/authMiddleware";
import validateFields from "../../middlewares/validateFields";
import { CreateInvitadoDto } from "../../dtos/PersonasConvivio/CreateInvitadoDto";
import { PersonasQRDto } from "../../dtos/PersonasConvivio/PersonasQRDto";

const personaConvivioRouter = Router()
const personasConvivioController = container.resolve(PersonasConvivioController)

personaConvivioRouter.use(authMiddleware)

personaConvivioRouter.post(
    '/create/invitado',
    validateFields(CreateInvitadoDto),
    personasConvivioController.createNwPersonaInvitada.bind(personasConvivioController)
)

personaConvivioRouter.get(
    '/list/invitados',
    personasConvivioController.getAllInvitados.bind(personasConvivioController)
)

personaConvivioRouter.get(
    '/scanner/qr',
    validateFields(PersonasQRDto, null, true),
    personasConvivioController.getPersonaScannerQR.bind(personasConvivioController)
)

export default personaConvivioRouter