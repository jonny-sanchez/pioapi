import ResumenConsumoConvivioView from "../models/pioapp/views/ResumenConsumoConvivioView";

export default interface IResumenConsumoConvivioRepository {

    findByIdPersona(id_personas_convivio:number, raw:boolean) : Promise<ResumenConsumoConvivioView[]>

}