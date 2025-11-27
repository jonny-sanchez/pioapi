import { injectable } from "tsyringe";
import IPersonasConvivioRepository from "../interface/IPersonasConvivioRepository";
import { Transaction } from "sequelize";
import PersonasConvivioModel from "../models/pioapp/tables/PersonasConvivioModel";

@injectable()
export default class PersonasConvivioRepository implements IPersonasConvivioRepository {

    async create(data: Partial<PersonasConvivioModel>, t: Transaction | null = null, raw: boolean = false, includes: any[] = []): Promise<PersonasConvivioModel> {
        const result = await PersonasConvivioModel.create(data, { transaction: t })
        if(!result) throw new Error(`Error al crear la persona del convivio.`)
        if (includes.length > 0) await result.reload({ include: includes, transaction: t })
        return raw ? result.get({ plain: true }) : result
    }
    
    async findLastPersonInvitado(raw: boolean = false): Promise<PersonasConvivioModel | null> {
        const result = await PersonasConvivioModel.findOne({  
            where: {
                id_tipo_persona_convivio: 2,
            },
            order: [
                [ 'codigo', 'DESC' ]
            ],
            raw
        })
        return result
    }

    async findAllInvitados(raw: boolean = false): Promise<PersonasConvivioModel[]> {
        const result = await PersonasConvivioModel.findAll({
            where: {
                id_tipo_persona_convivio: 2,
            },
            order: [
                [ 'codigo', 'DESC' ]
            ],
            raw
        })
        return result
    }

    async findPersonaByCodigoAndIdTipo(codigo: number, id_tipo_persona_convivio: number, includes: any[] = [], error: boolean = true, raw: boolean = false): Promise<PersonasConvivioModel | null> {
        const result = await PersonasConvivioModel.findOne({
            where: {
                codigo: codigo,
                id_tipo_persona_convivio: id_tipo_persona_convivio
            },
            ...( includes.length > 0 ? {
                include: includes
            } : {} ),
            raw,
            nest: raw
        })
        if(!result && error) throw new Error(`No se encontro ninguna persona del convivio.`);
        return result
    }

}