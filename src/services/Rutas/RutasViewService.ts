import { inject, injectable } from "tsyringe";
import RutasViewRepository from "../../repositories/RutasViewRepository";
import { ListRutasFilterDtoType } from "../../dtos/Rutas/ListRutasFilterDto";
import { userToken } from "../../types/ResponseTypes";
import { ListTiendasDateDtoType } from "../../dtos/Rutas/ListTiendasDateDto";

@injectable()
export default class RutasViewService {

    constructor(@inject(RutasViewRepository) private rutasViewRepository:RutasViewRepository) {}

    async filterRutas(data:ListRutasFilterDtoType, user:userToken) : Promise<any[]> {
        const empresaData = data?.empresa || ""
        const tiendaData = data?.tienda || ""
        const listRutas = await this.rutasViewRepository.getAllRutasByFilters({ 
            fecha_entrega: data.fecha_entrega,
            codigo_empleado_piloto: Number(user.id_users),
            ...( empresaData ? { empresa: empresaData } : {} ),
            ...( tiendaData ? { tienda: tiendaData } : {} )
            // codigo_empleado_piloto: 3657
        })
        return listRutas;
    }

    async groupTiendasRutasByDate(data:ListTiendasDateDtoType, user:userToken) : Promise<any[]> {
        const tiendaGroup = await this.rutasViewRepository.getTiendasByDate(
            data.fecha_entrega, 
            Number(user.id_users)
        )
        return tiendaGroup
    }

}