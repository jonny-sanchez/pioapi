import IAsuntoNotificacionRepository from "../interface/IAsuntoNotificacionRepository";
import AsuntoNotificacionModel from "../models/pioapp/tables/AsuntoNotificacionModel";

export default class AsuntoNotificacionRepository implements IAsuntoNotificacionRepository {

    async findById(id_asunto_notificacion: number, error: boolean = true, raw: boolean = false): Promise<AsuntoNotificacionModel | null> {
        const result = await AsuntoNotificacionModel.findByPk(id_asunto_notificacion, { raw })
        if(!result && error) throw new Error(`Error no se encontro ningun asunto con id: ${id_asunto_notificacion}`)
        return result
    }

}