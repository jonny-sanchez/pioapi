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

}