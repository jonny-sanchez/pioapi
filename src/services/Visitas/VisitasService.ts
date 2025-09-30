import { inject, injectable } from "tsyringe";
import VisitaRepository from "../../repositories/VisitaRepository";
import { CreateVisitaDtoType, CreateVisitaDtoTypeFiles } from "../../dtos/CreateVisitaDto";
import { Transaction } from "sequelize";
import { userToken } from "../../types/ResponseTypes";
import FormSupervisionRepository from "../../repositories/FormSupervisionRepository";
import { toBoolean } from "../../utils/TypeHelpers";
import FileServices from "../S3/FileServices";

@injectable()
export default class VisitasService {

    constructor(
        @inject(VisitaRepository) private visitaRepository:VisitaRepository,
        @inject(FormSupervisionRepository) private formSupervisionRepository:FormSupervisionRepository,
        @inject(FileServices) private fileServices:FileServices  
    ) {}

    async createVisitaAndSaveFile(t:Transaction, data:CreateVisitaDtoType, user:userToken, file:CreateVisitaDtoTypeFiles):Promise<any> {
        //(agregar funcionabilidad para guardar file (recibir por paremtor req.file y obtener el archivo o los archivos))
        const resultUploadPhotoVisita = await this.fileServices.fileUploadSingle(file.foto_visita, "visitas")
        const resultUploadPhotoPersonas = file.foto_personas ? await this.fileServices.fileUploadSingle(file.foto_personas) : null 
        const insertFormSupervision = data.id_tipo_visita == 1 ? 
            await this.formSupervisionRepository.create({...data, url_photo_personas: resultUploadPhotoPersonas?.urlS3 || null, cantidad: !toBoolean(data?.cantidad_personas) ? null : data.cantidad}, t, true) : null
        const insertVisita = await this.visitaRepository.create({...data, id_form_supervision: insertFormSupervision?.id_form_supervision || null, url_image: resultUploadPhotoVisita.urlS3, userCreatedAt: user.id_users}, t)
        return insertVisita 
    }

    async filterVisitas():Promise<any> {
        
    }

}