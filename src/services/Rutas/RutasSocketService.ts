import { inject, injectable } from "tsyringe";
import RutasViewRepository from "../../repositories/RutasViewRepository";

@injectable()
export default class RutasSocketService {

    constructor(@inject(RutasViewRepository) private rutasViewRepository:RutasViewRepository) {}

    async getRutasSocket(data:any) : Promise<any> {
        const result = await this.rutasViewRepository.getAllRutasByFilters({
            fecha_entrega: '2025-11-24'
        })
        return result
    }

}