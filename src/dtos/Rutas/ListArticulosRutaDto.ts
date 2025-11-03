import * as yup from 'yup'

export const ListArticulosRutaDto = yup.object({
    serie: yup.string().required("La [serie] es un campo obligatorio."),
    docNum: yup.number().required("La [docNum] es un campo obligatorio.")
})

export type ListArticulosRutaDtoType = yup.InferType<typeof ListArticulosRutaDto>