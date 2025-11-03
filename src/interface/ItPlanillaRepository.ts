import tPlanillaModel from "../models/nomina/tables/tPlanillaModel";

export default interface ItPlanillaRepository {
    
    findById(idPlanilla: number, raw?: boolean): Promise<tPlanillaModel | null>;
    
    findByEmpleadoAndPeriodo(codEmpleado: number, idPeriodo: number, raw?: boolean): Promise<tPlanillaModel | null>;
    
    findByEmpleado(codEmpleado: number, raw?: boolean): Promise<tPlanillaModel[]>;
    
    findByPeriodo(idPeriodo: number, raw?: boolean): Promise<tPlanillaModel[]>;
    
    findByEmpresa(idEmpresa: number, raw?: boolean): Promise<tPlanillaModel[]>;
    
    findByDepartamento(departamento: string, raw?: boolean): Promise<tPlanillaModel[]>;
    
    findByEmpresaAndPeriodo(idEmpresa: number, idPeriodo: number, raw?: boolean): Promise<tPlanillaModel[]>;
    
    calculateTotalLiquidoByPeriodo(idPeriodo: number): Promise<number>;
    
    getEmpleadosSinPlanilla(idPeriodo: number): Promise<any[]>;
    
    getAll(raw?: boolean): Promise<tPlanillaModel[]>;
    
    findBoletaCompletaByEmpleadoAndPeriodo(codEmpleado: number, idPeriodo: number): Promise<any>;
    
}