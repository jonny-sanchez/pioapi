import { injectable } from "tsyringe";
import IEncabezadoInsumosRecepcionadosRepository from "../interface/IEncabezadoInsumosRecepcionadosRepository";
import InsumosEncabezadoRecepcionadosView from "../models/grupopinulito/views/InsumosEncabezadoRecepcionadosView";

@injectable()
export default class EncabezadoInsumosRecepcionadosRepository implements IEncabezadoInsumosRecepcionadosRepository {

    async findEncabezadoBySerieAndIdEntradaInventario(serie: string, idEntrada: number, error: boolean = true, raw: boolean = false): Promise<InsumosEncabezadoRecepcionadosView | null> {
        const result = await InsumosEncabezadoRecepcionadosView.findOne({ where: { 
            serie: serie,
            idEntrada: idEntrada
        }, raw })
        if(!result && error) throw new Error(`Error no se encontro ningun encabezado de recepcion con serie: ${serie} y idEntradaInventario: ${idEntrada}`);
        return result
    }

}