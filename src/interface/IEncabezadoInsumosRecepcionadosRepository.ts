import InsumosEncabezadoRecepcionadosView from "../models/grupopinulito/views/InsumosEncabezadoRecepcionadosView";

export default interface IEncabezadoInsumosRecepcionadosRepository {

    findEncabezadoBySerieAndIdEntradaInventario (serie:string, idEntrada:number, error:boolean, raw:boolean) : Promise<InsumosEncabezadoRecepcionadosView | null>

} 