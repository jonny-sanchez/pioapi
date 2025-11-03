import { Router } from "express";
import { container } from "tsyringe";
import FirmaBoletaController from "../../controllers/Nomina/FirmaBoletaController";
import authMiddleware from "../../middlewares/authMiddleware";
import validateFields from "../../middlewares/validateFields";
import { FirmaBoletaDto, InvalidarFirmaDto, VerificarIntegridadDto } from "../../dtos/FirmaBoletaDto";
import { VerificarFirmaExistenteDto } from "../../dtos/VerificarFirmaExistenteDto";

const firmaBoletaRouter = Router();
const firmaBoletaController = container.resolve(FirmaBoletaController);

// Aplicar middleware de autenticación a todas las rutas
firmaBoletaRouter.use(authMiddleware);

// POST /api/nomina/firma/firmar - Firmar una boleta de pago
firmaBoletaRouter.post('/firmar', 
    validateFields(FirmaBoletaDto), 
    firmaBoletaController.firmarBoleta.bind(firmaBoletaController)
);

// GET /api/nomina/firma/historial - Obtener historial de firmas del empleado
firmaBoletaRouter.get('/historial', 
    firmaBoletaController.obtenerHistorialFirmas.bind(firmaBoletaController)
);

// GET /api/nomina/firma/existe?id_periodo=X - Verificar si existe firma para un periodo
firmaBoletaRouter.get('/existe', 
    validateFields(VerificarFirmaExistenteDto, null, true),
    firmaBoletaController.verificarFirmaExistente.bind(firmaBoletaController)
);

// POST /api/nomina/firma/verificar - Verificar integridad de una firma
firmaBoletaRouter.post('/verificar', 
    validateFields(VerificarIntegridadDto), 
    firmaBoletaController.verificarIntegridad.bind(firmaBoletaController)
);

// POST /api/nomina/firma/invalidar - Invalidar una firma (solo admin)
firmaBoletaRouter.post('/invalidar', 
    validateFields(InvalidarFirmaDto), 
    firmaBoletaController.invalidarFirma.bind(firmaBoletaController)
);

export default firmaBoletaRouter;