import { Router } from "express";
import { container } from "tsyringe";
import authMiddleware from "../../middlewares/authMiddleware";
import PermissionController from "../../controllers/Permissions/PermissionController";

const permissionRouter = Router()
const permissionController = container.resolve(PermissionController)

permissionRouter.use(authMiddleware)

permissionRouter.get('/all', permissionController.findMenusByRol.bind(permissionController))

export default permissionRouter