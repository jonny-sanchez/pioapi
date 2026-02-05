import { inject, injectable } from "tsyringe";
import TiendasModuloRepository from "../../repositories/TiendasModuloRepository";
import { TiendaByCodigoDtoType } from "../../dtos/TiendasModulo/TiendaByCodigoDto";
import redisClient from "../../config/redisClient";
import { KEY_CACHE_ALL_TIENDAS } from "../../cache/TiendasModulo/TiendasModuloConstant";
import { JsonParseKey, JsonStringfyKey } from "../../utils/Cache/CacheUtils";

@injectable()
export default class TiendasModuloService {

    constructor(
        @inject(TiendasModuloRepository) private tiendasModuloRepository:TiendasModuloRepository
    ) {}

    async getAllTiendas() : Promise<any> {
        const cacheTiendas = await redisClient.get(KEY_CACHE_ALL_TIENDAS)
        if(cacheTiendas) return JsonParseKey(cacheTiendas)
        const result = await this.tiendasModuloRepository.getAll()
        await redisClient.set(KEY_CACHE_ALL_TIENDAS, JsonStringfyKey(result), { expiration: { type: 'EX', value: 86400 } })
        return result
    }

    async findTienda(data:TiendaByCodigoDtoType) : Promise<any> {
        const result = await this.tiendasModuloRepository.findByEmpresaAndTienda(
            data.codigo_empresa, data.codigo_tienda, true
        )
        return result
    }

}