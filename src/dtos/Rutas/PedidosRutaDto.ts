import * as yup from 'yup'

export const PedidosRutaDto = yup.object({
    id_pedido: yup.number().required("El [id_pedido] es un campo obligatorio.")
})

export type PedidosRutaDtoType = yup.InferType<typeof PedidosRutaDto>