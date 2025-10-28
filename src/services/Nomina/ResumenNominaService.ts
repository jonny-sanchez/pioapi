import { inject, injectable } from "tsyringe";
import ResumenNominaViewRepository from "../../repositories/ResumenNominaViewRepository";
import ResumenNominaView from "../../models/nomina/views/ResumenNominaView";
import { FindNominaDtoType } from "../../dtos/FindNominaDto";
import { userToken } from "../../types/ResponseTypes";

@injectable()
export default class ResumenNominaServices {

    constructor(
        @inject(ResumenNominaViewRepository) private ResumenNominaViewRepository: ResumenNominaViewRepository
    ) {}

    async findByCodigoAndPeriodo(user:userToken, data:FindNominaDtoType) : Promise<ResumenNominaView[] | null | undefined> {
        return await this.ResumenNominaViewRepository.getByCodigoAndPeriodo(Number(user.id_users), Number(data.periodo));
    }
}