import tAguinaldoModel from "../models/nomina/tables/tAguinaldoModel"

export default interface IAguinaldoRepository {

    findByYearAndUser(year:number, codEmpleado:number, error:boolean, raw:boolean) : Promise<tAguinaldoModel|null>

    findBoletaCompletaByEmpleadoAndPeriodo(codEmpleado: number, idPeriodo: number) : Promise<any>

}