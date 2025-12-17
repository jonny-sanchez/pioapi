import { inject, injectable } from "tsyringe";
import VisitaRepository from "../../repositories/VisitaRepository";
import { CreateVisitaDtoType, CreateVisitaDtoTypeFiles } from "../../dtos/CreateVisitaDto";
import { Transaction } from "sequelize";
import { userToken } from "../../types/ResponseTypes";
import FormSupervisionRepository from "../../repositories/FormSupervisionRepository";
import { toBoolean } from "../../utils/TypeHelpers";
import FileServices from "../S3/FileServices";
import VisitaEmergenciaRepository from "../../repositories/VisitaEmergenciaRepository";

@injectable()
export default class VisitasService {

    constructor(
        @inject(VisitaRepository) private visitaRepository:VisitaRepository,
        @inject(FormSupervisionRepository) private formSupervisionRepository:FormSupervisionRepository,
        @inject(FileServices) private fileServices:FileServices,
        @inject(VisitaEmergenciaRepository) private visitaEmergenciaRepository:VisitaEmergenciaRepository 
    ) {}

    async createVisitaAndSaveFile(t:Transaction, data:CreateVisitaDtoType, user:userToken, file:CreateVisitaDtoTypeFiles):Promise<any> {
        //si el id de la visita emegencia viene en el body entonces validar si existe y editar su estado a finalizado(3)
        if(data.id_visita_emergencia) await this.visitaEmergenciaRepository.updateById(
            data.id_visita_emergencia, { id_estado: 3 }, t
        )
        //(agregar funcionabilidad para guardar file (recibir por paremtor req.file y obtener el archivo o los archivos))
        const resultUploadPhotoVisita = await this.fileServices.fileUploadSingle(
            file.foto_visita, "visitas"
        )
        const resultUploadPhotoPersonas = file.foto_personas 
            ? await this.fileServices.fileUploadSingle(file.foto_personas, 'visitas') 
            : null 
        const insertFormSupervision = data.id_tipo_visita == 1 
            ? await this.formSupervisionRepository.create({...data, url_photo_personas: resultUploadPhotoPersonas?.urlS3 || null, cantidad: !toBoolean(data?.cantidad_personas) ? null : data.cantidad}, t, true) 
            : null
        const insertVisita = await this.visitaRepository.create(
            {...data, google_maps_url: `https://www.google.com/maps/search/?api=1&query=${data.phone_gps_latitude},${data.phone_gps_longitude}`, id_form_supervision: insertFormSupervision?.id_form_supervision || null, url_image: resultUploadPhotoVisita.urlS3, userCreatedAt: user.id_users}, t
        )
        return insertVisita 
    }

    async filterVisitas():Promise<any> {
        
    }

}