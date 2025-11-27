import { Transaction } from "sequelize";
import ConsumosConvivioModel from "../models/pioapp/tables/ConsumosConvivioModel";

export default interface IConsumosConvivioRepository {

    create(data:Partial<ConsumosConvivioModel>, t:Transaction|null, raw:boolean, includes: any[]) : Promise<ConsumosConvivioModel>

}