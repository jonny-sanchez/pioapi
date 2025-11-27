import { inject, injectable } from "tsyringe";
import ProductoConvivioRepository from "../../repositories/ProductoConvivioRepository";
import { NwProductConvivioDtoType } from "../../dtos/ProductoConvivio/NwProductConvivioDto";
import { Transaction } from "sequelize";
import { userToken } from "../../types/ResponseTypes";

@injectable()
export default class ProductoConvivioService {

    constructor(@inject(ProductoConvivioRepository) private productoConvivioRepository:ProductoConvivioRepository) {}

    async createNwProductoConvivio(data:NwProductConvivioDtoType, user:userToken, t:Transaction) : Promise<any> {
        const createProductoConvivio = await this.productoConvivioRepository.create({
            name_producto_convivio: data.name_producto_convivio,
            id_category_productos_convivio: data.id_category_productos_convivio,
            descripcion_producto_convivio: data?.descripcion_producto_convivio ?? null,
            userCreatedAt: Number(user.id_users)
        }, t)
        return createProductoConvivio
    }

}