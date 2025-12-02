import ResumenConsumoConvivioView from "../models/pioapp/views/ResumenConsumoConvivioView";

export default interface IResumenConsumoConvivioRepository {

    findByIdPersona(id_personas_convivio:number, raw:boolean) : Promise<ResumenConsumoConvivioView[]>

    findByIdPersonaAndIdProducto(id_personas_convivio:number, id_productos_convivio:number, error:boolean, raw:boolean) : Promise<ResumenConsumoConvivioView|null>

}