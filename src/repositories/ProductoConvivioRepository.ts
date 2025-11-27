import { injectable } from "tsyringe";
import IProductoConvivioRepository from "../interface/IProductoConvivioRepository";
import { Transaction } from "sequelize";
import ProductoConvivioModel from "../models/pioapp/tables/ProductoConvivioModel";

@injectable()
export default class ProductoConvivioRepository implements IProductoConvivioRepository {

    async create(data: Partial<ProductoConvivioModel>, t: Transaction|null = null, raw: boolean = false): Promise<ProductoConvivioModel> {
        const result = await ProductoConvivioModel.create(data, { transaction: t }) 
        if(!result) throw new Error(`Error al crear el producto.`)
        return raw ? result.get({ plain: true }) : result
    }

}