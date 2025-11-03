import RutasView from "../models/grupopinulito/views/RutasView";

export default interface IRutasViewRepository {

    findRutaByPedido(id_pedido:number, error:boolean, raw:boolean) : Promise<RutasView | null>;

    getAllRutasByFilters(filters:RutasView, raw:boolean) : Promise<RutasView[]>;

    getTiendasByDate(date:string, codigo_empleado_piloto:number, raw:boolean) : Promise<RutasView[]>

    findRutaByIdPedidoAndSerie(id_pedido:number, serie:string, raw:boolean) : Promise<RutasView | null>

}