import { injectable } from "tsyringe";
import IPolloDetalleRecepcionadoRepository from "../interface/IPolloDetalleRecepcionadoRepository";
import PolloDetalleRecepcionView from "../models/grupopinulito/views/PolloDetalleRecepcionView";

@injectable()
export default class PolloDetalleRecepcionadoRepository implements IPolloDetalleRecepcionadoRepository{

    async getAllDetalleByIdEntradaInventario(idEntradaInventario: number, raw: boolean = false): Promise<PolloDetalleRecepcionView[]> {
        const result = await PolloDetalleRecepcionView.findAll({
            where: {
                idEntradaInventario: idEntradaInventario
            },
            raw
        })
        return result
    }

}