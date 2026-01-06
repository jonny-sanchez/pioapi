import IDetalleEmpleadoCootraguaViewRepository from "../interface/IDetalleEmpleadoCootraguaViewRepository";
import DetalleEmpleadoCootraguaView from "../models/nomina/views/DetalleEmpleadoCootraguaView";
import { injectable } from "tsyringe";
import UsersModel from "../models/pioapp/tables/UsersModel";
import { Op } from "sequelize";

@injectable()
export default class DetalleEmpleadoCootraguaViewRepository implements IDetalleEmpleadoCootraguaViewRepository{

    async findByCodigo(codigo: number, error: boolean = true, raw: boolean = false): Promise<DetalleEmpleadoCootraguaView | null> {
        const result = await DetalleEmpleadoCootraguaView.findByPk(codigo, { raw: raw })
        if(error) if(!result) throw new Error("Empleado no encontrado.");
        return result
    }

    async findEmpleadoLowByUsersModel(users: UsersModel[] = [], raw: boolean = false): Promise<DetalleEmpleadoCootraguaView[]> {
        const result = await DetalleEmpleadoCootraguaView.findAll({
            where: {
                codEmpleado: {
                    [Op.in]: users.flatMap(({ id_users }) => id_users)
                },
                baja: 1
            },
            raw
        })
        return result
    }

}