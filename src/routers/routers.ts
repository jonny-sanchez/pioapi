import { Router } from "express";
import authRouter from "./Auth/AuthRouter";
import tipoVisitasRouter from "./Visitas/TipoVisitasRouter";
import tiendasModuloRouter from "./Tiendas/TiendasModuloRouter";
import visitasRouter from "./Visitas/VisitasRouter";
import jwtRouter from "./Auth/JwtRouter";
import permissionRouter from "./Permissions/PermissionRouter";
<<<<<<< HEAD
import rutasViewRouter from "./Rutas/RutasViewRouter";
=======
import ultimosPeriodosPagadosRouter from "./Periodos/UltimosPeriodosPagadosRouter";
import ResumenNominaRouter from "./Nomina/ResumenNominaRouter";
>>>>>>> 3d5803dc7687b436710b7be3581df19cded2a1a3

const router = Router()

router.use('/auth', authRouter)

router.use('/tipo/visitas', tipoVisitasRouter)

router.use('/tiendas/modulo', tiendasModuloRouter)

router.use('/visitas', visitasRouter)

router.use('/jwt', jwtRouter)

router.use('/permissions', permissionRouter)

<<<<<<< HEAD
router.use('/rutas/view', rutasViewRouter)
=======
router.use('/periodos', ultimosPeriodosPagadosRouter)

router.use('/nomina/resumen', ResumenNominaRouter)
>>>>>>> 3d5803dc7687b436710b7be3581df19cded2a1a3

// router.use(authMiddleware)

// router.post('/rutas/save', (req:RequestAuth, res)=> {
//     const user  = req.user

//     res.json({ message: user })
// })

export default router