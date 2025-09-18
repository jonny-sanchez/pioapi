import ItEmpleadoRepository from "../interface/ItEmpleadoRepository";
import tEmpleadoModel from "../models/nomina/tables/tEmpleadoModel";
import { injectable } from 'tsyringe'

@injectable()
export default class tEmpleadoRepository implements ItEmpleadoRepository{

    async findByCodigo(codigo: number, error:boolean = true, raw:boolean = false): Promise<tEmpleadoModel | null> {
        const empleado = await tEmpleadoModel.findByPk(codigo, { raw: raw })
        if(error) if(!empleado) throw new Error("Empleado no encontrado.");
        return empleado
    }

}