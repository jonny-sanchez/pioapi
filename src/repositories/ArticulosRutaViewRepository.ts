import IArticulosRutaViewRepository from "../interface/IArticulosRutaViewRepository";
import { injectable } from "tsyringe";
import ArticulosRutaView from "../models/grupopinulito/views/ArticulosRutaView";

@injectable()
export default class ArticulosRutaViewRepository implements IArticulosRutaViewRepository {

    async getAllByPedido(id_pedido: number, raw: boolean = false): Promise<ArticulosRutaView[]> {
        const articulos = await ArticulosRutaView.findAll({ where: { id_pedido: id_pedido }, raw: raw })
        return articulos
    }

}