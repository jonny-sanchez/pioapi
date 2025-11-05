import PolloDetalleRecepcionView from "../models/grupopinulito/views/PolloDetalleRecepcionView";

export default interface IPolloDetalleRecepcionadoRepository {

    getAllDetalleByIdEntradaInventario(idEntradaInventario:number, raw:boolean) : Promise<PolloDetalleRecepcionView[]>

}