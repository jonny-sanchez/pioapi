import * as yup from 'yup'

export const ListTiendasDateDto = yup.object({
     fecha_entrega: yup
        .string()
        .matches(/^\d{4}-\d{2}-\d{2}$/, "La [fecha_entrega] debe tener el formato YYYY-MM-DD")
        .required("La [fecha_entrega] es un campo obligatorio.")
})


export type ListTiendasDateDtoType = yup.InferType<typeof ListTiendasDateDto>