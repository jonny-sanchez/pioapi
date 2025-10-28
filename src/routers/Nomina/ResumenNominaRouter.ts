import { Router } from "express";
import { container } from "tsyringe";
import ResumenNominaController from "../../controllers/Nomina/ResumenNominaController";
import authMiddleware from "../../middlewares/authMiddleware";
import validateFields from "../../middlewares/validateFields";
import { FindNominaDto } from "../../dtos/FindNominaDto";

const ResumenNominaRouter = Router();
const resumenNominaController = container.resolve(ResumenNominaController);

ResumenNominaRouter.use(authMiddleware);

ResumenNominaRouter.get('/find', validateFields(FindNominaDto, null, true), resumenNominaController.findByCodigoAndPeriodo.bind(resumenNominaController));

export default ResumenNominaRouter;