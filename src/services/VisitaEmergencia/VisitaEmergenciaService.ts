import { Transaction } from "sequelize";
import { inject, injectable } from "tsyringe";
import { UpdateVisitaEmergenciaDtoType } from "../../dtos/VisitaEmergencia/UpdateVisitaEmergenciaDto";
import VisitaEmergenciaRepository from "../../repositories/VisitaEmergenciaRepository";
import { FindVisitaEmergenciaDtoType } from "../../dtos/VisitaEmergencia/FindVisitaEmergenciaDto";

@injectable()
export default class VisitaEmergenciaService {

    constructor(
        @inject(VisitaEmergenciaRepository) private visitaEmergenciaRepository:VisitaEmergenciaRepository
    ) {}

    async updateData(data:UpdateVisitaEmergenciaDtoType, t:Transaction) : Promise<any> {
        const { id_visita, ...rest } = data
        const result = await this.visitaEmergenciaRepository.updateById(
            id_visita, { ...rest }, t
        )
        return result
    }

    async findVisitaEmergencia(data:FindVisitaEmergenciaDtoType) : Promise<any> {
        const result = await this.visitaEmergenciaRepository.findById(data.id_visita, true)
        return result
    }

}