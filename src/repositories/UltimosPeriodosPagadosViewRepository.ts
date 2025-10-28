import IUltimosPeriodosPagadosViewRepository from "../interface/IUltimosPeriodosPagadosViewRepository";
import UltimosPeriodosPagadosView from "../models/nomina/views/UltimosPeriodosPagadosView";
import { injectable } from "tsyringe";

@injectable()
export default class UltimosPeriodosPagadosViewRepository implements IUltimosPeriodosPagadosViewRepository {
    async getAll(raw: boolean = false): Promise<UltimosPeriodosPagadosView[]> {
        const result = await UltimosPeriodosPagadosView.findAll({ raw: raw })
        return result
    }
}