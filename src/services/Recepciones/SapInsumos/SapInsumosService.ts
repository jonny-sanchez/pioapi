import { inject, injectable } from "tsyringe";
import EncabezadoInsumosRecepcionadosRepository from "../../../repositories/EncabezadoInsumosRecepcionadosRepository";
import tEntradaInventarioModel from "../../../models/pdv/tables/tEntradaInventarioModel";
import DetalleInsumosRecepcionRepository from "../../../repositories/DetalleInsumosRecepcionRepository";
import ResponseEntryArticulosSapType from "../../../types/Recepciones/ResponseEntryArticulosSapType";
import SolicitudInsumosService from "../../SolicitudInsumos/SolicitudInsumosService";
import { validResponseSapRecepcion } from "../../../utils/Recepcion/RecepcionUtils";
import { AJAX } from "../../../utils/HttpHelper";

@injectable()
export default class SapInsumosService {

    private URL_SKD_TRANSFER_INSUMOS:string = 'http://110.238.64.185:5064/SolicitudSupervisorTiendaPos'
    private URL_SKD_ENTRY_INSUMOS:string = 'http://110.238.64.185:5064/EntradaMercaderiaPollo'

    constructor(
        @inject(EncabezadoInsumosRecepcionadosRepository) private encabezadoInsumosRecepcionadosRepository:EncabezadoInsumosRecepcionadosRepository,
        @inject(DetalleInsumosRecepcionRepository) private detalleInsumosRecepcionRepository:DetalleInsumosRecepcionRepository,
        @inject(SolicitudInsumosService) private solicitudInsumosService:SolicitudInsumosService
    ) {}

    async getInsumosForUploadSap(data:tEntradaInventarioModel):Promise<any> {
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

    async postUploadSapInsumos(data:tEntradaInventarioModel):Promise<ResponseEntryArticulosSapType> {
        const companysEntry = ["00002", "00003", "00004", "00005", "00007"]

        let object = await this.getInsumosForUploadSap(data)
        
        const responseSKDTransfer:ResponseEntryArticulosSapType = await AJAX(this.URL_SKD_TRANSFER_INSUMOS, 'POST', null, object)

        validResponseSapRecepcion(responseSKDTransfer)

        await this.solicitudInsumosService.updateInsumoPdv(data, responseSKDTransfer)

        if(!companysEntry.includes(data.empresa)) return responseSKDTransfer

        object = { ...object, empresa: data.empresa, cardCode: 'PG00007' }

        const responseSKDEntry:ResponseEntryArticulosSapType = await AJAX(this.URL_SKD_ENTRY_INSUMOS, 'POST', null, object)

        validResponseSapRecepcion(responseSKDEntry)

        return responseSKDEntry

    }

}