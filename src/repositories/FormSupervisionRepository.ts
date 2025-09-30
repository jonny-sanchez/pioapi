import { Transaction } from "sequelize";
import IFormSupervisionRepository from "../interface/IFormSupervisionRepository";
import FormSupervisionModel from "../models/pioapp/tables/FormSupervisionModel";
import { injectable } from "tsyringe";

@injectable()
export default class FormSupervisionRepository implements IFormSupervisionRepository {

    async create(data: any, t: Transaction | null = null, raw: boolean = false): Promise<FormSupervisionModel | null> {
        const result = await FormSupervisionModel.create(data, { transaction: t });
        if(!result) throw new Error("Error al crear el formulario de supervision.")
        return raw ? result.get({ plain: true }) : result
    }

}