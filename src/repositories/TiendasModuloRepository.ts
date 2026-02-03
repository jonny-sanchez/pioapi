import ITiendasModuloRepository from "../interface/ITiendasModuloRepository";
import TiendasModuloView from "../models/pdv/views/TiendasModuloView";
import { injectable } from "tsyringe";

@injectable()
export default class TiendasModuloRepository implements ITiendasModuloRepository {

    async getAll(raw: boolean = false): Promise<TiendasModuloView[]> {
        const result = await TiendasModuloView.findAll({ raw: raw })
        return result
    }

    async findByEmpresaAndTienda(codigo_empresa: string, codigo_tienda: string, raw: boolean = false): Promise<TiendasModuloView> {
        const result = await TiendasModuloView.findOne({
            where: {
                codigo_empresa,
                codigo_tienda
            }
        })
        if(!result) throw new Error(`Error no se encontro ninguna tienda con empresa: ${codigo_empresa} y tienda: ${codigo_tienda}`);
        return raw ? result?.get({ plain: true }) : result
    }

}