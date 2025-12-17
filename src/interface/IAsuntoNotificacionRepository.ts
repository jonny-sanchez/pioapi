import AsuntoNotificacionModel from "../models/pioapp/tables/AsuntoNotificacionModel";

export default interface IAsuntoNotificacionRepository {

    findById(id_asunto_notificacion:number, error:boolean, raw:boolean) : Promise<AsuntoNotificacionModel|null>

}