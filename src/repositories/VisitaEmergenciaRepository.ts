import { Sequelize, Transaction } from "sequelize";
import IVisitaEmergenciaRepository from "../interface/IVisitaEmergenciaRepository";
import VisitaEmergenciaModel from "../models/pioapp/webtables/VisitaEmergenciaModel";
import { injectable } from "tsyringe";

@injectable()
export default class VisitaEmergenciaRepository implements IVisitaEmergenciaRepository {

    async updateById(id_visita: number, data: Partial<VisitaEmergenciaModel>, t: Transaction | null = null, raw: boolean = false): Promise<VisitaEmergenciaModel | null> {
        const visita = await VisitaEmergenciaModel.findOne({
            where: {
                id_visita
            },
            attributes:{
                include: [
                    [ Sequelize.literal(`CURRENT_DATE >= "fecha_programacion"::DATE`), 'ingreso_visita_valid' ]
                ]
            },
            transaction: t
        })
        if (!visita) 
            throw new Error(`Error no se encontro ninguna visita emergencia con id: ${id_visita}`);
        await visita.update(
          { ...data },
          { transaction: t }
        )
        return raw ? visita.get({ plain: true }) : visita  
    }

    async findById(id_visita: number, error: boolean = true, raw: boolean = false): Promise<VisitaEmergenciaModel | null> {
        const result = await VisitaEmergenciaModel.findByPk(id_visita, { 
            raw,
            attributes: {
                include: [
                    [ Sequelize.literal(`CURRENT_DATE >= "fecha_programacion"::DATE`), 'ingreso_visita_valid' ]
                ]
            } 
        })
        if(!result && error) throw new Error(`Error no se encontro ninguna visita emergencia con id: ${id_visita}`)
        return result
    }

}