import { Transaction } from "sequelize";
import ProductoConvivioModel from "../models/pioapp/tables/ProductoConvivioModel";

export default interface IProductoConvivioRepository {

    create(data:Partial<ProductoConvivioModel>, t:Transaction|null, raw:boolean) : Promise<ProductoConvivioModel>

}