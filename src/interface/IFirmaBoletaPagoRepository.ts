import { Transaction } from "sequelize";
import FirmaBoletaPagoModel from "../models/pioapp/tables/FirmaBoletaPagoModel";

export default interface IFirmaBoletaPagoRepository {
    
    create(data: any, t: Transaction | null): Promise<FirmaBoletaPagoModel | null>;
    
    findByUserAndPeriodo(id_users: number, id_periodo: number, valido?: boolean, raw?: boolean, id_tipo_boleta?: number): Promise<FirmaBoletaPagoModel | null>;
    
    findByUserId(id_users: number, raw?: boolean): Promise<FirmaBoletaPagoModel[]>;
    
    findByPeriodo(id_periodo: number, raw?: boolean): Promise<FirmaBoletaPagoModel[]>;
    
    findById(id_firma_boleta_pago: string, raw?: boolean): Promise<FirmaBoletaPagoModel | null>;
    
    invalidarFirma(id_firma_boleta_pago: string, motivo: string, t: Transaction | null): Promise<boolean>;
    
    getAll(raw?: boolean): Promise<FirmaBoletaPagoModel[]>;

    findOrCreate(where:Partial<FirmaBoletaPagoModel>, data:Partial<FirmaBoletaPagoModel>, t:Transaction|null, raw:boolean) : Promise<FirmaBoletaPagoModel>
    
}