import { inject, injectable } from "tsyringe";
import EncabezadoInsumosRecepcionadosRepository from "../../../repositories/EncabezadoInsumosRecepcionadosRepository";
import tEntradaInventarioModel from "../../../models/pdv/tables/tEntradaInventarioModel";
import DetalleInsumosRecepcionRepository from "../../../repositories/DetalleInsumosRecepcionRepository";

@injectable()
export default class SapInsumosService {

    constructor(
        @inject(EncabezadoInsumosRecepcionadosRepository) private encabezadoInsumosRecepcionadosRepository:EncabezadoInsumosRecepcionadosRepository,
        @inject(DetalleInsumosRecepcionRepository) private detalleInsumosRecepcionRepository:DetalleInsumosRecepcionRepository
    ) {}

    async getInsumosForUploadSap(data:tEntradaInventarioModel | null):Promise<any> {
        const encabezadoInsumos = await this.encabezadoInsumosRecepcionadosRepository.findEncabezadoBySerieAndIdEntradaInventario(
            data?.serie ?? '',
            data?.idEntradaInventario ?? 0,
            true,
            true
        )

        const detalleInsumos = await this.detalleInsumosRecepcionRepository.getProductosByIdEntradaInventario(data?.idEntradaInventario ?? 0, true)

        return {
            ...encabezadoInsumos,
            empresa: "00001",
            productos: detalleInsumos
        }
    }

}