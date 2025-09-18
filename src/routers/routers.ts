import { Router } from "express";
import authRouter from "./Auth/AuthRouter";
import tipoVisitasRouter from "./Visitas/TipoVisitasRouter";
import tiendasModuloRouter from "./Tiendas/TiendasModuloRouter";

const router = Router()

router.use('/auth', authRouter)

router.use('/tipo/visitas', tipoVisitasRouter)

router.use('/tiendas/modulo', tiendasModuloRouter)

// router.use(authMiddleware)

// router.post('/rutas/save', (req:RequestAuth, res)=> {
//     const user  = req.user

//     res.json({ message: user })
// })

export default router