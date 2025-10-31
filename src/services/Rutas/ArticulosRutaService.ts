import { inject, injectable } from "tsyringe";
import RutasViewRepository from "../../repositories/RutasViewRepository";
import { ListArticulosRutaDtoType } from "../../dtos/Rutas/ListArticulosRutaDto";
import { AJAX } from "../../utils/HttpHelper";

@injectable()
export default class ArticulosRutaService {

    constructor(@inject(RutasViewRepository) private rutasViewRepository:RutasViewRepository) {}

    async getListArtExternalServicePOS(data:ListArticulosRutaDtoType):Promise<any> {
        const ruta = await this.rutasViewRepository.findRutaByIdPedidoAndSerie(data.docNum, data.serie, true);

        if(ruta?.recepccionada != 0) 
            throw new Error(`Opps. La boleta ya fue recepccionada en la tienda ${ ruta?.tienda_nombre || ' -- ' }`);

        const resultArticulosPOS = await AJAX(
            `http://sistema.grupopinulito.com:81/POS/services/consultaEntradaInsumos3.php`,
            'POST',
            null,
            data,
        )

        return resultArticulosPOS
    }

}