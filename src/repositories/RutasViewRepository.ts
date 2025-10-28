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
        const result = await RutasView.findAll({ where: { ...filters }, raw })
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

}