import { inject, injectable } from "tsyringe";
import VisitaRepository from "../../repositories/VisitaRepository";
import { CreateVisitaDtoType } from "../../dtos/CreateVisitaDto";
import { Transaction } from "sequelize";
import { userToken } from "../../types/ResponseTypes";

@injectable()
export default class VisitasService {

    constructor(@inject(VisitaRepository) private visitaRepository:VisitaRepository) {}

    async createVisitaAndSaveFile(t:Transaction, data:CreateVisitaDtoType, user:userToken, file:any):Promise<any> {
        //(agregar funcionabilidad para guardar file (recibir por paremtor req.file y obtener el archivo o los archivos))
        // console.log(file.foto_visita)
        return file
        // const insertVisita = await this.visitaRepository.create({
        //     ...data, 
        //     url_image: 'prueba utl',
        //     userCreatedAt: user.id_users
        // }, t)
        // return insertVisita 
    }

}