import { Transaction } from "sequelize";
import tEntradaInventarioModel from "../models/pdv/tables/tEntradaInventarioModel";

export default interface IEntradaInventarioRepository {

    create(data:Partial<tEntradaInventarioModel>, t:Transaction | null, error:boolean) : Promise<tEntradaInventarioModel | null>;

}