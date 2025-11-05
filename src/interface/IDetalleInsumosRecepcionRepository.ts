import InsumosDetalleRecepcionView from "../models/grupopinulito/views/InsumosDetalleRecepcionView";

export default interface IDetalleInsumosRecepcionRepository {

    getProductosByIdEntradaInventario (idEntradaInventario:number, raw:boolean) : Promise<InsumosDetalleRecepcionView[]>

}