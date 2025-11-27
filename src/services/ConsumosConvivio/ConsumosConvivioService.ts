import { inject, injectable } from "tsyringe";
import ConsumosConvivioRepository from "../../repositories/ConsumosConvivioRepository";
import { CreateConsumoConvivioDtoType } from "../../dtos/ConsumosConvivio/CreateConsumoConvivioDto";
import { Transaction } from "sequelize";
import { userToken } from "../../types/ResponseTypes";
import ResumenConsumoConvivioRepository from "../../repositories/ResumenConsumoConvivioRepository";
import { ListConsumoPersonaConvivioDtoType } from "../../dtos/ConsumosConvivio/ListConsumoPersonaConvivioDto";

@injectable()
export default class ConsumosConvivioService {

    constructor(
        @inject(ConsumosConvivioRepository) private consumosConvivioRepository:ConsumosConvivioRepository,
        @inject(ResumenConsumoConvivioRepository) private resumenConsumoConvivioRepository:ResumenConsumoConvivioRepository
    ) {}

    async createConsumo(data:CreateConsumoConvivioDtoType, t:Transaction, user:userToken) :Promise<any> {
        const consumo = await this.consumosConvivioRepository.create({
            id_personas_convivio: data.id_personas_convivio,
            id_productos_convivio: data.id_productos_convivio,
            cantidad: 1,
            userCreatedAt: Number(user?.id_users ?? null)
        }, t)
        return consumo
    }

    async getConsumoByPersona(data:ListConsumoPersonaConvivioDtoType) : Promise<any> {
        const consumoPersona = await this.resumenConsumoConvivioRepository.findByIdPersona(data.id_personas_convivio)
        return consumoPersona
    }

}