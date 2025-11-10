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

@injectable()
export default class RecepcionesServices {

    constructor(
        @inject(EntradaPdvService) private entradaPdvService:EntradaPdvService,
        @inject(SapInsumosService) private sapInsumosService:SapInsumosService,
        @inject(SapPolloService) private sapPolloService:SapPolloService
    ) {}

    async saveRecepcionService(data:saveRecepcionDtoType, user:userToken) : Promise<any> {

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

        return responseSapSdk
    }

}