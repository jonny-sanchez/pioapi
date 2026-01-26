import { Router } from "express";
import authRouter from "./Auth/AuthRouter";
import tipoVisitasRouter from "./Visitas/TipoVisitasRouter";
import tiendasModuloRouter from "./Tiendas/TiendasModuloRouter";
import visitasRouter from "./Visitas/VisitasRouter";
import jwtRouter from "./Auth/JwtRouter";
import permissionRouter from "./Permissions/PermissionRouter";
import rutasViewRouter from "./Rutas/RutasViewRouter";
import articulosRutaRouter from "./Rutas/ArticulosRutaRouter";
import periodoRouter from "./Nomina/PeriodoRouter";
import firmaBoletaRouter from "./Nomina/FirmaBoletaRouter";
import boletaConsultaRouter from "./Nomina/BoletaConsultaRouter";
import recepcionesRouter from "./Recepciones/RecepcionesRouter";
import logsRouter from "./Logs/LogsRouter";
import productoConvivioRouter from "./ProductoConvivio/ProductoConvivioRouter";
import categoryProductoConvivioRouter from "./ProductoConvivio/CategoryProductoConvivioRouter";
import personaConvivioRouter from "./PersonaConvivio/PersonaConvivioRouter";
import consumosConvivioRouter from "./ConsumosConvivio/ConsumosConvivioRouter";
import notificacionesPushRouter from "./NotificacionesPush/NotificacionesPushRouter";
import visitaEmergenciaRouter from "./VisitaEmergencia/VisitaEmergenciaRouter";
import TipoBoletaRouter from "./TipoBoleta/TipoBoletaRouter";

const router = Router()

router.use('/auth', authRouter)

router.use('/tipo/visitas', tipoVisitasRouter)

router.use('/tiendas/modulo', tiendasModuloRouter)

router.use('/visitas', visitasRouter)

router.use('/jwt', jwtRouter)

router.use('/permissions', permissionRouter)

router.use('/rutas/view', rutasViewRouter)

router.use('/nomina/periodos', periodoRouter)

router.use('/nomina/firma-boleta', firmaBoletaRouter)

router.use('/nomina/boleta', boletaConsultaRouter)

router.use('/articulos/ruta', articulosRutaRouter)

router.use('/recepcion/articulos', recepcionesRouter)

router.use('/logs', logsRouter)

router.use('/producto/convivio', productoConvivioRouter)

router.use('/category/product/convivio', categoryProductoConvivioRouter)

router.use('/personas/convivio', personaConvivioRouter)

router.use('/consumos/convivio', consumosConvivioRouter)

router.use('/notificaciones', notificacionesPushRouter)

router.use('/visita/emergencia', visitaEmergenciaRouter)

router.use('/tipo/boleta', TipoBoletaRouter)

// router.use(authMiddleware)

// router.post('/rutas/save', (req:RequestAuth, res)=> {
//     const user  = req.user

//     res.json({ message: user })
// })

export default router