import IDetalleEmpleadoCootraguaViewRepository from "../interface/IDetalleEmpleadoCootraguaViewRepository";
import DetalleEmpleadoCootraguaView from "../models/nomina/views/DetalleEmpleadoCootraguaView";
import { injectable } from "tsyringe";

@injectable()
export default class DetalleEmpleadoCootraguaViewRepository implements IDetalleEmpleadoCootraguaViewRepository{

    async findByCodigo(codigo: number, error: boolean = true, raw: boolean = false): Promise<DetalleEmpleadoCootraguaView | null> {
        const result = await DetalleEmpleadoCootraguaView.findByPk(codigo, { raw: raw })
        if(error) if(!result) throw new Error("Empleado no encontrado.");
        return result
    }

}