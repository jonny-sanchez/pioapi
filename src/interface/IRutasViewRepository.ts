import RutasView from "../models/grupopinulito/views/RutasView";

export default interface IRutasViewRepository {

    findRutaByPedido(id_pedido:number, error:boolean, raw:boolean) : Promise<RutasView | null>;

}