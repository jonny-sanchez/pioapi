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

    async findByIdPersonaAndIdProducto(id_personas_convivio: number, id_productos_convivio: number, error: boolean, raw: boolean): Promise<ResumenConsumoConvivioView | null> {
        const result = await ResumenConsumoConvivioView.findOne({
            where: {
                id_personas_convivio,
                id_productos_convivio
            },
            raw
        }) 
        if(!result && error) 
            throw new Error(`Error no se encontro ningun consumo con id_personas_convivio: ${id_personas_convivio} y id_productos_convivio: ${id_productos_convivio}`);
        return result
    }

}