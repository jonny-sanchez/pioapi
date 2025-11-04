import { Transaction } from "sequelize";
import tEntradaInventarioDetalleModel from "../models/pdv/tables/tEntradaInventarioDetalleModel";

export default interface IEntradaInventarioDetalleRepository {

    create(data:Partial<tEntradaInventarioDetalleModel>, t:Transaction | null, error:boolean) : Promise<tEntradaInventarioDetalleModel | null>

}