import * as yup from "yup";

export const UpdateVisitaEmergenciaDto = yup.object({
    id_visita: yup.number().required("El [id_visita] es un campo obligatorio"),
    empresa: yup.string(),
    tienda: yup.string(),
    tienda_nombre: yup.string(),
    tienda_direccion: yup.string().nullable(),
    id_tipo_visita: yup.number(),
    last_gps_longitude: yup.string().nullable(),
    last_gps_latitude: yup.string().nullable(),
    new_gps_longitude: yup.string(),
    new_gps_latitude: yup.string(),
    comentario: yup.string().nullable(),
    id_estado: yup.number(),
    fecha_programacion: yup.string().nullable(),
    user_asignado: yup.string(),
    nombre_user_asignado: yup.string(),
}).required()

export type UpdateVisitaEmergenciaDtoType = yup.InferType<typeof UpdateVisitaEmergenciaDto>