import { Router } from "express";
import { container } from "tsyringe";
import BoletaConsultaController from "../../controllers/Nomina/BoletaConsultaController";
import authMiddleware from "../../middlewares/authMiddleware";
import validateFields from "../../middlewares/validateFields";
import { ConsultaBoletaDto } from "../../dtos/ConsultaBoletaDto";

const boletaConsultaRouter = Router();
const boletaConsultaController = container.resolve(BoletaConsultaController);

// Aplicar middleware de autenticación a todas las rutas
boletaConsultaRouter.use(authMiddleware);

// GET /api/nomina/boleta/resumen - Obtener resumen de pago del empleado autenticado
boletaConsultaRouter.get('/resumen', 
    validateFields(ConsultaBoletaDto, null, true),
    boletaConsultaController.obtenerResumenPago.bind(boletaConsultaController)
);

// GET /api/nomina/boleta/detalle-completo - Obtener detalle completo del empleado autenticado
boletaConsultaRouter.get('/detalle-completo', 
    validateFields(ConsultaBoletaDto, null, true),
    boletaConsultaController.obtenerDetalleCompleto.bind(boletaConsultaController)
);

// GET /api/nomina/boleta/verificar-existencia - Verificar existencia de boleta del empleado autenticado
boletaConsultaRouter.get('/verificar-existencia', 
    validateFields(ConsultaBoletaDto, null, true),
    boletaConsultaController.verificarExistenciaBoleta.bind(boletaConsultaController)
);

export default boletaConsultaRouter;