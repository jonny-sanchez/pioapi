import { inject, injectable } from "tsyringe";
import PolloEncabezadoRecepcionRepository from "../../../repositories/PolloEncabezadoRecepcionRepository";
import tEntradaInventarioModel from "../../../models/pdv/tables/tEntradaInventarioModel";
import PolloDetalleRecepcionadoRepository from "../../../repositories/PolloDetalleRecepcionadoRepository";
import { AJAX } from "../../../utils/HttpHelper";
import ResponseEntryArticulosSapType from "../../../types/Recepciones/ResponseEntryArticulosSapType";

@injectable()
export default class SapPolloService {

    private URL_SKD_ENTRY_AVICOLA:string = 'http://110.238.64.185:5064/EntradaMercaderiaPollo'

    constructor(
        @inject(PolloEncabezadoRecepcionRepository) private polloEncabezadoRecepcionRepository:PolloEncabezadoRecepcionRepository,
        @inject(PolloDetalleRecepcionadoRepository) private polloDetalleRecepcionadoRepository:PolloDetalleRecepcionadoRepository
    ) {}

    async getPolloForUploadSap(data:tEntradaInventarioModel | null):Promise<any> {
        const encabezadoPollo = await this.polloEncabezadoRecepcionRepository.findEncabezadoByIdEntradaInventario(
            data?.idEntradaInventario ?? 0,
            true,
            true
        )

        const detallePollo = await this.polloDetalleRecepcionadoRepository.getAllDetalleByIdEntradaInventario(
            data?.idEntradaInventario ?? 0,
            true
        )

        return {
            ...encabezadoPollo,
            productos: detallePollo
        }
    }

    async postUploadSapPollo(data:tEntradaInventarioModel | null):Promise<ResponseEntryArticulosSapType> {
        const object = await this.getPolloForUploadSap(data)
        // const resultSapUploadPollo = await AJAX(this.URL_SKD_ENTRY_AVICOLA, 'POST', null, object)
        const resultSapUploadPollo = {
            resultado: true,
            llave: 86792,
            llave2: 73196
        }
        return resultSapUploadPollo
    }

}