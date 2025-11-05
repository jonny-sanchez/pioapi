import { injectable } from "tsyringe";
import IPolloEncabezadoRecepcionRepository from "../interface/IPolloEncabezadoRecepcionRepository";
import PolloEncabezadoRecepcionView from "../models/grupopinulito/views/PolloEncabezadoRecepcionView";

@injectable()
export default class PolloEncabezadoRecepcionRepository implements IPolloEncabezadoRecepcionRepository {

    async findEncabezadoByIdEntradaInventario(idEntradaInventario: number, error: boolean = true, raw: boolean = false): Promise<PolloEncabezadoRecepcionView | null> {
        const result = await PolloEncabezadoRecepcionView.findOne({
            where: {
                idEntrada: idEntradaInventario
            },
            raw
        })
        if(!result && error) throw new Error(`Error no se econtro ningun encabezado de pollo con idEntradaInventario -> ${idEntradaInventario}`);
        return result
    }

}