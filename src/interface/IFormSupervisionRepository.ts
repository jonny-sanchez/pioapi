import { Transaction } from "sequelize";
import FormSupervisionModel from "../models/pioapp/tables/FormSupervisionModel";

export default interface IFormSupervisionRepository {
    
    create(data:any, t:Transaction | null, raw:boolean) : Promise<FormSupervisionModel | null>

}