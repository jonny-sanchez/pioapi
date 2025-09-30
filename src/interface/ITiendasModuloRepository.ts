import TiendasModuloView from "../models/pdv/views/TiendasModuloView";

export default interface ITiendasModuloRepository {

    getAll(raw:boolean) : Promise<TiendasModuloView[]>

}