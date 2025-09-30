import { Transaction } from "sequelize";
import IVisitaRepository from "../interface/IVisitaRepository";
import VisitaModel from "../models/pioapp/tables/VisitaModel";
import { injectable } from "tsyringe";

@injectable()
export default class VisitaRepository implements IVisitaRepository {

    async create(data: any, t: Transaction | null = null): Promise<VisitaModel | null> {
        const result = await VisitaModel.create(data, { transaction: t })
        if(!result) throw new Error("Error al crear la visita.")
        return result
    }

    async findByFilters(filters: any, raw: boolean = false): Promise<VisitaModel[]> {
        const result = await VisitaModel.findAll({ where: filters, raw })
        return result
    }

}