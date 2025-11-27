import { injectable } from "tsyringe";
import IResumenConsumoConvivioRepository from "../interface/IResumenConsumoConvivioRepository";
import ResumenConsumoConvivioView from "../models/pioapp/views/ResumenConsumoConvivioView";

@injectable()
export default class ResumenConsumoConvivioRepository implements IResumenConsumoConvivioRepository {

    async findByIdPersona(id_personas_convivio: number, raw: boolean = false): Promise<ResumenConsumoConvivioView[]> {
        const result = await ResumenConsumoConvivioView.findAll({
            where: {
                id_personas_convivio: id_personas_convivio
            },
            raw,
            order: [
                [ 'fecha_creacion_producto', 'DESC' ]
            ]
        })
        return result
    }

}