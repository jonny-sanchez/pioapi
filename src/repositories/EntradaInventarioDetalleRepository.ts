import { Transaction } from "sequelize";
import IEntradaInventarioDetalleRepository from "../interface/IEntradaInventarioDetalleRepository";
import tEntradaInventarioDetalleModel from "../models/pdv/tables/tEntradaInventarioDetalleModel";
import { injectable } from "tsyringe";

@injectable()
export default class EntradaInventarioDetalleRepository implements IEntradaInventarioDetalleRepository{

    async create(data: Partial<tEntradaInventarioDetalleModel>, t:Transaction | null = null, error: boolean = true): Promise<tEntradaInventarioDetalleModel | null> {
        const result = await tEntradaInventarioDetalleModel.create(data, { transaction: t })
        if(!result && error) throw new Error("Erro al crear el detalle de entrada de inventario.");
        return result
    }

}