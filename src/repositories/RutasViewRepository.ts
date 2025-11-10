import { injectable } from "tsyringe";
import IRutasViewRepository from "../interface/IRutasViewRepository";
import RutasView from "../models/grupopinulito/views/RutasView";

@injectable()
export default class RutasViewRepository implements IRutasViewRepository {

    async findRutaByPedido(id_pedido: number, error: boolean = true, raw: boolean = false): Promise<RutasView | null> {
        const ruta = await RutasView.findOne({ where: { id_pedido: id_pedido }, raw: raw })
        if(error) if(!ruta) throw new Error("Ruta no encontrada."); 
        return ruta
    }

    async getAllRutasByFilters(filters: Partial<RutasView>, raw: boolean = false): Promise<RutasView[]> {
        const result = await RutasView.findAll({ 
            where: { ...filters }, 
            order: [ 
                [ 'id_pedido', 'DESC' ],
                [ 'serie', 'DESC' ] 
            ],
            raw 
        })
        return result
    }

    async getTiendasByDate(date: string, codigo_empleado_piloto:number, raw: boolean = false): Promise<RutasView[]> {
        const result = await RutasView.findAll({
            attributes: ['empresa', 'tienda', 'tienda_nombre'],
            group: ['empresa', 'tienda', 'tienda_nombre'],
            where: { 
                fecha_entrega: date,
                codigo_empleado_piloto: codigo_empleado_piloto
            },
            raw
        })
        return result
    }

    async findRutaByIdPedidoAndSerie(id_pedido: number, serie: string, raw: boolean = false): Promise<RutasView | null> {
        const result = await RutasView.findOne({ where: { id_pedido: id_pedido, serie: serie }, raw })
        if(!result) throw new Error(`Error no se encontro ninguna ruta con este pedido: ${id_pedido} y serie ${serie}.`);
        return result
    }
}