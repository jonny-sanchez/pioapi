import { Transaction } from "sequelize";
import VisitaModel from "../models/pioapp/tables/VisitaModel";


export default interface IVisitaRepository {

    create(data:any, t:Transaction | null):Promise<VisitaModel | null>

    findByFilters(filters:any, raw:boolean):Promise<VisitaModel[]>

    getAll(raw:boolean):Promise<VisitaModel[]>

}