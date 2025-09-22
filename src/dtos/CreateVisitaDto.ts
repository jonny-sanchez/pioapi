import * as yup from 'yup'
import { FilesConfigProps } from '../types/MiddlewareTypes'

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
    comentario: yup.string()
})

export const fileConfigVisitaDto:FilesConfigProps[] = [
    {
        nameFormData: 'foto_visita',
        maxFiles: 1,
        minFiles: 1,
        maxSize: 5,
        allowedTypes: ['image']
        // maxSize: 
    } 
]

export type CreateVisitaDtoType = yup.InferType<typeof CreateVisitaDto>