import { injectable } from "tsyringe";
import IConsumosConvivioRepository from "../interface/IConsumosConvivioRepository";
import { Transaction } from "sequelize";
import ConsumosConvivioModel from "../models/pioapp/tables/ConsumosConvivioModel";

@injectable()
export default class ConsumosConvivioRepository implements IConsumosConvivioRepository {

    async create(data: Partial<ConsumosConvivioModel>, t: Transaction | null = null, raw: boolean = false, includes: any[] = []): Promise<ConsumosConvivioModel> {
        const result = await ConsumosConvivioModel.create(data, { transaction: t })
        if(!result) throw new Error(`Error al crear el consumo del convivio.`)
        if (includes.length > 0) await result.reload({ include: includes, transaction: t })
        return raw ? result.get({ plain: true }) : result
    }

}