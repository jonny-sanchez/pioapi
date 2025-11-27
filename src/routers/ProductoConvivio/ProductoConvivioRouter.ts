import { Router } from "express";
import { container } from "tsyringe";
import ProductoConvivioController from "../../controllers/ProductoConvivio/ProductoConvivioController";
import authMiddleware from "../../middlewares/authMiddleware";
import validateFields from "../../middlewares/validateFields";
import { NwProductConvivioDto } from "../../dtos/ProductoConvivio/NwProductConvivioDto";

const productoConvivioRouter = Router()
const productoConvivioController = container.resolve(ProductoConvivioController)

productoConvivioRouter.use(authMiddleware)

productoConvivioRouter.post(
    '/create', 
    validateFields(NwProductConvivioDto),
    productoConvivioController.nwProductConvivio.bind(productoConvivioController)
)

export default productoConvivioRouter
