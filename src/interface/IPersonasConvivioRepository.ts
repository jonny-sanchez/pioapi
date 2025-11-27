import { Transaction } from "sequelize";
import PersonasConvivioModel from "../models/pioapp/tables/PersonasConvivioModel";

export default interface IPersonasConvivioRepository {

    create(data:Partial<PersonasConvivioModel>, t:Transaction|null, raw:boolean, includes: any[]) : Promise<PersonasConvivioModel>

    findLastPersonInvitado(raw:boolean) : Promise<PersonasConvivioModel|null>

    findAllInvitados(raw:boolean) : Promise<PersonasConvivioModel[]>

    findPersonaByCodigoAndIdTipo(codigo:number, id_tipo_persona_convivio:number, includes: any[], error:boolean, raw:boolean) : Promise<PersonasConvivioModel|null>

}