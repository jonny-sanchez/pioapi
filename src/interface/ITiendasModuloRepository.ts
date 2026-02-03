import TiendasModuloView from "../models/pdv/views/TiendasModuloView";

export default interface ITiendasModuloRepository {

    getAll(raw:boolean) : Promise<TiendasModuloView[]>

    findByEmpresaAndTienda(codigo_empresa:string, codigo_tienda:string, raw:boolean) : Promise<TiendasModuloView>

}