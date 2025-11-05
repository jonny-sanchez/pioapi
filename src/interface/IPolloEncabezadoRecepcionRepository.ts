import PolloEncabezadoRecepcionView from "../models/grupopinulito/views/PolloEncabezadoRecepcionView";

export default interface IPolloEncabezadoRecepcionRepository {

    findEncabezadoByIdEntradaInventario(idEntradaInventario:number, error:boolean, raw:boolean) : Promise<PolloEncabezadoRecepcionView | null>

}