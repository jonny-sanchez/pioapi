import { inject, injectable } from "tsyringe";
import { CreateInvitadoDtoType } from "../../dtos/PersonasConvivio/CreateInvitadoDto";
import { userToken } from "../../types/ResponseTypes";
import { Transaction } from "sequelize";
import PersonasConvivioRepository from "../../repositories/PersonasConvivioRepository";
import { PersonasQRDtoType } from "../../dtos/PersonasConvivio/PersonasQRDto";
import DetalleEmpleadoCootraguaViewRepository from "../../repositories/DetalleEmpleadoCootraguaViewRepository";
import TipoPersonasConvivioModel from "../../models/pioapp/tables/TipoPersonasConvivioModel";

@injectable()
export default class PersonasConvivioService {

    constructor(
        @inject(PersonasConvivioRepository) private personasConvivioRepository:PersonasConvivioRepository,
        @inject(DetalleEmpleadoCootraguaViewRepository) private detalleEmpleadoCootraguaViewRepository:DetalleEmpleadoCootraguaViewRepository
    ) {}

    async createInvitado(data:CreateInvitadoDtoType, user:userToken, t:Transaction) : Promise<any> {
        const lastInvitado = await this.personasConvivioRepository.findLastPersonInvitado(true)
        const codigoInvitado = Number(lastInvitado?.codigo ?? 0) + 1   
        const createInvitado = await this.personasConvivioRepository.create({
            codigo: codigoInvitado,
            id_tipo_persona_convivio: 2,
            nombre_persona_convivio: data.nombre_persona_convivio,
            empresa: data?.empresa ?? ''
        }, t)
        return createInvitado
    }

    async findInvitadosAll() : Promise<any> {
        return await this.personasConvivioRepository.findAllInvitados()
    }

    async findOrCreatePersonaConvivio(data:PersonasQRDtoType, t:Transaction) : Promise<any> {
        let personaConvivio = await this.personasConvivioRepository.findPersonaByCodigoAndIdTipo(
            data.codigo, data.id_tipo_persona_convivio, [TipoPersonasConvivioModel], false, true
        )
        if(data.id_tipo_persona_convivio == 1 && !personaConvivio) {
            const empleadoNomina = await this.detalleEmpleadoCootraguaViewRepository.findByCodigo(
                data.codigo, true, true
            )
            personaConvivio = await this.personasConvivioRepository.create({
                codigo: data.codigo,
                id_tipo_persona_convivio: data.id_tipo_persona_convivio,
                nombre_persona_convivio: empleadoNomina?.nombreEmpleadoCompleto ?? ''
            }, t, false, [TipoPersonasConvivioModel])
        }
        if(!personaConvivio) throw new Error(`Error al encontrar la persona del convivio`);
        return personaConvivio
    }

}