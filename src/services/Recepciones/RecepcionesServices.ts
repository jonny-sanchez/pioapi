import { inject, injectable } from "tsyringe";
import EntradaInventarioRepository from "../../repositories/EntradaInventarioRepository";
import EntradaInventarioDetalleRepository from "../../repositories/EntradaInventarioDetalleRepository";
import { saveRecepcionDtoType } from "../../dtos/recepciones/SaveRecepcionDto";
import { userToken } from "../../types/ResponseTypes";
import { Sequelize, Transaction } from "sequelize";

@injectable()
export default class RecepcionesServices {

    constructor(
        @inject(EntradaInventarioRepository) private entradaInventarioRepository:EntradaInventarioRepository,
        @inject(EntradaInventarioDetalleRepository) private entradaInventarioDetalleRepository:EntradaInventarioDetalleRepository
    ) {}

    async saveRecepcionService(data:saveRecepcionDtoType, user:userToken, t:Transaction) : Promise<any> {
        const { cabecera, detalle } = data

        const createEncabezadoEntradaInventario = await this.entradaInventarioRepository.create({
            serie: cabecera.serie,
            numero: cabecera.id_pedido,
            empresa: cabecera.empresa,
            tienda: cabecera.tienda,
            anulado: false,
            fecha: Sequelize.literal('GETDATE()')
        }, t)

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
    }

}