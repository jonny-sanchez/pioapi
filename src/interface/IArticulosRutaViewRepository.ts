import ArticulosRutaView from "../models/grupopinulito/views/ArticulosRutaView";

export default interface IArticulosRutaViewRepository {

    getAllByPedido(id_pedido:number, raw:boolean) : Promise<ArticulosRutaView[]>

    getAllByPedidoAndSerie(id_pedido:number, serie:string, raw:boolean) : Promise<ArticulosRutaView[]>

}