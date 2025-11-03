import { Router } from "express";
import { container } from "tsyringe";
import PeriodoController from "../../controllers/Nomina/PeriodoController";
import authMiddleware from "../../middlewares/authMiddleware";

const periodoRouter = Router();
const periodoController = container.resolve(PeriodoController);

// Aplicar middleware de autenticación a todas las rutas
periodoRouter.use(authMiddleware);

// GET /api/nomina/periodos/ultimos-pagados?limite=10 - Obtener últimos periodos pagados
periodoRouter.get('/ultimos-pagados', 
    periodoController.obtenerUltimosPeriodosPagados.bind(periodoController)
);

// GET /api/nomina/periodos/:id_periodo - Obtener periodo por ID
periodoRouter.get('/:id_periodo', 
    periodoController.obtenerPeriodoPorId.bind(periodoController)
);

// GET /api/nomina/periodos/:id_periodo/verificar-pagado - Verificar si un periodo está pagado
periodoRouter.get('/:id_periodo/verificar-pagado', 
    periodoController.verificarPeriodoPagado.bind(periodoController)
);

// GET /api/nomina/periodos/estado?pagada=true - Obtener periodos por estado
periodoRouter.get('/estado', 
    periodoController.obtenerPeriodosPorEstado.bind(periodoController)
);

export default periodoRouter;