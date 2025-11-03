import { inject, injectable } from "tsyringe";
import RutasViewRepository from "../../repositories/RutasViewRepository";
import { ListArticulosRutaDtoType } from "../../dtos/Rutas/ListArticulosRutaDto";
import { AJAX } from "../../utils/HttpHelper";
import ArticulosRutaViewRepository from "../../repositories/ArticulosRutaViewRepository";

@injectable()
export default class ArticulosRutaService {

    constructor(
        @inject(RutasViewRepository) private rutasViewRepository:RutasViewRepository,
        @inject(ArticulosRutaViewRepository) private articulosRutaViewRepository:ArticulosRutaViewRepository  
    ) {}

    async getListArtExternalServicePOS(data:ListArticulosRutaDtoType):Promise<any> {
        const ruta = await this.rutasViewRepository.findRutaByIdPedidoAndSerie(data.id_pedido, data.serie, true);

        if(ruta?.recepccionada != 0) 
            throw new Error(`Opps. La boleta ya fue recepccionada en la tienda ${ ruta?.tienda_nombre || ' -- ' }`);

        const resultArticulosRecepccion = await this.articulosRutaViewRepository.getAllByPedidoAndSerie(
            data.id_pedido,
            data.serie
        )

        const resultJsonRecepccion = {
            cabecera: ruta,
            detalle: resultArticulosRecepccion
        }

        return resultJsonRecepccion
    }

}