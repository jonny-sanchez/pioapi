import { inject, injectable } from "tsyringe";
import { saveRecepcionDtoType } from "../../dtos/recepciones/SaveRecepcionDto";
import { userToken } from "../../types/ResponseTypes";
import { Transaction } from "sequelize";
import EntradaPdvService from "./EntradaPdv/EntradaPdvService";
import { SERIES_AVICOLA, SERIES_INSUMOS } from "../../utils/Recepcion/RecepcionUtils";
import SapInsumosService from "./SapInsumos/SapInsumosService";
import { clearTextAndUpperCase } from "../../utils/Cadenas/TextUtil";
import SapPolloService from "./SapPollo/SapPolloService";

@injectable()
export default class RecepcionesServices {

    constructor(
        @inject(EntradaPdvService) private entradaPdvService:EntradaPdvService,
        @inject(SapInsumosService) private sapInsumosService:SapInsumosService,
        @inject(SapPolloService) private sapPolloService:SapPolloService
    ) {}

    async saveRecepcionService(data:saveRecepcionDtoType, user:userToken) : Promise<any> {

        this.entradaPdvService.validSerieEntrada(data)
        
        const entradaEncabezadoPdv = await this.entradaPdvService.createEntradas(data)

        const isInsumo = SERIES_INSUMOS.includes(clearTextAndUpperCase(entradaEncabezadoPdv?.serie ?? ''))

        const isPollo = SERIES_AVICOLA.includes(clearTextAndUpperCase(entradaEncabezadoPdv?.serie ?? ''))

        return entradaEncabezadoPdv

        // if(isInsumo) {
        //     const getInsumoRecepcionado = await this.sapInsumosService.postUploadSapInsumos(entradaEncabezadoPdv)
        //     return getInsumoRecepcionado
        // }

        // if(isPollo) {
        //     const getPolloRecepcionado = await this.sapPolloService.postUploadSapPollo(entradaEncabezadoPdv)
        //     return getPolloRecepcionado
        // }


        // throw new Error("Error no se carga la informacion de recepciones a SAP porque no se encontro una serie valida.");
    }

}