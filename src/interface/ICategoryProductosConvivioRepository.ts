import CategoryProductosConvivioModel from "../models/pioapp/tables/CategoryProductosConvivioModel";

export default interface ICategoryProductosConvivioRepository {

    getAll(raw:boolean) : Promise<CategoryProductosConvivioModel[]>

}