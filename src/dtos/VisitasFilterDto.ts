import * as yup from 'yup'

export const CreateVisitaDto = yup.object({
    fecha: yup.string().required("la [fecha] es un campo obligatorio.")
})

export type CreateVisitaDtoType = yup.InferType<typeof CreateVisitaDto>