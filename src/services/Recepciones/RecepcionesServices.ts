import { inject, injectable } from "tsyringe";
import { saveRecepcionDtoType } from "../../dtos/recepciones/SaveRecepcionDto";
import { userToken } from "../../types/ResponseTypes";
import { Transaction } from "sequelize";
import EntradaPdvService from "./EntradaPdv/EntradaPdvService";
import { SERIES_AVICOLA, SERIES_INSUMOS } from "../../utils/Recepcion/RecepcionUtils";
import SapInsumosService from "./SapInsumos/SapInsumosService";
import { clearTextAndUpperCase } from "../../utils/Cadenas/TextUtil";
import SapPolloService from "./SapPollo/SapPolloService";
import ResponseEntryArticulosSapType from "../../types/Recepciones/ResponseEntryArticulosSapType";
import tEntradaInventarioModel from "../../models/pdv/tables/tEntradaInventarioModel";
import RecepcionEventPush from "../../events/Recepcion/RecepcionEventPush";

@injectable()
export default class RecepcionesServices {

    constructor(
        @inject(EntradaPdvService) private entradaPdvService:EntradaPdvService,
        @inject(SapInsumosService) private sapInsumosService:SapInsumosService,
        @inject(SapPolloService) private sapPolloService:SapPolloService
    ) {}

    async saveRecepcionService(data:saveRecepcionDtoType, user:userToken) : Promise<any> {

        //emitir notificacion
        const { tienda_nombre, name_tipo_entrega } = data.cabecera
        const codigo_empleado_piloto = Number(data?.cabecera?.codigo_empleado_piloto ?? 0)
        let total_articulos:number = 0
        data?.detalle?.forEach(({ cantidad }) => total_articulos += Number(cantidad))
        //variables para notificacion

        let responseSapSdk:ResponseEntryArticulosSapType|null = null

        this.entradaPdvService.validSerieEntrada(data)
        
        const entradaEncabezadoPdv:tEntradaInventarioModel = await this.entradaPdvService.createEntradas(data) as tEntradaInventarioModel

        const isInsumo = SERIES_INSUMOS.includes(clearTextAndUpperCase(entradaEncabezadoPdv?.serie ?? ''))

        const isPollo = SERIES_AVICOLA.includes(clearTextAndUpperCase(entradaEncabezadoPdv?.serie ?? ''))

        if(isInsumo) responseSapSdk = await this.sapInsumosService.postUploadSapInsumos(entradaEncabezadoPdv)

        if(isPollo) responseSapSdk = await this.sapPolloService.postUploadSapPollo(entradaEncabezadoPdv)

        await this.entradaPdvService.updateEncabezadoByIdEntradaInventario(
            entradaEncabezadoPdv, 
            responseSapSdk as ResponseEntryArticulosSapType
        )

        //emitir notificacion
        codigo_empleado_piloto && RecepcionEventPush.EVENT_EMIT_NOTIFICATION({ 
            data: { 
                body: `Se completo una entrega de '${name_tipo_entrega??" -- "}' en la tienda '${tienda_nombre??' -- '}', total de la recepcion: ${total_articulos} articulos.`,
                id_asunto_notificacion: 1,
                title: `${tienda_nombre??" -- "}`,
                user: codigo_empleado_piloto,
                data_payload: {}
            } 
        })

        return responseSapSdk
    }

}