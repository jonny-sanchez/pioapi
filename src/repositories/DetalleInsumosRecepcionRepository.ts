import IDetalleInsumosRecepcionRepository from "../interface/IDetalleInsumosRecepcionRepository";
import InsumosDetalleRecepcionView from "../models/grupopinulito/views/InsumosDetalleRecepcionView";

export default class DetalleInsumosRecepcionRepository implements IDetalleInsumosRecepcionRepository {

    async getProductosByIdEntradaInventario(idEntradaInventario: number, raw: boolean = false): Promise<InsumosDetalleRecepcionView[]> {
        const result = await InsumosDetalleRecepcionView.findAll({
            where: {
                idEntradaInventario: idEntradaInventario
            },
            raw
        })
        return result
    }

}