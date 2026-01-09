import { Transaction } from "sequelize";
import tFirmaBoletaModel from "../models/pdv/tables/tFirmaBoletaModel";

export default interface ItFirmaBoletaRepository {
    
    create(data: any, t: Transaction | null): Promise<tFirmaBoletaModel | null>;
    
    findByEmpleadoAndPeriodo(codEmpleado: number, idPeriodo: number, vigente?: boolean, raw?: boolean): Promise<tFirmaBoletaModel | null>;
    
    findByTiendaAndPeriodo(empresa: string, tienda: string, idPeriodo: number, raw?: boolean): Promise<tFirmaBoletaModel[]>;
    
    findByEmpleado(codEmpleado: number, raw?: boolean): Promise<tFirmaBoletaModel[]>;
    
    findById(idFirmaBoleta: number, raw?: boolean): Promise<tFirmaBoletaModel | null>;
    
    invalidarFirma(idFirmaBoleta: number, t: Transaction | null): Promise<boolean>;
    
    findByDispositivo(idDispositivo: string, raw?: boolean): Promise<tFirmaBoletaModel[]>;
    
    getAll(raw?: boolean): Promise<tFirmaBoletaModel[]>;

    findOrCreateByYearAndTipo(year:number, tipo:number, codEmpleado:number, idPeriodo:number, data:Partial<tFirmaBoletaModel>, t:Transaction|null, raw:boolean) : Promise<tFirmaBoletaModel>
    
}