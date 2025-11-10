import { inject, injectable } from "tsyringe";
import EntradaInventarioDetalleRepository from "../../../repositories/EntradaInventarioDetalleRepository";
import EntradaInventarioRepository from "../../../repositories/EntradaInventarioRepository";
import { saveRecepcionDtoType } from "../../../dtos/recepciones/SaveRecepcionDto";
import { Sequelize, Transaction } from "sequelize";
import tEntradaInventarioModel from "../../../models/pdv/tables/tEntradaInventarioModel";
import { SERIES_AVICOLA, SERIES_INSUMOS } from "../../../utils/Recepcion/RecepcionUtils";
import { handleTransaction } from "../../../utils/DB/TransactionsHelpers";
import { clearTextAndUpperCase } from "../../../utils/Cadenas/TextUtil";
import ResponseEntryArticulosSapType from "../../../types/Recepciones/ResponseEntryArticulosSapType";

@injectable()
export default class EntradaPdvService {

    constructor (
        @inject(EntradaInventarioDetalleRepository) private entradaInventarioDetalleRepository:EntradaInventarioDetalleRepository,
        @inject(EntradaInventarioRepository) private entradaInventarioRepository:EntradaInventarioRepository
    ) {}

    validSerieEntrada(data:saveRecepcionDtoType) {
        const serie = clearTextAndUpperCase(data.cabecera.serie)
        const objValidSeries = [
            ...SERIES_AVICOLA,
            ...SERIES_INSUMOS
        ]

        const valid = objValidSeries.includes(serie)

        if(!valid) throw new Error(`Error Serie -> [${serie}] invalida.`);
    }

    async createEntradas(data:saveRecepcionDtoType) : Promise<tEntradaInventarioModel | null> {

        const result = await handleTransaction(async(t) => {

            const { cabecera, detalle } = data

            const dataCreateEntradaInventario:Partial<tEntradaInventarioModel> = {
                serie: cabecera.serie,
                numero: cabecera.id_pedido,
                empresa: cabecera.empresa,
                tienda: cabecera.tienda,
                anulado: false
            }

            let createEncabezadoEntradaInventario:tEntradaInventarioModel|null = null

            createEncabezadoEntradaInventario = await this.entradaInventarioRepository.findEntradaInventario(dataCreateEntradaInventario, false, true)

            if(createEncabezadoEntradaInventario) return createEncabezadoEntradaInventario

            createEncabezadoEntradaInventario = await this.entradaInventarioRepository.create({
                ...dataCreateEntradaInventario,
                fecha: Sequelize.literal('GETDATE()')
            }, t, true, true)

            const idEntradaInventario:number|null = createEncabezadoEntradaInventario?.idEntradaInventario || null

            if(!idEntradaInventario) throw new Error("Error al obtener el [idEntradaInventario]");

            await Promise.all(
                detalle.map(el => this.entradaInventarioDetalleRepository.create({
                    idEntradaInventario: idEntradaInventario,
                    itemCode: el.codigo_articulo,
                    uomCode: el.description,
                    quantity: el.cantidad,
                    cantidadInventario: 1
                }, t))
            )

            return createEncabezadoEntradaInventario

        }, 'PDV')

        return result
    }

    async updateEncabezadoByIdEntradaInventario(entrada:tEntradaInventarioModel, responseSap:ResponseEntryArticulosSapType) : Promise<number> {

        const result:number = await handleTransaction(async(t) => {
            const updateCount:number = await this.entradaInventarioRepository.updateByIdEntradaInventario(
                entrada.idEntradaInventario, 
                {
                    docEntry: responseSap.llave,
                    docNum:responseSap.llave2
                }, 
                true, 
                t
            ) 
            return updateCount
        }, 'PDV')

        return result

    }

}