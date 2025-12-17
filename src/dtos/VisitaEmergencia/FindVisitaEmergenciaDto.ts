import * as yup from "yup";

export const FindVisitaEmergenciaDto = yup.object({
    id_visita: yup.number().required("El [id_visita] es un campo obligatorio"),
}).required()

export type FindVisitaEmergenciaDtoType = yup.InferType<typeof FindVisitaEmergenciaDto>