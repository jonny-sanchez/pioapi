import { injectable } from "tsyringe";
import IEntradaInventarioRepository from "../interface/IEntradaInventarioRepository";
import tEntradaInventarioModel from "../models/pdv/tables/tEntradaInventarioModel";
import { Transaction } from "sequelize";

@injectable()
export default class EntradaInventarioRepository implements IEntradaInventarioRepository {

    async create(data: Partial<tEntradaInventarioModel>, t:Transaction | null = null, error: boolean = true): Promise<tEntradaInventarioModel | null> {
        const result = await tEntradaInventarioModel.create(data, { transaction: t })
        if(!result && error) throw new Error("Error al crear la entrada inventario.");
        return result
    }

}