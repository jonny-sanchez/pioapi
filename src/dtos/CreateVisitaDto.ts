import * as yup from 'yup'
import { FilesConfigProps } from '../types/MiddlewareTypes'
import { UploadedFile } from 'express-fileupload'

export const CreateVisitaDto = yup.object({
    empresa: yup.string().required('la [empresa] es un campo obligatorio.'),
    tienda: yup.string().required('la [tienda] es un campo obligatorio.'),
    tienda_nombre: yup.string().required('la [tienda_nombre] es un campo obligatorio.'),
    tienda_direccion: yup.string(), 
    id_tipo_visita: yup.number().integer().required('el [id_tipo_visita] es un campo obligatorio.'),
    photo_gps_longitude: yup.string(),
    photo_gps_latitude: yup.string(), 
    phone_gps_longitude: yup.string().required('la [phone_gps_longitude] es un campo obligatorio.'), 
    phone_gps_latitude: yup.string().required('la [phone_gps_latitude] es un campo obligatorio.'),
    name_original_image: yup.string(), 
    comentario: yup.string(),
    //si id_tipo_visita es igual a 1 estos campos deberian enviarse si por default la db agarra false
    uso_uniforme: yup.boolean().when('id_tipo_visita', { is: 1, then: schema => schema.required('El [uso_uniforme] es un campo obligatorio.'), otherwise: schema => schema }),
    buzon_cerrado: yup.boolean().when('id_tipo_visita', { is: 1, then: schema => schema.required('El [buzon_cerrado] es un campo obligatorio.'), otherwise: schema => schema }),
    tienda_limpia: yup.boolean().when('id_tipo_visita', { is: 1, then: schema => schema.required('El [tienda_limpia] es un campo obligatorio.'), otherwise: schema => schema }),
    cantidad_personas: yup.boolean().when('id_tipo_visita', { is: 1, then: schema => schema.required('El [cantidad_personas] es un campo obligatorio.'), otherwise: schema => schema }),
    cantidad: yup.number(),
    name_original_photo_personas: yup.string(),
    id_visita_emergencia: yup.number()
})

export const fileConfigVisitaDto:FilesConfigProps[] = [
    {
        required: true,
        nameFormData: 'foto_visita',
        maxFiles: 1,
        minFiles: 1,
        maxSize: 7,
        allowedTypes: ['image']
        // maxSize: 
    },
    {
        required: false,
        nameFormData: 'foto_personas',
        maxFiles: 1,
        // minFiles: 1,
        maxSize: 7,
        allowedTypes: ['image']
        // maxSize: 
    } 
]

export type CreateVisitaDtoTypeFiles = {
    foto_visita?: UploadedFile;
    foto_personas?: UploadedFile;
}

export type CreateVisitaDtoType = yup.InferType<typeof CreateVisitaDto>