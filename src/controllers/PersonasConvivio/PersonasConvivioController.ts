import { inject, injectable } from "tsyringe";
import { handleSend } from "../../utils/HandlerFactory";
import { JsonResponse, RequestAuth, userToken } from "../../types/ResponseTypes";
import { Response } from "express";
import { CreateInvitadoDtoType } from "../../dtos/PersonasConvivio/CreateInvitadoDto";
import PersonasConvivioService from "../../services/PersonasConvivio/PersonasConvivioService";
import { Transaction } from "sequelize";
import { PersonasQRDtoType } from "../../dtos/PersonasConvivio/PersonasQRDto";

@injectable()
export default class PersonasConvivioController {

    constructor(@inject(PersonasConvivioService) private personasConvivioService:PersonasConvivioService) {}

    async createNwPersonaInvitada (req:RequestAuth<CreateInvitadoDtoType>, res:Response<JsonResponse<any>>) {
        await handleSend(res, async(t) => {
            const result = await this.personasConvivioService.createInvitado(
                req.body,
                req.user as userToken,
                t as Transaction
            )
            return result
        }, 'Invitado creado correctamente.', true, 'PIOAPP')
    }

    async getAllInvitados (req:RequestAuth<any>, res:Response<JsonResponse<any[]>>) {
        await handleSend(res, async() => {
            const result = await this.personasConvivioService.findInvitadosAll()
            return result
        }, 'Invitados listados correctamente.')
    }

    async getPersonaScannerQR(req:RequestAuth<PersonasQRDtoType>, res:Response<JsonResponse<any>>) {
        await handleSend(res, async(t) => {
            const result = await this.personasConvivioService.findOrCreatePersonaConvivio(
                req.body,
                t as Transaction
            )
            return result 
        }, 'Persona listada correctamente', true, 'PIOAPP')
    }

}