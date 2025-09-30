import { inject, injectable } from "tsyringe";
import VisitaRepository from "../../repositories/VisitaRepository";
import { CreateVisitaDtoType } from "../../dtos/CreateVisitaDto";
import { Transaction } from "sequelize";
import { userToken } from "../../types/ResponseTypes";
import FormSupervisionRepository from "../../repositories/FormSupervisionRepository";
import { toBoolean } from "../../utils/TypeHelpers";

@injectable()
export default class VisitasService {

    constructor(
        @inject(VisitaRepository) private visitaRepository:VisitaRepository,
        @inject(FormSupervisionRepository) private formSupervisionRepository:FormSupervisionRepository 
    ) {}

    async createVisitaAndSaveFile(t:Transaction, data:CreateVisitaDtoType, user:userToken, file:any):Promise<any> {
        //(agregar funcionabilidad para guardar file (recibir por paremtor req.file y obtener el archivo o los archivos))
        // console.log(file.foto_visita)  
        const insertFormSupervision = data.id_tipo_visita == 1 ? 
        await this.formSupervisionRepository.create({...data, cantidad: !toBoolean(data?.cantidad_personas) ? null : data.cantidad}, t, true) : null
        const insertVisita = await this.visitaRepository.create({...data, id_form_supervision: insertFormSupervision?.id_form_supervision || null, url_image: 'prueba utl', userCreatedAt: user.id_users}, t)
        return insertVisita 
    }

    async filterVisitas():Promise<any> {
        
    }

}