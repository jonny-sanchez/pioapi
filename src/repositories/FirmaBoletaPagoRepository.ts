import { Transaction } from "sequelize";
import IFirmaBoletaPagoRepository from "../interface/IFirmaBoletaPagoRepository";
import FirmaBoletaPagoModel from "../models/pioapp/tables/FirmaBoletaPagoModel";
import { injectable } from "tsyringe";
import { TipoPeriodoEnum } from "../types/PeriodosNomina/PeriodosPagadosType";

@injectable()
export default class FirmaBoletaPagoRepository implements IFirmaBoletaPagoRepository {

    async create(data: any, t: Transaction | null = null): Promise<FirmaBoletaPagoModel | null> {
        const result = await FirmaBoletaPagoModel.create(data, { transaction: t });
        if (!result) throw new Error("Error al crear la firma de boleta de pago.");
        return result;
    }

    async findByUserAndPeriodo(
        id_users: number, 
        id_periodo: number, 
        valido: boolean = true, 
        raw: boolean = false,
        id_tipo_boleta: number = TipoPeriodoEnum.QUINCENA
    ): Promise<FirmaBoletaPagoModel | null> {
        const result = await FirmaBoletaPagoModel.findOne({
            where: {
                id_users,
                id_periodo,
                valido,
                id_tipo_boleta
            },
            raw
        });
        return result;
    }

    async findByUserId(id_users: number, raw: boolean = false): Promise<FirmaBoletaPagoModel[]> {
        const result = await FirmaBoletaPagoModel.findAll({
            where: { id_users },
            order: [['createdAt', 'DESC']],
            raw
        });
        return result;
    }

    async findByPeriodo(id_periodo: number, raw: boolean = false): Promise<FirmaBoletaPagoModel[]> {
        const result = await FirmaBoletaPagoModel.findAll({
            where: { 
                id_periodo,
                valido: true 
            },
            order: [['createdAt', 'DESC']],
            raw
        });
        return result;
    }

    async findById(id_firma_boleta_pago: string, raw: boolean = false): Promise<FirmaBoletaPagoModel | null> {
        const result = await FirmaBoletaPagoModel.findByPk(id_firma_boleta_pago, { raw });
        return result;
    }

    async invalidarFirma(
        id_firma_boleta_pago: string, 
        motivo: string, 
        t: Transaction | null = null
    ): Promise<boolean> {
        const [affectedRows] = await FirmaBoletaPagoModel.update(
            { 
                valido: false, 
                motivo_invalidacion: motivo 
            },
            { 
                where: { id_firma_boleta_pago }, 
                transaction: t 
            }
        );
        return affectedRows > 0;
    }

    async getAll(raw: boolean = false): Promise<FirmaBoletaPagoModel[]> {
        const result = await FirmaBoletaPagoModel.findAll({
            order: [['createdAt', 'DESC']],
            raw
        });
        return result;
    }

    async findOrCreate(where: Partial<FirmaBoletaPagoModel>, data: Partial<FirmaBoletaPagoModel>, t: Transaction | null = null, raw: boolean = false): Promise<FirmaBoletaPagoModel> {
        const [firma, created] = await FirmaBoletaPagoModel.findOrCreate({
            where: { ...where },
            defaults: { ...data },
            transaction: t
        })
        return raw ? firma.get({ plain: true }) : firma
    }

}