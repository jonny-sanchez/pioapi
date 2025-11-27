import ICategoryProductosConvivioRepository from "../interface/ICategoryProductosConvivioRepository";
import CategoryProductosConvivioModel from "../models/pioapp/tables/CategoryProductosConvivioModel";

export default class CategoryProductosConvivioRepository implements ICategoryProductosConvivioRepository {

    async getAll(raw: boolean = false): Promise<CategoryProductosConvivioModel[]> {
        const result = await CategoryProductosConvivioModel.findAll({ raw })
        return result
    }

}