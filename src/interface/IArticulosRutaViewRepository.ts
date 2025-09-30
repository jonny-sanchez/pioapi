import ArticulosRutaView from "../models/grupopinulito/views/ArticulosRutaView";

export default interface IArticulosRutaViewRepository {

    getAllByPedido(id_pedido:number, raw:boolean) : Promise<ArticulosRutaView[]>

}