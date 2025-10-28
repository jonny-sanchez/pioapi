import { Router } from "express";
import authRouter from "./Auth/AuthRouter";
import tipoVisitasRouter from "./Visitas/TipoVisitasRouter";
import tiendasModuloRouter from "./Tiendas/TiendasModuloRouter";
import visitasRouter from "./Visitas/VisitasRouter";
import jwtRouter from "./Auth/JwtRouter";
import permissionRouter from "./Permissions/PermissionRouter";
import rutasViewRouter from "./Rutas/RutasViewRouter";
import ultimosPeriodosPagadosRouter from "./Periodos/UltimosPeriodosPagadosRouter";
import ResumenNominaRouter from "./Nomina/ResumenNominaRouter";

const router = Router()

router.use('/auth', authRouter)

router.use('/tipo/visitas', tipoVisitasRouter)

router.use('/tiendas/modulo', tiendasModuloRouter)

router.use('/visitas', visitasRouter)

router.use('/jwt', jwtRouter)

router.use('/permissions', permissionRouter)

router.use('/rutas/view', rutasViewRouter)

router.use('/periodos', ultimosPeriodosPagadosRouter)

router.use('/nomina/resumen', ResumenNominaRouter)

// router.use(authMiddleware)

// router.post('/rutas/save', (req:RequestAuth, res)=> {
//     const user  = req.user

//     res.json({ message: user })
// })

export default router