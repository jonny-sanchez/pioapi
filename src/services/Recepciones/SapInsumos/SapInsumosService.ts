import { inject, injectable } from "tsyringe";
import EncabezadoInsumosRecepcionadosRepository from "../../../repositories/EncabezadoInsumosRecepcionadosRepository";
import tEntradaInventarioModel from "../../../models/pdv/tables/tEntradaInventarioModel";
import DetalleInsumosRecepcionRepository from "../../../repositories/DetalleInsumosRecepcionRepository";
import ResponseEntryArticulosSapType from "../../../types/Recepciones/ResponseEntryArticulosSapType";

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

    async postUploadSapInsumos(data:tEntradaInventarioModel | null):Promise<ResponseEntryArticulosSapType> {
        const object = await this.getInsumosForUploadSap(data)
        
        const resultSapUploadInsumos = {
            resultado: true,
            llave: 86792,
            llave2: 73196
        }
        return resultSapUploadInsumos
    }

}