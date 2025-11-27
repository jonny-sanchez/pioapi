import { Router } from "express";
import { container } from "tsyringe";
import CategoryProductoConvivioController from "../../controllers/ProductoConvivio/CategoryProductoConvivioController";
import authMiddleware from "../../middlewares/authMiddleware";

const categoryProductoConvivioRouter = Router()
const categoryProductoConvivioController = container.resolve(CategoryProductoConvivioController)

categoryProductoConvivioRouter.use(authMiddleware)

categoryProductoConvivioRouter.get(
    '/all',
    categoryProductoConvivioController.listAll.bind(categoryProductoConvivioController)
)

export default categoryProductoConvivioRouter