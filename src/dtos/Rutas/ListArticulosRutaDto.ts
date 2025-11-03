import * as yup from 'yup'

export const ListArticulosRutaDto = yup.object({
    serie: yup.string().required("La [serie] es un campo obligatorio."),
    id_pedido: yup.number().required("EL [id_pedido] es un campo obligatorio.")
})

export type ListArticulosRutaDtoType = yup.InferType<typeof ListArticulosRutaDto>